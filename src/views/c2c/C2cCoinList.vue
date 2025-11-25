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
          <a-button type="primary" icon="plus" @click="handleAdd" :disabled="!$verify('110012')">新建</a-button>
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
        expandRowByClick
      >
        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="handleEdit(record)" :disabled="!$verify('110013')">编辑</a>
            <a-divider type="vertical" />
            <a @click="handleDel(record)" :disabled="!$verify('110011')">删除</a>
          </template>
        </span>
      </a-table>

      <s-modal
        ref="addModal"
        :config="modalConfig"
        :visible="add.visible"
        :loading="confirmLoading"
        :options="addOptions"
        :model="add.mdl"
        @cancel="handleCancel"
        @ok="handleAddOk"
      />

      <s-modal
        ref="editModal"
        :config="modalConfig"
        :visible="edit.visible"
        :loading="confirmLoading"
        :options="editOptions"
        :model="edit.mdl"
        @cancel="handleCancel"
        @ok="handleEditOk"
      />
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { STable, Ellipsis, SModal } from '@/components'
import {
  // getRoleList,
  getC2cCoinList,
  delC2cCoin,
  addC2cCoin,
  editC2cCoin
} from '@/api/c2c'
import { Modal } from 'ant-design-vue'

// import StepByStepModal from './modules/StepByStepModal'
// import CreateForm from './modules/C2cCoinForm'

const columns = [
  {
    dataIndex: 'autoid',
    title: 'ID',
    width: 50
  },
  {
    dataIndex: 'coin',
    title: '币种',
    width: 90
  },
  {
    dataIndex: 'cny',
    title: '人民币单价',
    width: 80
  },
  {
    dataIndex: 'icon',
    title: '符号',
    width: 80
  },
  {
    dataIndex: 'minnumber',
    title: '单次最小交易数量',
    width: 100
  },
  {
    dataIndex: 'usdt',
    title: '美元单价',
    width: 100
  },
  {
    dataIndex: 'writedate',
    title: '创建时间',
    width: 150
  },
  {
    dataIndex: 'rise',
    title: 'rise',
    width: 150
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: 150,

    scopedSlots: { customRender: 'action' }
  }
]

const addOptions = [
  {
    title: '币种',
    field: 'coin',
    type: 'select-currency',
    placeholder: '请选择币种名称',
    decorator: { rules: [{ required: true, message: '请选择主币种名称' }] }
  },
  {
    title: '人民币单价',
    field: 'cny',
    type: 'number',
    placeholder: '请输入人民币单价',
    decorator: { rules: [{ required: true, message: '请输入手续费' }] }
  },
  {
    title: '美元单价',
    field: 'usdt',
    type: 'number',
    placeholder: '请输入美元单价',
    decorator: { rules: [{ required: true, message: '请输入手续费' }] }
  },
  {
    title: '符号',
    field: 'icon',
    type: 'input',
    placeholder: '请输入价格精度',
    decorator: { rules: [{ required: true, message: '请输入价格精度' }] }
  },
  {
    title: '单次最小交易数量',
    field: 'minnumber',
    type: 'number',
    placeholder: '请输单次最小交易数量',
    decorator: { rules: [{ required: true, message: '请输入数量精度' }] }
  },
  {
    title: '涨跌幅',
    field: 'rise',
    type: 'number',
    placeholder: '请输涨跌幅',
    decorator: { rules: [{ required: true, message: '请输入数量精度' }] }
  }
]
const editOptions = [
  { title: 'ID', field: 'autoid', type: 'input', decorator: {}, disabled: true },
  {
    title: '币种',
    field: 'coin',
    type: 'select-currency',
    placeholder: '请选择币种名称',
    disabled: true,
    decorator: { rules: [{ required: true, message: '请选择主币种名称' }] }
  },
  {
    title: '人民币单价',
    field: 'cny',
    type: 'number',
    placeholder: '请输入人民币单价',
    decorator: { rules: [{ required: true, message: '请输入手续费' }] }
  },
  {
    title: '美元单价',
    field: 'usdt',
    type: 'number',
    placeholder: '请输入美元单价',
    decorator: { rules: [{ required: true, message: '请输入手续费' }] }
  },
  {
    title: '符号',
    field: 'icon',
    type: 'input',
    placeholder: '请输入价格精度',
    decorator: { rules: [{ required: true, message: '请输入价格精度' }] }
  },
  {
    title: '单次最小交易数量',
    field: 'minnumber',
    type: 'number',
    placeholder: '请输单次最小交易数量',
    decorator: { rules: [{ required: true, message: '请输入数量精度' }] }
  },
  {
    title: '涨跌幅',
    field: 'rise',
    type: 'number',
    placeholder: '请输涨跌幅',
    decorator: { rules: [{ required: true, message: '请输入数量精度' }] }
  }
]

export default {
  name: 'C2cCoinList',
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
      roleMenus: [],
      modalConfig: {},
      confirmLoading: false,
      add: {
        visible: false,
        mdl: null
      },
      addOptions,
      edit: {
        visible: false,
        mdl: null
      },
      editOptions,
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
    }
    // rowSelection () {
    //   return {
    //     selectedRowKeys: this.selectedRowKeys,
    //     onChange: this.onSelectChange
    //   }
    // }
  },
  methods: {
    handleAdd() {
      // get menu data
      this.roleMenus = []
      this.add.mdl = null
      this.add.visible = true
      this.modalConfig['title'] = '新增'
    },
    handleEdit(record) {
      // get menu data
      this.roleMenus = []
      this.edit.visible = true
      this.edit.mdl = { ...record }
      this.modalConfig['title'] = '编辑'
    },
    handleAddOk() {
      const form = this.$refs.addModal.form
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
          // 新增
          addC2cCoin(values)
            .then((res) => {
              console.log(res)
              const { code, msg } = res
              if (code === 0) {
                this.add.visible = false
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
        } else {
          this.confirmLoading = false
        }
      })
    },
    handleEditOk() {
      const form = this.$refs.editModal.form
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
            editC2cCoin(values)
              .then((res) => {
                console.log(res)
                const { code, msg } = res
                if (code === 0) {
                  this.edit.visible = false
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
          }
        } else {
          this.confirmLoading = false
        }
      })
    },
    handleCancel() {
      this.add.visible = false
      this.edit.visible = false
      this.confirmLoading = false
      const form = this.$refs.addModal.form
      form.resetFields() // 清理表单数据（可不做）
      const editform = this.$refs.editModal.form
      editform.resetFields() // 清理表单数据（可不做）
      this.roleMenus = []
    },
    handleDel(record) {
      console.log('del', record)
      const ts = this
      const delMod = Modal.confirm({
        centered: true,
        maskClosable: true,
        title: '提示信息',
        content: `确定删除【${record.autoid}】的记录？`,
        onOk: () => {
          delC2cCoin({
            id: record.autoid
          }).then((res) => {
            console.log(res)
            ts.getData()
            delMod.destroy()
          })
        },
        onCancel() {}
      })
    },
    // onSelectChange (selectedRowKeys, selectedRows) {
    //   this.selectedRowKeys = selectedRowKeys
    //   this.selectedRows = selectedRows
    // },
    doSearch() {
      console.log(this.queryParam)
      this.getData()
    },
    async getData() {
      this.loading = true

      const res = await getC2cCoinList(this.queryParam)
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
