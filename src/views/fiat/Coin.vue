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
        <span slot="state" slot-scope="text, record">
          {{ record.state === 'disable' ? '禁用' : record.state === 'enable' ? '启用' : record.state }}
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
  getFiatCurrencyList,
  delFiatCurrency,
  addFiatCurrency,
  editFiatCurrency
} from '@/api/fiat'
import { Modal } from 'ant-design-vue'

// import StepByStepModal from './modules/StepByStepModal'

const columns = [
  {
    dataIndex: 'code',
    title: '法币编码',
    width: 50
  },
  {
    dataIndex: 'name',
    title: '法币名称',
    width: 150
  },
  {
    dataIndex: 'symbols',
    title: '法币符号',
    width: 150
  },
  {
    dataIndex: 'usdtExchangeRateIn',
    title: 'USDT兑换法币汇率(充值)',
    width: 150
  },
  {
    dataIndex: 'usdtExchangeRateOut',
    title: 'USDT兑换法币汇率(提现)',
    width: 150
  },
  {
    dataIndex: 'updatedAt',
    title: '更新时间',
    width: 150
  },
  {
    dataIndex: 'state',
    title: '状态',
    width: 100,
    scopedSlots: { customRender: 'state' }
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: 150,
    scopedSlots: { customRender: 'action' }
  }
]
const modalOptions = [
  {
    title: '法币编码',
    field: 'code',
    type: 'input',
    decorator: { rules: [{ required: true, message: '请输入币种编码' }] }
  },
  {
    title: '法币名称',
    field: 'name',
    type: 'input',
    decorator: { rules: [{ required: true, message: '请输入币种名称' }] }
  },
  {
    title: '法币符号',
    field: 'symbols',
    type: 'input',
    decorator: { rules: [{ required: true, message: '请输入币种符号' }] }
  },
  {
    title: 'USDT兑换法币汇率(充值)',
    field: 'usdtExchangeRateIn',
    type: 'number',
    placeholder: '请输入USDT兑换法币汇率(充值)',
    decorator: { rules: [{ required: true, message: '请输入USDT兑换法币汇率(充值)' }] }
  },
  {
    title: 'USDT兑换法币汇率(提现)',
    field: 'usdtExchangeRateOut',
    type: 'number',
    placeholder: '请输入USDT兑换法币汇率(提现)',
    decorator: { rules: [{ required: true, message: '请输入USDT兑换法币汇率(提现)' }] }
  }
]

export default {
  name: 'FiatCurrencyList',
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
      this.modalConfig['title'] = '新增'
    },
    handleEdit(record) {
      // get menu data
      this.roleMenus = []
      this.visible = true
      this.mdl = { ...record }
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
            editFiatCurrency(values)
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
            addFiatCurrency(values)
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
        content: `确定删除【${record.code}】的记录？`,
        onOk: () => {
          delFiatCurrency({
            code: record.code
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

      const res = await getFiatCurrencyList(this.queryParam)
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
  