<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <!-- :model="queryParam" -->
      <a-form name="Search" layout="inline" autocomplete="off" style="margin-bottom: 14px" @submit="doSearch">
        <a-form-item>
          <a-button htmlType="submit" :disabled="disabledSearch" type="primary" @click="doSearch">刷新</a-button>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" icon="plus" @click="handleAdd" :disabled="!$verify('107015')">新建设定</a-button>
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
        :pagination="false"
      >
        <!-- <span slot="serial" slot-scope="text, record, index">
            {{ index + 1 }}
          </span> -->
        <template slot="logo" slot-scope="text, record">
          <img :src="imgUrl(record.logo)" alt="" width="64" height="64" />
        </template>

        <template slot="blockweb" slot-scope="text, record">
          <a class="layui-blue" :href="record.blockweb" target="_blank">{{ record.blockweb }}</a>
        </template>

        <template slot="web" slot-scope="text, record">
          <a class="layui-blue" :href="record.web" target="_blank">{{ record.web }}</a>
        </template>

        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="handleEdit(record)" :disabled="!$verify('107016')">编辑</a>
            <a-divider type="vertical" />
            <a @click="handleDel(record)" :disabled="!$verify('107014')">删除</a>
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
  getVipSettingList,
  deleteVipSetting,
  savetVipSetting
} from '@/api/members'
import { Modal } from 'ant-design-vue'

// import StepByStepModal from './modules/StepByStepModal'

const columns = [
  {
    title: 'ID',
    dataIndex: 'autoid',
    width: 80
  },
  {
    dataIndex: 'name',
    title: '名称',
    width: 100
  },
  {
    dataIndex: 'bonus',
    title: '奖金',
    width: 100
  },
  {
    dataIndex: 'usdt',
    title: 'USDT总入款金额',
    width: 100
  },
  {
    dataIndex: 'ratio',
    title: '奖金比例',
    width: 100
  },
  {
    dataIndex: 'updateTime',
    title: '更新时间',
    width: 100
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
    title: '名称',
    field: 'name',
    type: 'input',
    placeholder: '请输入',
    decorator: { rules: [{ required: true, message: '请输入等级名称' }] }
  },
  {
    title: 'USDT总入款金额',
    field: 'usdt',
    type: 'number',
    placeholder: '请输入',
    decorator: { rules: [{ required: true, message: 'USDT总入款金额不能为空' }] }
  },
  {
    title: '奖金',
    field: 'bonus',
    type: 'number',
    placeholder: '请输入',
    decorator: { rules: [{ required: true, message: '奖金不能为空' }] }
  },
  {
    title: '奖金比例',
    field: 'ratio',
    type: 'number',
    placeholder: '请输入',
    decorator: { rules: [{ required: true, message: '奖金比例不能为空' }] }
  }
]
const editOptions = [
  { title: 'ID', field: 'autoid', type: 'input', decorator: {}, disabled: true, hidden: true },
  {
    title: '名称',
    field: 'name',
    type: 'input',
    placeholder: '请输入',
    decorator: { rules: [{ required: true, message: '请输入等级名称' }] }
  },
  {
    title: 'USDT总入款金额',
    field: 'usdt',
    type: 'number',
    placeholder: '请输入',
    decorator: { rules: [{ required: true, message: 'USDT总入款金额不能为空' }] }
  },
  {
    title: '奖金',
    field: 'bonus',
    type: 'number',
    placeholder: '请输入',
    decorator: { rules: [{ required: true, message: '奖金不能为空' }] }
  },
  {
    title: '奖金比例',
    field: 'ratio',
    type: 'number',
    placeholder: '请输入',
    decorator: { rules: [{ required: true, message: '奖金比例不能为空' }] }
  }
]

export default {
  name: 'CurrencyList',
  components: {
    STable,
    Ellipsis,
    SModal
  },
  data() {
    // this.columns = columns
    return {
      loading: false,
      columns,
      // create model
      visible: false,
      langVisible: false,
      confirmLoading: false,
      mdl: null,
      langData: [],
      modalOptions,
      roleMenus: [],
      modalConfig: {},
      edit: {
        visible: false,
        mdl: null
      },
      editOptions,
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
      this.roleMenus = []
      this.mdl = null
      this.visible = true
      this.modalConfig['title'] = '新增'
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
      this.edit.visible = true
      this.edit.mdl = { ...record }
      this.modalConfig['title'] = '编辑'
    },
    handleOk() {
      const form = this.$refs.createModal.form
      this.confirmLoading = true
      form.validateFields((errors, values) => {
        if (!errors) {
          // 添加username
          values = {
            ...values
          }
          Object.keys(values).map((e) => {
            if (values[e] === undefined) {
              values[e] = ''
            }
            if (e === 'info') {
              values['abstract'] = values[e]
            }
          })
          // 新增
          savetVipSetting(values)
            .then((res) => {
              console.log(res)
              const { code, msg } = res
              if (code === 0) {
                this.visible = false
                this.edit.visible = false
                this.confirmLoading = false
                // 重置表单数据
                form.resetFields()
                // 刷新表格
                // this.$refs.table.refresh()
                this.getData()

                this.$message.success('保存成功')
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
            if (e === 'info') {
              values['abstract'] = values[e]
            }
          })
          console.log(values)
          if (values.autoid > 0) {
            // 修改 e.g.
            savetVipSetting(values)
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
      this.visible = false
      this.edit.visible = false
      this.confirmLoading = false
      const form = this.$refs.createModal.form
      form.resetFields() // 清理表单数据（可不做）
      const editform = this.$refs.editModal.form
      editform.resetFields() // 清理表单数据（可不做）
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
          deleteVipSetting({
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

      const res = await getVipSettingList(this.queryParam)
      const { code, data } = res
      if (code === 0) {
        this.loadData = data
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