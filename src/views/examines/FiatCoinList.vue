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
      </a-form>

      <!-- <div class="table-operator">
        <a-button type="primary" icon="plus" @click="handleAdd">新建</a-button>
      </div> -->

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
        <template slot="state" slot-scope="text, record">
          <span v-if="record.state === 'sending'" style="color: #eb1345">待审核</span>
          <span v-if="record.state === 'success'">已完成</span>
          <span v-if="record.state === 'close'">已取消</span>
        </template>
        <template slot="imgurl" slot-scope="text, record">
          <span v-if="record.imgurl === '--'"></span>
          <img v-else :src="imgUrl(record.imgurl)" width="100" />
        </template>

        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="handleEdit(record)" :disabled="!$verify('112014')">编辑</a>
            <!-- <a-divider type="vertical" />
            <a @click="handleEdit(record)">撤单</a> -->
            <!-- <a @click="handleDel(record)">删除</a> -->
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
  getFiatCoinList,
  editFiatCoin
} from '@/api/examine'
// import { Modal } from 'ant-design-vue'

// import StepByStepModal from './modules/StepByStepModal'
// import CreateForm from './modules/FiatCoinForm'

const columns = [
  {
    dataIndex: 'member',
    title: '会员号',
    width: 100
  },
  {
    dataIndex: 'email',
    title: '邮箱',
    width: 80
  },
  {
    dataIndex: 'tel',
    title: '电话',
    width: 80
  },
  {
    dataIndex: 'coin',
    title: '币种',
    width: 100
  },
  {
    dataIndex: 'payprice',
    title: '支付金额',
    width: 100
  },
  {
    dataIndex: 'state',
    title: '状态',
    width: 90,
    scopedSlots: { customRender: 'state' }
    // templet: function (d) {
    //   if (d.state == "sending") {
    //     return '<lable style="color:#eb1345;">待审核</lable>';
    //   } else if (d.state == "success") {
    //     return "已完成";
    //   } else if (d.state == "close") {
    //     return "已取消";
    //   }
    // }
  },
  {
    dataIndex: 'imgurl',
    title: '充值截图',
    width: 100,
    scopedSlots: { customRender: 'imgurl' }
  },
  {
    dataIndex: 'address',
    title: '收款地址',
    width: 200
  },
  {
    dataIndex: 'number',
    title: '下单数量',
    width: 100
  },

  {
    dataIndex: 'orderid',
    title: '订单号',
    width: 200
  },
  {
    dataIndex: 'writedate',
    title: '操作时间',
    width: 150
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: 150,
    scopedSlots: { customRender: 'action' }
  }
]
const modalOptions = [
  // { title: '编号', field: 'autoid', type: 'input', decorator: {}, disabled: true, hidden: true },
  { title: '订单号', field: 'orderid', type: 'input', decorator: {}, disabled: true },
  { title: '收款地址', field: 'address', type: 'input', placeholder: '请输入', disabled: true, hidden: true },
  {
    title: '下单数量',
    field: 'number',
    type: 'input',
    placeholder: '请输入',
    decorator: { rules: [{ required: true, message: '请输入下单数量' }] },
    disabled: true
  },

  {
    title: '审核结果',
    field: 'state',
    type: 'select',
    placeholder: '请选择审核结果',
    options: [
      { val: 'completed', title: '通过' },
      { val: 'reject', title: '驳回' }
    ],
    decorator: { rules: [{ required: true, message: '请选择审核结果' }] }
  },
  {
    title: '原因(会员可见)',
    field: 'reason',
    type: 'input',
    placeholder: '如果是驳回，请输入原因'
  },
  {
    title: '原因(后台可见)',
    field: 'reasonBo',
    type: 'input',
    placeholder: '如果是驳回，请输入原因'
  }
]

export default {
  name: 'FiatCoinList',
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
      modalConfig: {
        title: '订单审核'
      },
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
      this.mdl = { ...record, state: undefined }
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
          editFiatCoin(values)
            .then((res) => {
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
      // const delMod =
      // Modal.confirm({
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
      //     // delUserLevel({
      //     //   username: record.username,
      //     //   autoid: record.autoid
      //     // })
      //     //   .then(res => {
      //     //     console.log(res)
      //     //     ts.getData()
      //     //     delMod.destroy()
      //     //   })
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

      const res = await getFiatCoinList(this.queryParam)
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
