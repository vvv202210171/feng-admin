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
  getCyclePayCoinList,
  delCyclePayCoin,
  addCyclePayCoin,
  editCyclePayCoin
} from '@/api/cycle'
import { Modal } from 'ant-design-vue'

// import StepByStepModal from './modules/StepByStepModal'
import CreateForm from './modules/CyclePayCoinForm'

const columns = [
  {
    dataIndex: 'autoid',
    title: 'ID',
    width: 50
  },
  {
    dataIndex: 'tradcoin',
    title: '交易币种',
    width: 150
  },
  {
    dataIndex: 'maincoin',
    title: '主币种',
    width: 150
  },
  {
    dataIndex: 'paycoin',
    title: '支付币种',
    width: 150
  },
  {
    dataIndex: 'max_number',
    title: '最高限额',
    width: 120
  },
  {
    dataIndex: 'min_number',
    title: '最低限额',
    width: 120
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: 150,
    scopedSlots: { customRender: 'action' }
  }
]
const modalOptions = [
  { title: 'ID', field: 'autoid', type: 'input', decorator: {}, disabled: true, hidden: true },
  {
    title: '主币种名称',
    field: 'maincoin',
    type: 'select-currency',
    placeholder: '请选择主币种名称',
    decorator: { rules: [{ required: true, message: '请选择主币种名称' }] }
  },
  {
    title: '交易币种名称',
    field: 'tradcoin',
    type: 'select-currency',
    placeholder: '请选择币种',
    decorator: { rules: [{ required: true, message: '请选择币种' }] }
  },
  {
    title: '支付币种',
    field: 'paycoin',
    type: 'select-currency',
    placeholder: '请选择支付币种',
    decorator: { rules: [{ required: true, message: '请选择支付币种' }] }
  },
  {
    title: '最高限额',
    field: 'max_number',
    type: 'number',
    placeholder: '请输入最高限额',
    decorator: { rules: [{ required: true, message: '请输入最高限额' }] }
  },
  {
    title: '最低限额',
    field: 'min_number',
    type: 'number',
    placeholder: '请输入最低限额',
    decorator: { rules: [{ required: true, message: '请输入最低限额' }] }
  }
]

export default {
  name: 'CyclePayCoinList',
  components: {
    STable,
    Ellipsis,
    CreateForm,
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
        key: ''
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
          if (values.autoid > 0) {
            // 修改 e.g.
            editCyclePayCoin(values)
              .then((res) => {
                console.log(res)
                const { code, msg } = res
                if (code === '0') {
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
            addCyclePayCoin(values)
              .then((res) => {
                console.log(res)
                const { code, msg } = res
                if (code === '0') {
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
      const username = this.$store.getters.username
      const ts = this
      const delMod = Modal.confirm({
        centered: true,
        maskClosable: true,
        title: '提示信息',
        content: `确定删除【${record.autoid}】的记录？`,
        onOk: () => {
          delCyclePayCoin({
            username: username,
            autoid: record.autoid
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
      console.log(this.queryParam)
      this.getData()
    },
    async getData() {
      this.loading = true

      const res = await getCyclePayCoinList(this.queryParam)
      const { code, data, count } = res
      if (code === '0') {
        this.loadData = data
        this.pagination.total = count
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
