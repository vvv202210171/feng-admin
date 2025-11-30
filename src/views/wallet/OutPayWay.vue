<template>
    <page-header-wrapper>
        <a-card :bordered="false">
            <!-- :model="queryParam" -->
            <a-form name="configSearch" layout="inline" autocomplete="off" style="margin-bottom: 14px"
                @submit="doSearch">
                <a-form-item label="搜索内容">
                    <a-input style="width: 240px" v-model="queryParam.key" placeholder="请输入要搜索的内容"> </a-input>
                </a-form-item>
                <a-form-item>
                    <a-button htmlType="submit" :disabled="disabledSearch" type="primary"
                        @click="doSearch">查询</a-button>
                </a-form-item>
            </a-form>

            <a-table ref="table" size="default" row-key="autoid" :loading="loading" :columns="columns"
                :dataSource="loadData" :scroll="{ x: 980 }" :pagination="pagination">
                <template slot="type" slot-scope="text, record">
                    <div> {{ getDesc('PaymentMethod', record.type) }}</div>
                </template>
                <span slot="status" slot-scope="text, record">
                    {{ record.status === 1 ? "启用" : "禁用" }}
                </span>
                <span slot="logo" slot-scope="text, record">
                    <img :src="imgUrl(record.logo)" alt="" width="64" height="64" />
                </span>
                <span slot="qr" slot-scope="text, record">
                    <img :src="imgUrl(record.qr)" alt="" width="64" height="64" />
                </span>
                <span slot="action" slot-scope="text, record">
                    <template>
                        <a @click="handleEdit(record)" :disabled="!$verify('107044')">编辑</a>

                    </template>
                </span>
            </a-table>
        </a-card>

        <s-modal ref="editModal" :visible="visible" :loading="confirmLoading" :options="editOptions" :model="mdl"
            @cancel="handleCancel" @ok="handleEditOk" />
    </page-header-wrapper>

</template>

<script>
import { STable, Ellipsis, SModal } from '@/components'

import {
    editPayOut,
    payOut
} from '@/api/wallet'
const editOptions = [
    {
        title: "ID",
        field: "id",
        type: "input",
        decorator: {},
        disabled: true,
        hidden: true,
    },

    {
        title: "内容",
        field: "content",
        type: "input",
        placeholder: "请输入内容",
        decorator: { rules: [{ required: true, message: "请输入内容" }] },
    },
    {
        title: "支付方式",
        field: "type",
        type: "select-pay", // 如果是选择支付方式，可以用 select
        placeholder: "请选择支付方式",
        decorator: { rules: [{ required: true, message: "请选择支付方式" }] },
    },
    {
        title: "最小提现金额",
        field: "min",
        type: "number",
        placeholder: "请输入最小提现金额",
        decorator: { rules: [{ required: true, message: "请输入最小提现金额" }] },
    },
    {
        title: "最大提现金额",
        field: "max",
        type: "number",
        placeholder: "请输入最大提现金额",
        decorator: { rules: [{ required: true, message: "请输入最大提现金额" }] },
    },
    {
        title: "USDT汇率",
        field: "usdtRate",
        type: "number",
        placeholder: "请输入USDT汇率",
        decorator: { rules: [{ required: true, message: "请输入USDT汇率" }] },
    },
    {
        title: "状态",
        field: "status",
        type: "select", // 假设状态是选择框
        placeholder: "请选择状态",
        options: [
            { val: 1, title: "启用" },
            { val: 0, title: "禁用" },
        ],
        decorator: { rules: [{ required: true, message: "请选择提现" }] },
    },
    {
        title: "logo",
        field: "logo",
        type: "image",
        placeholder: "请输入",
        decorator: { rules: [{ required: true, message: "请输入logo" }] },
    },
    {
        title: "备注",
        field: "remark",
        type: "input",
        placeholder: "请输入备注",
        decorator: {},
    },
];


const columns = [
    {
        title: 'ID',
        dataIndex: 'id',
        width: 120
    },
    {
        title: '内容',
        dataIndex: 'content'
    },
    {
        title: '收款方式',
        dataIndex: 'type',
        scopedSlots: { customRender: "type" }
    },
    {
        title: '最小提现金额',
        dataIndex: 'min'
    },
    {
        title: '最大提现金额',
        dataIndex: 'max'
    },
    {
        title: '状态',
        dataIndex: 'status',
        scopedSlots: { customRender: "status" }
    },
    {
        title: 'USDT汇率',
        dataIndex: 'usdtRate',
    },
    {
        title: '备注',
        dataIndex: 'remark'
    },
    {
        title: 'logo',
        dataIndex: 'logo',
        scopedSlots: { customRender: "logo" }
    },
    {
        title: '操作',
        dataIndex: 'action',
        width: 150,
        scopedSlots: { customRender: 'action' }
    }
]

export default {
    name: 'ConfigList',
    components: {
        STable,
        Ellipsis,
        SModal,
    },
    data() {
        // this.columns = columns
        return {
            loading: false,
            columns,
            // create model
            visible: false,
            bankVisible: false,
            confirmLoading: false,
            mdl: null,
            roleMenus: [],
            // 高级搜索 展开/关闭
            advanced: false,
            // // 搜索状态
            // disabledSearch: false,
            // 查询参数
            queryParam: {
                key: ''
            },
            editOptions,

            // 加载数据方法 必须为 Promise 对象
            loadData: [],
            pagination: {
                total: 0,
                current: 1,
                pageSize: 20,
                onChange: (page, pageSize) => {
                    this.pagination.current = page
                    if (pageSize !== this.pagination.pageSize) {
                        this.pagination.pageSize = pageSize
                    }
                    this.queryParam['page'] = page
                    this.queryParam['pageSize'] = pageSize
                    this.getData()
                    // console.log(page, pageSize)
                }
            },
            selectedRowKeys: [],
            selectedRows: []
        }
    },

    created() {
        // getRoleList({ t: new Date() })
        this.getData()
    },
    computed: {
        // 搜索状态
        disabledSearch() {
            return this.loading
        },
        rowSelection() {
            return {
                selectedRowKeys: this.selectedRowKeys,
                onChange: this.onSelectChange
            }
        }
    },
    methods: {
        handleAdd() {
            // get menu data
            this.roleMenus = []
            this.mdl = null
            this.visible = true
        },
        handleEdit(record) {
            // get menu data
            this.roleMenus = []
            this.visible = true
            this.mdl = { ...record }
        },
        handleEditOk() {
            const form = this.$refs.editModal.form
            const username = this.$store.getters.username
            this.confirmLoading = true
            form.validateFields(async (errors, values) => {
                if (!errors) {
                    // 添加username
                    const ret = await editPayOut(values);
                    if (ret.code !== 0) {
                        this.$message.error(ret.msf);
                        return
                    }
                    this.handleCancel();
                    this.getData();
                }
                this.confirmLoading = false
            })
        },
        handleCancel() {
            this.visible = false
            this.confirmLoading = false
            const form = this.$refs.editModal.form
            form.resetFields() // 清理表单数据（可不做）
            this.roleMenus = []
        },

        onSelectChange(selectedRowKeys, selectedRows) {
            this.selectedRowKeys = selectedRowKeys
            this.selectedRows = selectedRows
        },
        doSearch() {
            console.log(this.queryParam)
            this.getData()
        },
        async getData() {
            this.loading = true

            const res = await payOut(this.queryParam)
            const { code, data } = res
            if (code === 0) {
                this.loadData = data.records
                this.pagination.total = data.total
            } else {
                console.log(res)
            }
            setTimeout(() => {
                this.loading = false
            }, 800)
        }
    }
}
</script>
