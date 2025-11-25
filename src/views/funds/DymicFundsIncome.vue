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
        <span slot="state" slot-scope="text, record">
          {{
            record.state === 'receiving'
              ? '待领取'
              : record.state === 'received'
              ? '已领取'
              : record.state === 'expired'
              ? '已失效'
              : record.state
          }}
        </span>
        <!-- <span slot="action" slot-scope="text, record">
          <template>
            <a @click="handleEdit(record)">直接成交</a>
            <a-divider type="vertical" />
            <a @click="handleEdit(record)">撤单</a>
            <a @click="handleDel(record)">删除</a>
          </template>
        </span> -->
      </a-table>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { STable, Ellipsis } from '@/components'
import {
  // getRoleList,
  getDymicInComeList
} from '@/api/funds'
// import { Modal } from 'ant-design-vue'

// import StepByStepModal from './modules/StepByStepModal'
// import CreateForm from './modules/TradEntrustForm'

const columns = [
  {
    dataIndex: 'id',
    title: 'ID',
    width: 100
  },
  {
    dataIndex: 'member',
    title: '会员',
    width: 150
  },
  {
    dataIndex: 'orderId',
    title: '订单编号',
    width: 120
  },
  {
    dataIndex: 'coin',
    title: '收益币种',
    width: 120
  },
  {
    dataIndex: 'number',
    title: '收益数量',
    width: 120
  },
  {
    dataIndex: 'source',
    title: '来源',
    width: 170
  },
  {
    dataIndex: 'state',
    title: '状态',
    width: 120,
    scopedSlots: { customRender: 'state' }
    // templet: function (d) {
    //       if (d.state == "receiving") {
    //           return '待领取';
    //       } else if (d.state == "received") {
    //           return '已领取';
    //       } else if (d.state == "expired") {
    //           return '已失效';
    //       }
    //   }
  },
  {
    dataIndex: 'writedate',
    title: '产出时间',
    width: 200
  }
]

export default {
  name: 'MinerInComeList',
  components: {
    STable,
    Ellipsis
    // CreateForm
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
      // const form = this.$refs.createModal.form
      // const username = this.$store.getters.username
      // this.confirmLoading = true
      // form.validateFields((errors, values) => {
      //   if (!errors) {
      //     // 添加username
      //     values = {
      //       ...values,
      //       username
      //     }
      //     Object.keys(values).map(e => {
      //       if (values[e] === undefined) {
      //         values[e] = ''
      //       }
      //     })
      //     console.log(values)
      //     if (values.autoid > 0) {
      //       // 修改 e.g.
      //       editMember(values)
      //         .then(res => {
      //           console.log(res)
      //           this.visible = false
      //           this.confirmLoading = false
      //           // 重置表单数据
      //           form.resetFields()
      //           // 刷新表格
      //           // this.$refs.table.refresh()
      //           this.getData()
      //           this.$message.success('修改成功')
      //         })
      //     } else {
      //       // 新增
      //       // addMember(values)
      //       //   .then(res => {
      //       //     console.log(res)
      //       //     this.visible = false
      //       //     this.confirmLoading = false
      //       //     // 重置表单数据
      //       //     form.resetFields()
      //       //     // 刷新表格
      //       //     // this.$refs.table.refresh()
      //       //     this.getData()
      //       //     this.$message.success('新增成功')
      //       //   })
      //     }
      //   } else {
      //     this.confirmLoading = false
      //   }
      // })
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

      const res = await getDymicInComeList(this.queryParam)
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
