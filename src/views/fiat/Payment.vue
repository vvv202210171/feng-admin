<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <!-- :model="queryParam" -->
      <a-form name="Search" layout="inline" autocomplete="off" style="margin-bottom: 14px" @submit="doSearch">
        <a-form-item label="搜索内容">
          <a-input style="width: 240px" v-model="queryParam.key" placeholder="请输入要搜索的内容"> </a-input>
        </a-form-item>
        <a-form-item>
          <a-button htmlType="submit" :disabled="disabledSearch" type="primary" @click="doSearch">查询</a-button>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" icon="plus" @click="handleAdd" :disabled="!$verify('110032')">新建</a-button>
        </a-form-item>
      </a-form>

      <a-table
        ref="table"
        size="default"
        row-key="autoid"
        :loading="loading"
        :scroll="{ x: 980 }"
        bordered
        :columns="columns"
        :dataSource="loadData"
        :pagination="pagination"
      >
        <!-- :rowSelection="rowSelection" -->
        <!-- <span slot="serial" slot-scope="text, record, index">
            {{ index + 1 }}
          </span> -->
        <span slot="status" slot-scope="text, record">
          {{ record.status === 'disable' ? '禁用' : record.status === 'enable' ? '启用' : record.state }}
        </span>
        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="handleEdit(record)" :disabled="!$verify('110033')">编辑</a>
            <a-divider type="vertical" />
            <a @click="handleDel(record)" :disabled="!$verify('110031')">删除</a>
          </template>
        </span>
      </a-table>

      <s-modal
        ref="createModal"
        :config="modalConfig"
        :visible="visible"
        :loading="confirmLoading"
        :options="modalOptions"
        :model="mdl"
        @cancel="handleCancel"
        @ok="handleOk"
      />
    </a-card>
  </page-header-wrapper>
</template>
  <script>
import { STable, Ellipsis, SModal } from '@/components'
import {
  // getRoleList,
  getFiatPaymentMethodList,
  delFiatPaymentMethod,
  addFiatPaymentMethod,
  editFiatPaymentMethod,
  getFiatEnableCurrencyList
} from '@/api/fiat'
import { Modal } from 'ant-design-vue'

// import StepByStepModal from './modules/StepByStepModal'

const columns = [
  {
    dataIndex: 'fiatCode',
    title: '法币币种编码',
    width: 150
  },
  {
    dataIndex: 'bankName',
    title: '收款银行名称',
    width: 150
  },
  {
    dataIndex: 'accountName',
    title: '收款人姓名',
    width: 150
  },
  {
    dataIndex: 'accountNumber',
    title: '收款卡号',
    width: 150
  },
  {
    dataIndex: 'extraInfoA',
    title: '附加资料A',
    width: 150
  },
  {
    dataIndex: 'extraInfoB',
    title: '附加资料B',
    width: 150
  },
  {
    dataIndex: 'remark',
    title: '备注',
    width: 150
  },
  {
    dataIndex: 'usdtExchangeRate',
    title: 'USDT兑换法币汇率',
    width: 180
  },
  {
    dataIndex: 'minAmount',
    title: '最小入款金额',
    width: 150
  },
  {
    dataIndex: 'maxAmount',
    title: '最大入款金额',
    width: 150
  },
  {
    dataIndex: 'status',
    title: '状态',
    width: 100,
    scopedSlots: { customRender: 'status' }
  },
  {
    dataIndex: 'createdAt',
    title: '创建时间',
    width: 180
  },
  {
    dataIndex: 'updatedAt',
    title: '更新时间',
    width: 180
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: 150,
    scopedSlots: { customRender: 'action' }
  }
]

const modalOptions = [
  { title: 'ID', field: 'id', type: 'input', decorator: {}, disabled: true, hidden: true },
  {
    title: '法币币种编码',
    field: 'fiatCode',
    type: 'select',
    options: [],
    decorator: { rules: [{ required: true, message: '请选择法币币种编码' }] }
  },
  {
    title: '收款银行名称',
    field: 'bankName',
    type: 'input',
    decorator: { rules: [{ required: true, message: '请输入收款银行名称' }] }
  },
  {
    title: '收款人姓名',
    field: 'accountName',
    type: 'input',
    placeholder: '请输入收款人姓名',
    decorator: { rules: [{ required: true, message: '请输入收款人姓名' }] }
  },
  {
    title: '收款卡号',
    field: 'accountNumber',
    type: 'input',
    placeholder: '请输入收款卡号',
    decorator: { rules: [{ required: true, message: '请输入收款卡号' }] }
  },
  {
    title: '附加资料A',
    field: 'extraInfoA',
    type: 'input',
    placeholder: '请输入USDT附加资料A'
  },
  {
    title: '附加资料B',
    field: 'extraInfoB',
    type: 'input',
    placeholder: '请输入USDT附加资料B'
  },
  {
    title: 'USDT兑换法币汇率',
    field: 'usdtExchangeRate',
    type: 'number',
    placeholder: '请输入USDT兑换法币汇率',
    decorator: { rules: [{ required: true, message: '请输入USDT兑换法币汇率' }] }
  },
  {
    title: '最小入款金额',
    field: 'minAmount',
    type: 'number',
    placeholder: '请输入最小入款金额',
    decorator: { rules: [{ required: true, message: '请输入最小入款金额' }] }
  },
  {
    title: '最大入款金额',
    field: 'maxAmount',
    type: 'number',
    placeholder: '请输入最大入款金额',
    decorator: { rules: [{ required: true, message: '请输入最大入款金额' }] }
  },
  {
    title: '备注',
    field: 'remark',
    type: 'input'
    // placeholder: '请输入USDT兑换法币汇率',
    // decorator: { rules: [{ required: true, message: '请输入USDT兑换法币汇率' }] }
  },
  {
    title: '状态',
    field: 'status',
    type: 'select',
    options: [
      { val: 'enable', title: '启用' },
      { val: 'disable', title: '禁用' }
    ],
    decorator: { rules: [{ required: true, message: '请选择状态' }] }
  }
]

export default {
  name: 'FiatPaymentMethodList',
  components: {
    STable,
    Ellipsis,
    SModal
    // StepByStepModal
  },
  data() {
    // this.columns = columns
    return {
      loading: false,
      columns,
      // create model
      modalConfig: {},
      visible: false,
      confirmLoading: false,
      mdl: null,
      roleMenus: [],
      modalOptions,
      // 高级搜索 展开/关闭
      advanced: false,
      // 搜索状态
      // disabledSearch: false,
      // 查询参数
      queryParam: {
        key: '',
        page: 1,
        limit: 20
      },
      // 加载数据方法 必须为 Promise 对象
      loadData: [],
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10,
        onChange: (page, pageSize) => {
          this.pagination.current = page
          if (pageSize !== this.pagination.pageSize) {
            this.pagination.pageSize = pageSize
          }
          this.queryParam['page'] = page
          this.queryParam['limit'] = pageSize
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
    this.getFiatEnableCurrencyList()
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
    async getFiatEnableCurrencyList() {
      const { code, data } = await getFiatEnableCurrencyList()
      if (code === 0) {
        this.modalOptions[1].options = data.map((v) => {
          return { title: v.code, val: v.code }
        })
      }
    },
    handleAdd() {
      // get menu data
      this.roleMenus = []
      this.mdl = null
      this.visible = true
      this.modalConfig['title'] = '新增'
    },
    handleEdit(record) {
      // get menu data
      this.roleMenus = []
      this.visible = true
      this.mdl = { ...record }
      console.log(this.mdl)
      this.modalConfig['title'] = '编辑'
    },
    handleOk() {
      const form = this.$refs.createModal.form
      const username = this.$store.getters.username
      this.confirmLoading = true
      form.validateFields((errors, values) => {
        if (!errors) {
          // 添加username
          values = {
            ...values,
            username
          }
          Object.keys(values).map((e) => {
            if (values[e] === undefined) {
              values[e] = ''
            }
          })
          console.log(values)
          if (this.mdl !== null) {
            // 修改 e.g.
            editFiatPaymentMethod(values)
              .then((res) => {
                console.log(res)
                const { code, msg } = res
                if (code === 0) {
                  this.visible = false
                  this.confirmLoading = false
                  // 重置表单数据
                  form.resetFields()
                  // 刷新表格
                  // this.$refs.table.refresh()
                  this.getData()
                  this.$message.success('修改成功')
                } else {
                  this.$message.error(msg)
                  this.handleCancel()
                }
              })
              .catch((e) => {
                this.handleCancel()
              })
          } else {
            // 新增
            addFiatPaymentMethod(values)
              .then((res) => {
                console.log(res)
                const { code, msg } = res
                if (code === 0) {
                  this.visible = false
                  this.confirmLoading = false
                  // 重置表单数据
                  form.resetFields()
                  // 刷新表格
                  // this.$refs.table.refresh()
                  this.getData()

                  this.$message.success('新增成功')
                } else {
                  this.$message.error(msg)
                  this.handleCancel()
                }
              })
              .catch((e) => {
                this.handleCancel()
              })
          }
        } else {
          this.confirmLoading = false
        }
      })
    },
    handleCancel() {
      this.visible = false
      this.confirmLoading = false
      const form = this.$refs.createModal.form
      form.resetFields() // 清理表单数据（可不做）
      this.roleMenus = []
    },
    handleDel(record) {
      console.log('del', record)
      const ts = this
      const delMod = Modal.confirm({
        centered: true,
        maskClosable: true,
        title: '提示信息',
        content: `确定删除【${record.id}】的记录？`,
        onOk: () => {
          delFiatPaymentMethod({
            id: record.id
          }).then((res) => {
            console.log(res)
            ts.getData()
            delMod.destroy()
          })
        },
        onCancel() {}
      })
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    doSearch() {
      this.getData()
    },
    async getData() {
      this.loading = true

      const res = await getFiatPaymentMethodList(this.queryParam)
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