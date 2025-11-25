<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <!-- :model="queryParam" -->
      <a-form name="configSearch" layout="inline" autocomplete="off" style="margin-bottom: 14px" @submit="doSearch">
        <a-form-item label="搜索">
          <a-input style="width: 240px" v-model="queryParam.key" placeholder="请输入要搜索的内容"> </a-input>
        </a-form-item>
        <a-form-item>
          <a-button htmlType="submit" :disabled="disabledSearch" type="primary" @click="doSearch">查询</a-button>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" icon="plus" @click="handleAdd">新建白名单</a-button>
        </a-form-item>
      </a-form>

      <a-table
        ref="table"
        size="default"
        row-key="autoid"
        :loading="loading"
        :columns="columns"
        :dataSource="loadData"
        :scroll="{ x: 980 }"
        :rowSelection="rowSelection"
        :pagination="pagination"
      >
        <template slot="info" slot-scope="text, record">
          <div v-html="record.info"></div>
        </template>
        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="handleEdit(record)" :disabled="!$verify('107035')">编辑</a>
            <a-divider type="vertical" />
            <a @click="handleDel(record)">删除</a>
          </template>
        </span>
      </a-table>

      <create-form
        ref="createModal"
        :visible="visible"
        :loading="confirmLoading"
        :roles="roleMenus"
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
  getWhiteIp,
  addWhiteIp,
  updateWhiteIp,
  delWhiteIp
} from '@/api/systemsetting'
import { Modal } from 'ant-design-vue'

import CreateForm from './modules/WhiteIpForm'

const columns = [
  // {
  //   title: 'ID',
  //   dataIndex: 'autoid',
  //   width: 80
  // },
  {
    title: '开始IP',
    dataIndex: 'startIp'
  },
  {
    title: '结束IP',
    dataIndex: 'endIp'
  },
  {
    title: '备注',
    dataIndex: 'remark'
  },
  {
    title: '时间',
    dataIndex: 'writedate',
    width: 250
  },
  {
    title: '操作人',
    dataIndex: 'createby'
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: 150,
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'whitelist',
  components: {
    STable,
    Ellipsis,
    CreateForm
  },
  data() {
    return {
      loading: false,
      columns,
      // create model
      visible: false,
      confirmLoading: false,
      mdl: null,
      roleMenus: [],
      // 高级搜索 展开/关闭
      advanced: false,
      // // 搜索状态
      // disabledSearch: false,
      // 查询参数
      queryParam: {
        key: '',
        startdate: '',
        enddate: ''
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
    startChange(date, dateString) {
      this.queryParam.startdate = dateString
    },
    endChange(date, dateString) {
      this.queryParam.enddate = dateString
    },
    handleEdit(record) {
      // get menu data
      this.roleMenus = []
      this.visible = true
      this.mdl = { ...record }
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
            updateWhiteIp(values).then((res) => {
              this.visible = false
              this.confirmLoading = false
              // 重置表单数据
              form.resetFields()
              // 刷新表格
              // this.$refs.table.refresh()
              this.getData()

              this.$message.success('修改成功')
            })
          } else {
            // 新增
            addWhiteIp(values).then((res) => {
              this.confirmLoading = false
              const { code } = res
              if (code !== 0) {
                return
              }
              this.visible = false
              // 重置表单数据
              form.resetFields()
              // 刷新表格
              // this.$refs.table.refresh()
              this.getData()
              this.$message.success('新增成功')
            })
          }
        } else {
          this.confirmLoading = false
        }
      })
    },
    handleDel(record) {
      const ts = this
      const delMod = Modal.confirm({
        centered: true,
        maskClosable: true,
        title: '提示信息',
        content: `确定删除【${record.startIp}-${record.endIp}】的记录？`,
        onOk: () => {
          delWhiteIp({
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
    handleCancel() {
      this.visible = false
      this.confirmLoading = false
      const form = this.$refs.createModal.form
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
      const res = await getWhiteIp(this.queryParam)
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
