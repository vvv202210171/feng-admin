<template>
    <page-header-wrapper>
        <div class="flex">
            <a-card :bordered="false" style="flex:2">
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
                    <a-form-item>
                        <a-button type="primary" icon="plus" @click="handleAdd"
                            :disabled="!$verify('107043')">新建客服</a-button>
                    </a-form-item>
                </a-form>

                <a-table ref="table" size="default" row-key="id" :loading="loading" :columns="columns"
                    :dataSource="loadData" :scroll="{ x: 980 }" :pagination="pagination">
                    <span slot="avatar" slot-scope="text, record">
                        <img :src="imgUrl(record.avatar)" width="80" v-if="record.avatar" height="80" />
                    </span>

                    <span slot="action" slot-scope="text, record">
                        <template>
                            <a @click="handleEdit(record)" :disabled="!$verify('107044')">编辑</a>
                            <a-divider type="vertical" />
                            <a @click="openCs(record)">打开客服</a>
                        </template>
                    </span>
                </a-table>

            </a-card>

            <CsChat :customerService="customerService" style="flex: 1;height:800px;min-width: 650;" ref="chatWindow"
                v-if="cisCHat">
            </CsChat>
        </div>
        <s-modal ref="editModal" :visible="visible" :loading="confirmLoading" :options="editOptions" :model="mdl"
            @cancel="handleCancel" @ok="handleOk" />
    </page-header-wrapper>
</template>

<script>
import { STable, Ellipsis, SModal } from '@/components'
import CsChat from './module/CsChat.vue'


import { csList, saveCs } from "@/api/cs"

const columns = [
    {
        title: 'ID',
        dataIndex: 'id',
        width: 120
    },
    {
        title: '头像',
        dataIndex: 'avatar',
        width: 120,
        scopedSlots: { customRender: "avatar" }
    },
    {
        title: '名称',
        dataIndex: 'name'
    },
    {
        title: '手机号',
        dataIndex: 'phoneNumber'
    },
    {
        title: '邮箱',
        dataIndex: 'email'
    },
    {
        title: '密钥',
        dataIndex: 'key'
    },
    {
        title: '创建时间',
        dataIndex: 'createdAt'
    },
    {
        title: '操作',
        dataIndex: 'action',
        width: 150,
        scopedSlots: { customRender: 'action' }
    }
]
const editOptions = [
    { title: 'ID', field: 'id', type: 'input', decorator: {}, disabled: true, hidden: true },
    {
        title: '头像',
        field: 'avatar',
        type: 'image',
        placeholder: '请输入',
        decorator: { rules: [{ required: true, message: '请输入等级名称' }] }
    },
    {
        title: '名称',
        field: 'name',
        type: 'input',
        placeholder: '请输入',
        decorator: { rules: [{ required: true, message: '请输入等级名称' }] }
    },
    {
        title: '联系手机号',
        field: 'phoneNumber',
        type: 'input',
        placeholder: '请输入',
        decorator: { rules: [{ required: true, message: '请输入联系手机号' }] }
    },
    {
        title: '联系邮箱',
        field: 'email',
        type: 'input',
        placeholder: '请输入',
        decorator: { rules: [{ required: true, message: '请输入联系邮箱' }] }
    },
    {
        title: '密钥',
        field: 'key',
        type: 'input',
        placeholder: '请输入',
        decorator: { rules: [{ required: true, message: '请输入密钥' }] }
    },



]
export default {
    name: 'ConfigList',
    components: {
        STable,
        Ellipsis,
        SModal,
        CsChat
    },
    data() {
        // this.columns = columns
        return {
            loading: false,
            columns,
            // create model
            visible: false,
            confirmLoading: false,
            mdl: null,
            editOptions,
            roleMenus: [],
            // 高级搜索 展开/关闭
            advanced: false,
            cisCHat: false,
            // // 搜索状态
            // disabledSearch: false,
            // 查询参数
            queryParam: {
                key: ''
            },
            customerService: null,
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
        handleOk() {
            const form = this.$refs.editModal.form
            const username = this.$store.getters.username
            this.confirmLoading = true
            form.validateFields(async (errors, values) => {
                if (!errors) {
                    // 新增
                    const res = await saveCs(values);
                    if (res.code === 0) {
                        this.visible = false
                        // 重置表单数据
                        form.resetFields()
                        // 刷新表格
                        // this.$refs.table.refresh()
                        this.handleCancel();
                        this.getData()
                        return
                    }
                    this.$message.error(res.msg)



                }
                this.confirmLoading = false
            })
        },
        openCs(row) {
            this.cisCHat = false;

            setTimeout(() => {
                // 先关闭之前的 WebSocket 连接
                this.cisCHat = true;
                this.customerService = row;

            }, 100);

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

            const res = await csList(this.queryParam)
            const { code, data } = res
            if (code === 0) {
                this.loadData = data
                this.pagination.total = data.length
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
