<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <!-- :model="queryParam" -->
      <a-form name="adminSearch" layout="inline" autocomplete="off" style="margin-bottom: 14px" @submit="doSearch">
        <a-form-item label="">
          <a-input style="width: 240px" v-model="queryParam.key" placeholder="请输入要搜索的内容"> </a-input>
        </a-form-item>
        <a-form-item>
          <a-button htmlType="submit" :disabled="disabledSearch" type="primary" @click="doSearch">查询</a-button>
        </a-form-item>
      </a-form>
      <!-- <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="">
                <a-input v-model="queryParam.id" placeholder="请输入要搜索的内容"/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
            </a-col> -->
      <!-- <a-col :md="8" :sm="24">
              <a-form-item label="使用状态">
                <a-select v-model="queryParam.status" placeholder="请选择" default-value="0">
                  <a-select-option value="0">全部</a-select-option>
                  <a-select-option value="1">关闭</a-select-option>
                  <a-select-option value="2">运行中</a-select-option>
                </a-select>
              </a-form-item>
            </a-col> -->
      <!-- <template v-if="advanced">
              <a-col :md="8" :sm="24">
                <a-form-item label="调用次数">
                  <a-input-number v-model="queryParam.callNo" style="width: 100%"/>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="更新日期">
                  <a-date-picker v-model="queryParam.date" style="width: 100%" placeholder="请输入更新日期"/>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="使用状态">
                  <a-select v-model="queryParam.useStatus" placeholder="请选择" default-value="0">
                    <a-select-option value="0">全部</a-select-option>
                    <a-select-option value="1">关闭</a-select-option>
                    <a-select-option value="2">运行中</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="使用状态">
                  <a-select placeholder="请选择" default-value="0">
                    <a-select-option value="0">全部</a-select-option>
                    <a-select-option value="1">关闭</a-select-option>
                    <a-select-option value="2">运行中</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </template> -->
      <!-- <a-col :md="!advanced && 8 || 24" :sm="24">
              <span class="table-page-search-submitButtons" :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
                <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
                <a-button style="margin-left: 8px" @click="() => this.queryParam = {}">重置</a-button>
                <a @click="toggleAdvanced" style="margin-left: 8px">
                  {{ advanced ? '收起' : '展开' }}
                  <a-icon :type="advanced ? 'up' : 'down'"/>
                </a>
              </span>
            </a-col> -->
      <!-- </a-row>
        </a-form>
      </div> -->

      <div class="table-operator">
        <a-button type="primary" icon="plus" @click="handleAdd">新建管理员</a-button>
        <!-- <a-dropdown v-action:edit v-if="selectedRowKeys.length > 0">
          <a-menu slot="overlay">
            <a-menu-item key="1"><a-icon type="delete" />删除用户</a-menu-item>
            <a-menu-item key="2"><a-icon type="lock" />锁定用户</a-menu-item>
          </a-menu>
          <a-button style="margin-left: 8px">
            批量操作 <a-icon type="down" />
          </a-button>
        </a-dropdown> -->
      </div>

      <!-- <s-table
        ref="table"
        size="default"
        rowKey="key"
        :columns="columns"
        :data="loadData"
        :alert="true"
        :rowSelection="rowSelection"
        showPagination="auto"
      >
        <span slot="serial" slot-scope="text, record, index">
          {{ index + 1 }}
        </span>

        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="handleEdit(record)">编辑</a>
            <a-divider type="vertical" />
            <a @click="handleDel(record)">删除</a>
          </template>
        </span>
      </s-table> -->
      <a-table
        ref="table"
        size="default"
        row-key="autoid"
        :loading="loading"
        :columns="columns"
        :dataSource="loadData"
        :rowSelection="rowSelection"
        :pagination="pagination"
      >
        <!-- <span slot="range" slot-scope="text, record">
          <trend :flag="record.status === 0 ? 'up' : 'down'">
            {{ text }}%
          </trend>
        </span> -->

        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="handleEdit(record)">编辑</a>
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
      <!-- <step-by-step-modal ref="modal" @ok="handleOk"/> -->
    </a-card>
  </page-header-wrapper>
</template>

<script>
import moment from 'moment'
import { STable, Ellipsis } from '@/components'
import {
  // getRoleList,
  getAdminList,
  delAdmin,
  addAdmin,
  editAdmin
} from '@/api/systemsetting'
import { Modal } from 'ant-design-vue'

// import StepByStepModal from './modules/StepByStepModal'
import CreateForm from './modules/AdminForm'

const columns = [
  {
    title: 'ID',
    dataIndex: 'autoid',
    width: 80
  },
  {
    title: '账号',
    dataIndex: 'username',
    width: 200
  },
  {
    title: '电话号码',
    dataIndex: 'tel',
    width: 150
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    width: 200
  },
  {
    title: '备注',
    dataIndex: 'remarks',
    width: 250
  },
  {
    title: '添加时间',
    dataIndex: 'writedate',
    width: 200
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: 150,
    scopedSlots: { customRender: 'action' }
  }
]

// const statusMap = {
//   0: {
//     status: 'default',
//     text: '关闭'
//   },
//   1: {
//     status: 'processing',
//     text: '运行中'
//   },
//   2: {
//     status: 'success',
//     text: '已上线'
//   },
//   3: {
//     status: 'error',
//     text: '异常'
//   }
// }

export default {
  name: 'AdminList',
  components: {
    STable,
    Ellipsis,
    CreateForm
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
      roleMenus: [],
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
      // loadData: parameter => {
      //   const requestParameters = Object.assign({}, parameter, this.queryParam)
      //   console.log('loadData request parameters:', requestParameters)
      //   return getAdminList(requestParameters)
      //     .then(res => {
      //       console.log(res)
      //       if (res.code === '0') {
      //         return res.data
      //       } else {
      //         return []
      //       }
      //     })
      // },,
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
      // this.actions = 'add'
    },
    handleEdit(record) {
      // get menu data
      this.roleMenus = []
      this.visible = true
      this.mdl = { ...record }
      // this.actions = 'edit'
    },
    handleOk() {
      const form = this.$refs.createModal.form
      this.confirmLoading = true
      form.validateFields((errors, values) => {
        if (!errors) {
          console.log('values', values)
          Object.keys(values).map((e) => {
            if (values[e] === undefined) {
              values[e] = ''
            }
          })
          console.log(values)
          if (values.autoid > 0) {
            // 修改 e.g.
            editAdmin(values).then((res) => {
              console.log(res)
            })
            // new Promise((resolve, reject) => {
            //   setTimeout(() => {
            //     resolve()
            //   }, 1000)
            // }).then(res => {
            //   this.visible = false
            //   this.confirmLoading = false
            //   // 重置表单数据
            //   form.resetFields()
            //   // 刷新表格
            //   // this.$refs.table.refresh()
            //   this.getData()

            //   this.$message.success('修改成功')
            // })
          } else {
            // 新增
            addAdmin(values).then((res) => {
              console.log(res)
            })
            // new Promise((resolve, reject) => {
            //   setTimeout(() => {
            //     resolve()
            //   }, 1000)
            // }).then(res => {
            //   this.visible = false
            //   this.confirmLoading = false
            //   // 重置表单数据
            //   form.resetFields()
            //   // 刷新表格
            //   // this.$refs.table.refresh()
            //   this.getData()

            //   this.$message.success('新增成功')
            // })
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
        content: `确定删除【${record.username}】的记录？`,
        onOk: () => {
          delAdmin({
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
    handleSub(record) {
      if (record.status !== 0) {
        this.$message.success(`${record.no} 订阅成功`)
      } else {
        this.$message.error(`${record.no} 订阅失败，规则已关闭`)
      }
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    // toggleAdvanced () {
    //   this.advanced = !this.advanced
    // },
    doSearch() {
      console.log(this.queryParam)
      this.getData()
    },
    async getData() {
      this.loading = true

      //   console.log('loadData request parameters:', requestParameters)
      //   return
      const res = await getAdminList(this.queryParam)
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
    },
    resetSearchForm() {
      this.queryParam = {
        date: moment(new Date())
      }
    }
  }
}
</script>
