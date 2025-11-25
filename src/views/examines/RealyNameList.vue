<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <!-- :model="queryParam" -->
      <a-form name="Search" layout="inline" autocomplete="off" style="margin-bottom: 14px" @submit="doSearch">
        <a-form-item label="搜索内容">
          <a-input style="width: 240px" v-model="queryParam.key" placeholder="请输入要搜索的内容"> </a-input>
        </a-form-item>
        <a-form-item label="时间">
          <a-date-picker v-model="queryParam.startdate" @change="startChange" />~<a-date-picker
            v-model="queryParam.enddate"
            @change="endChange"
          />
        </a-form-item>
        <a-form-item>
          <a-button htmlType="submit" :disabled="disabledSearch" type="primary" @click="doSearch">查询</a-button>
        </a-form-item>
        <a-form-item style="float: right">
          <a-button
            type="primary"
            @click="batchAudit('completed')"
            :disabled="!this.selectedRowKeys || this.selectedRowKeys.length <= 0"
            >批量通过</a-button
          >
          <a-divider type="verticle" />
          <!-- <a-button
            type="danger"
            @click="batchAudit('reject')"
            :disabled="!this.selectedRowKeys || this.selectedRowKeys.length <= 0"
            >批量拒绝</a-button
          > -->
        </a-form-item>
      </a-form>

      <!-- <div class="table-operator">
        <a-button type="primary" icon="plus" @click="handleAdd">新建</a-button>
      </div> -->

      <a-table
        ref="table"
        size="default"
        row-key="autoid"
        :rowSelection="rowSelection"
        :loading="loading"
        :scroll="{ x: 980 }"
        bordered
        :columns="columns"
        :dataSource="loadData"
        :pagination="pagination"
      >
        <template slot="idcardstate" slot-scope="text, record">
          <span v-if="record.idcardstate === 'no'">未认证</span>
          <span v-if="record.idcardstate === 'review'" style="color: #eb1345">待审核</span>
          <span v-if="record.idcardstate === 'completed'">已完成</span>
          <span v-if="record.idcardstate === 'reject'">已驳回</span>
        </template>

        <template slot="state" slot-scope="text, record">
          <span v-if="record.state === 'enable'">启用</span>
          <span v-if="record.state === 'disable'" style="color: #eb1345">冻结</span>
        </template>

        <template slot="zm" slot-scope="text, record">
          <span v-if="record.zm === '--'"></span>
          <img v-else :src="imgUrl(record.zm)" height="150" width="200" />
        </template>

        <template slot="fm" slot-scope="text, record">
          <span v-if="record.fm === '--'"></span>
          <img v-else :src="imgUrl(record.fm)" height="150" width="200" />
        </template>

        <template slot="sc" slot-scope="text, record">
          <span v-if="record.sc === '--'"></span>
          <img v-else :src="imgUrl(record.sc)" height="150" width="200" />
        </template>

        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="handleEdit(record)" :disabled="!$verify('112011')">编辑</a>
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
  getRealyNameList,
  // delRealyName,
  // addRealyName,
  editRealyName,
  editRealyNameV2
} from '@/api/examine'
// import { Modal } from 'ant-design-vue'

// import StepByStepModal from './modules/StepByStepModal'
// import CreateForm from './modules/RealyNameForm'

const columns = [
  {
    title: 'ID',
    dataIndex: 'autoid',
    width: 80
  },
  {
    dataIndex: 'member',
    title: '账户',
    width: 140
  },
  {
    dataIndex: 'username',
    title: '真实姓名',
    width: 100
  },
  {
    dataIndex: 'tel',
    title: '电话',
    width: 100
  },
  {
    dataIndex: 'email',
    title: '邮箱',
    width: 100
  },
  {
    dataIndex: 'idcardstate',
    title: '实名状态',
    width: 100,
    scopedSlots: { customRender: 'idcardstate' }
  },
  {
    dataIndex: 'state',
    title: '账户状态',
    width: 100,
    scopedSlots: { customRender: 'state' }
  },
  {
    dataIndex: 'zm',
    title: '正面',
    width: 250,
    scopedSlots: { customRender: 'zm' }
  },
  {
    dataIndex: 'fm',
    title: '反面',
    width: 250,
    scopedSlots: { customRender: 'fm' }
  },

  {
    dataIndex: 'idcard',
    width: 250,
    title: '身份证号'
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: 150,
    scopedSlots: { customRender: 'action' }
  }
]
const modalOptions = [
  { title: '编号', field: 'autoid', type: 'input', decorator: {}, disabled: true, hidden: true },
  {
    title: '账号',
    field: 'member',
    type: 'input',
    placeholder: '请输入账号',
    disabled: true,
    decorator: { rules: [{ required: true, message: '请输入账号' }] }
  },
  {
    title: '身份证号',
    field: 'idcard',
    type: 'input',
    placeholder: '请输入',
    disabled: true,
    decorator: { rules: [{ required: true, message: '请输入身份证号' }] }
  },
  {
    title: '真实姓名',
    field: 'username',
    type: 'input',
    placeholder: '请输入',
    disabled: true,
    decorator: { rules: [{ required: true, message: '请输入真实姓名' }] }
  },
  {
    title: '审核结果',
    field: 'idcardstate',
    type: 'select',
    options: [
      { val: 'review', title: '待审核' },
      { val: 'completed', title: '通过' },
      { val: 'reject', title: '驳回' }
    ],
    decorator: { rules: [{ required: true, message: '请选择审核结果' }] }
  },
  {
    title: '原因(会员可见)',
    field: 'idReason',
    type: 'input',
    placeholder: '如果是驳回，请输入原因'
  },
  {
    title: '原因(后台可见)',
    field: 'idReasonBo',
    type: 'input',
    placeholder: '如果是驳回，请输入原因'
  },
  { title: '正面图片', field: 'zm', type: 'image-show' },
  { title: '反面图片', field: 'fm', type: 'image-show' }
  // { title: '手持图片', field: 'sc', type: 'image-show' }
]

export default {
  name: 'RealyNameList',
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
      modalOptions,
      roleMenus: [],
      modalConfig: {},
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
    async batchAudit(state) {
      if (!this.selectedRowKeys || this.selectedRowKeys.length <= 0) {
        this.$message.error('请选择操作用户')
      }
      const res = await editRealyNameV2({ state: state, autoids: this.selectedRowKeys.join() })
      if (res.code === 0) {
        this.$message.success('审核成功')
        this.getData()
        return
      }
      this.$message.error(res.message)
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
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
      this.mdl.idReason = ''
      this.mdl.idReasonBo = ''
      this.modalConfig['title'] = '审核信息'
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
            editRealyName(values)
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
            // addRealyName(values)
            //   .then(res => {
            //     console.log(res)
            //     this.visible = false
            //     this.confirmLoading = false
            //     // 重置表单数据
            //     form.resetFields()
            //     // 刷新表格
            //     // this.$refs.table.refresh()
            //     this.getData()
            //     this.$message.success('新增成功')
            //   })
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
      //     delRealyName({
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

      const res = await getRealyNameList(this.queryParam)
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
