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
          <a-button type="primary" icon="plus" @click="handleAdd" :disabled="!$verify('110022')">新建</a-button>
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
        <span slot="profittype" slot-scope="text, record">
          {{
            record.profittype === 'enable'
              ? '不启用'
              : record.profittype === 'profit'
              ? '必赢'
              : record.profittype === 'loss'
              ? '必输'
              : record.profittype
          }}
        </span>
        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="handleEdit(record)" :disabled="!$verify('110023')">编辑</a>
            <a-divider type="vertical" />
            <a @click="handleDel(record)" :disabled="!$verify('110021')">删除</a>
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
  getCycleLeverList,
  editCycleLever,
  addCycleLever,
  delCycleLever
} from '@/api/cycle'
import { Modal } from 'ant-design-vue'

const columns = [
  {
    dataIndex: 'autoid',
    title: 'ID',
    width: 80
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
    dataIndex: 'lever',
    title: '交易周期',
    width: 120
  },
  {
    dataIndex: 'minnumber',
    title: '最小数量',
    width: 120
  },
  {
    dataIndex: 'profitGas',
    title: '盈利率*100%',
    width: 150
  },
  {
    dataIndex: 'lossGas',
    title: '亏损率*100%',
    width: 150
  },
  {
    dataIndex: 'profittype',
    title: '利润类型',
    width: 120,
    scopedSlots: { customRender: 'profittype' }
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
    title: '交易周期',
    field: 'lever',
    type: 'number',
    placeholder: '请输入交易周期',
    decorator: { rules: [{ required: true, message: '请输入交易周期' }] }
  },
  {
    title: '最小数量',
    field: 'minnumber',
    type: 'number',
    placeholder: '请输入最小数量',
    decorator: { rules: [{ required: true, message: '请输入最小数量' }] }
  },
  {
    title: '盈利率',
    field: 'profitGas',
    type: 'number',
    placeholder: '请输入盈利率',
    decorator: { rules: [{ required: true, message: '请输入盈利率' }] }
  },
  {
    title: '亏损率',
    field: 'lossGas',
    type: 'number',
    placeholder: '请输入亏损率',
    decorator: { rules: [{ required: true, message: '请输入亏损率' }] }
  },

  {
    title: '利润类型',
    field: 'profittype',
    type: 'select',
    options: [
      { val: 'enable', title: '不启用' },
      { val: 'profit', title: '必赢' },
      { val: 'loss', title: '必输' }
    ],
    decorator: { initialValue: 'disable', rules: [{ required: true, message: '请选择利润类型' }] }
  }
]

export default {
  name: 'CycleLeverList',
  components: {
    STable,
    Ellipsis,
    // CreateForm,
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
      modalOptions,
      roleMenus: [],
      // 高级搜索 展开/关闭
      advanced: false,
      // // 搜索状态
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
        pageSize: 20,
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
          if (values.autoid > 0) {
            // 修改 e.g.
            editCycleLever(values)
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
                  this.visible = false
                  this.confirmLoading = false
                }
              })
              .catch((e) => {
                this.handleCancel()
              })
          } else {
            // 新增
            addCycleLever(values)
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
                  this.visible = false
                  this.confirmLoading = false
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
          delCycleLever({
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

      const res = await getCycleLeverList(this.queryParam)
      const { code, data } = res
      if (code === 0) {
        this.loadData = data.records
        this.pagination.total = data.total
      }
      setTimeout(() => {
        this.loading = false
      }, 800)
    }
  }
}
</script>
