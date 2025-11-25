<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <!-- :model="queryParam" -->
      <a-form name="Search" layout="inline" autocomplete="off" style="margin-bottom: 14px" @submit="doSearch">
        <a-form-item label="搜索内容">
          <a-input style="width: 240px" v-model="queryParam.key" placeholder="请输入要搜索的内容"> </a-input>
        </a-form-item>
        <a-form-item label="状态">
          <a-select style="width: 100px" v-model="queryParam.state">
            <a-select-option value=""> 全部 </a-select-option>
            <a-select-option value="1"> 启用 </a-select-option>
            <a-select-option value="0"> 关闭 </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-button htmlType="submit" :disabled="disabledSearch" type="primary" @click="doSearch">查询</a-button>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" icon="plus" @click="handleAdd" :disabled="!$verify('111011')">新建</a-button>
        </a-form-item>
      </a-form>

      <a-table
        ref="table"
        size="default"
        row-key="id"
        :loading="loading"
        :scroll="{ x: 980 }"
        bordered
        :columns="columns"
        :dataSource="loadData"
        :pagination="pagination"
      >
        <!-- <span slot="serial" slot-scope="text, record, index">
            {{ index + 1 }}
          </span> -->
        <template slot="state" slot-scope="text, record">
          <span v-if="record.flagActive === 1">启用</span>
          <span v-else-if="record.flagActive === 0" style="color: #eb1345">关闭</span>
        </template>
        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="handleEdit(record)" :disabled="!$verify('111012')">编辑</a>
            <!-- <a-divider type="vertical" />
              <a @click="handleDel(record)">删除</a> -->
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
  getStaticFundsList,
  delStaticFunds,
  addStaticFunds,
  editStaticFunds
} from '@/api/funds'
// import { Modal } from 'ant-design-vue'

// import StepByStepModal from './modules/StepByStepModal'
// import CreateForm from './modules/StaticFundsForm'
// 表格列
const columns = [
  { dataIndex: 'autoid', title: 'ID', width: 80 },
  { dataIndex: 'payCoin', title: '支付币种', width: 100 },
  { dataIndex: 'coinCode', title: '币种代码', width: 100 },

  { dataIndex: 'minNum', title: '单笔最低投入', width: 120 },
  { dataIndex: 'maxNum', title: '单笔最高投入', width: 120 },
  { dataIndex: 'yield', title: '每日收益率', width: 140 },
  { dataIndex: 'days', title: '周期', width: 100 },
  {
    dataIndex: 'flagActive',
    title: '状态',
    width: 80,
    scopedSlots: { customRender: 'state' }
  },
  { dataIndex: 'sort', title: '排序', width: 80 },
  { dataIndex: 'updateTime', title: '更新时间', width: 200 },
  {
    title: '操作',
    dataIndex: 'action',
    width: 150,
    scopedSlots: { customRender: 'action' }
  }
]

// 弹窗表单字段
const modalOptions = [
  { title: 'ID', field: 'autoid', type: 'input', decorator: {}, disabled: true, hidden: true },
  {
    title: '币种代码',
    field: 'coinCode',
    type: 'select-currency',
    placeholder: '请选择币种',
    decorator: { rules: [{ required: true, message: '请选择币种' }] }
  },
  {
    title: '支付币种',
    field: 'payCoin',
    type: 'select-currency',
    placeholder: '请选择币种',
    decorator: { rules: [{ required: true, message: '请选择币种' }] }
  },
  {
    title: '单笔最低投入',
    field: 'minNum',
    type: 'number',
    placeholder: '请输入',
    decorator: { rules: [{ required: true, message: '请输入单笔最低投入' }] }
  },
  {
    title: '单笔最高投入',
    field: 'maxNum',
    type: 'number',
    placeholder: '请输入',
    decorator: { rules: [{ required: true, message: '请输入单笔最高投入' }] }
  },
  {
    title: '每日收益率',
    field: 'yield',
    type: 'number',
    placeholder: '请输入',
    decorator: {
      rules: [
        { required: true, message: '请输入每日收益率' },
        { type: 'number', max: 1, message: '每日收益率不能大于1' }
      ]
    }
  },

  {
    title: '周期',
    field: 'days',
    type: 'number',
    placeholder: '请输入',
    decorator: { rules: [{ required: true, message: '请输入周期' }] }
  },
  {
    title: '排序',
    field: 'sort',
    type: 'number',
    placeholder: '请输入',
    decorator: { rules: [{ required: true, message: '请输入排序' }] }
  },
  {
    title: '状态',
    field: 'flagActive',
    type: 'select',
    placeholder: '请选择',
    options: [
      { val: 1, title: '启用' },
      { val: 0, title: '关闭' }
    ],
    decorator: { rules: [{ required: true, message: '请选择状态' }] }
  }
]

export default {
  name: 'StaticFundsList',
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
      visible: false,
      confirmLoading: false,
      mdl: null,
      modalConfig: {},
      modalOptions,
      roleMenus: [],
      // 高级搜索 展开/关闭
      advanced: false,
      // // 搜索状态
      // disabledSearch: false,
      // 查询参数
      queryParam: {
        key: '',
        state: '1'
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
            if (e === 'payCoin') {
              values['coin'] = values[e]
            }
          })
          if (values.autoid > 0) {
            // 修改 e.g.
            editStaticFunds(values)
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
            addStaticFunds(values)
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
      // const ts = this
      // const delMod = Modal.confirm({
      //   centered: true,
      //   maskClosable: true,
      //   title: '提示信息',
      //   content: `确定删除【${record.username}】的记录？`,
      //   onOk: () => {
      //     // return new Promise((resolve, reject) => {
      //     //   setTimeout(Math.random() > 0.5 ? resolve : reject, 1500)
      //     // }).catch(() => console.log('Oops errors!'))
      //     // return this.$store.dispatch('Logout').then(() => {
      //     //   this.$router.push({ name: 'login' })
      //     // })
      //     delStaticFunds({
      //       username: record.username,
      //       autoid: record.autoid
      //     })
      //       .then(res => {
      //         console.log(res)
      //         ts.getData()
      //         delMod.destroy()
      //       })
      //   },
      //   onCancel () {}
      // })
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

      const res = await getStaticFundsList(this.queryParam)
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
  