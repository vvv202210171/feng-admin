<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <!-- :model="queryParam" -->
      <a-form name="Search" layout="inline" autocomplete="off" style="margin-bottom: 14px" @submit="doSearch">
        <a-form-item label="搜索内容">
          <a-input style="width: 240px" v-model="queryParam.key" placeholder="请输入要搜索的内容"> </a-input>
        </a-form-item>
        <a-form-item>
          <a-button htmlType="submit" :disabled="disabledSearch" type="primary" @click="doSearch">查询 </a-button>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" icon="plus" @click="handleAdd" :disabled="!$verify('113014')">新建</a-button>
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
        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="handleEdit(record)">编辑</a>
            <a-divider type="vertical" />
            <a @click="handleDel(record)" :disabled="!$verify('113013')">删除</a>
          </template>
        </span>
      </a-table>

      <create-form
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
import { STable, Ellipsis } from '@/components'
import {
  // getRoleList,
  getAddressList,
  delAddress,
  addAddress
} from '@/api/assethub'
import { Modal } from 'ant-design-vue'

import CreateForm from './modules/AddressForm'

const columns = [
  {
    title: 'ID',
    dataIndex: 'autoid',
    width: 80
  },
  {
    title: '币种',
    dataIndex: 'pcoin'
  },
  {
    title: '协议',
    dataIndex: 'symbol'
  },
  {
    title: '所属链',
    dataIndex: 'blockname'
  },
  {
    title: '收款地址',
    dataIndex: 'address'
  },
  {
    title: '操作人',
    dataIndex: 'member'
  },
  {
    title: '操作时间',
    dataIndex: 'writedate'
  },
  {
    title: '备注',
    dataIndex: 'tag'
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: 150,
    scopedSlots: { customRender: 'action' }
  }
]
const modalOptions = []

export default {
  name: 'AddressList',
  components: {
    STable,
    Ellipsis,
    CreateForm
    // StepByStepModal
  },
  data() {
    // this.columns = columns
    const username = this.$store.getters.username
    return {
      username,
      loading: false,
      columns,
      // create model
      visible: false,
      confirmLoading: false,
      mdl: null,
      modalOptions,
      roleMenus: [],
      modalConfig: {},
      // 高级搜索 展开/关闭
      advanced: false,
      // // 搜索状态
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
      // this.roleMenus = []
      this.mdl = null
      this.visible = true
    },
    handleEdit(record) {
      // get menu data
      // this.roleMenus = []
      this.visible = true
      this.mdl = { ...record }
    },
    handleOk() {
      const form = this.$refs.createModal.form
      // const username = this.$store.getters.username
      this.confirmLoading = true
      form.validateFields((errors, values) => {
        if (!errors) {
          // 添加username
          values = {
            ...values,
            username: this.username
          }
          Object.keys(values).map((e) => {
            if (values[e] === undefined) {
              values[e] = ''
            }
          })
          console.log(values)

          // 新增
          addAddress(values)
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

                this.$message.success('添加成功')
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
        content: `确定删除【${record.autoid}】的记录？`,
        onOk: () => {
          delAddress({
            username: this.username,
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

      const res = await getAddressList(this.queryParam)
      const { code, data, count } = res
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
