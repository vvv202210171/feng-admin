<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <!-- :model="queryParam" -->
      <a-form name="Search" layout="inline" autocomplete="off" style="margin-bottom: 14px" @submit="doSearch">
        <!-- <a-form-item label="搜索内容">
          <a-input style="width: 240px;" v-model="queryParam.key" placeholder="请输入要搜索的内容">
          </a-input>
        </a-form-item>
        <a-form-item label="代理账户">
          <a-input style="width: 240px;" v-model="queryParam.parentVal" placeholder="请输入要搜索的内容">
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-button
            htmlType="submit"
            :disabled="disabledSearch"
            type="primary"
            @click="doSearch"
          >查询</a-button>
        </a-form-item> -->
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
        <span slot="standrad" slot-scope="text, record">
          {{ record.standrad === 'enable' ? '是' : record.standrad === 'disable' ? '否' : record.state }}
        </span>
        <!-- <span slot="action" slot-scope="text, record">
          <template>
            <a @click="handleEdit(record)">编辑</a>
            <a-divider type="vertical" />
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
  getCycleStaticsList
} from '@/api/cycle'

const columns = [
  {
    title: 'ID',
    dataIndex: 'autoid',
    width: 80
  },
  {
    dataIndex: 'maincoin',
    title: '主币种',
    width: 150
  },
  {
    dataIndex: 'tradcoin',
    title: '交易币种',
    width: 150
  },
  {
    dataIndex: 'standrad',
    title: '重仓',
    width: 100,
    scopedSlots: { customRender: 'standrad' }
    // ,templet:function(d){
    //   if(d.standrad == "enable"){
    //       return '是';
    //   }else if(d.standrad == "disable"){
    //       return "否";
    //   }
  },
  {
    dataIndex: 'unfilled',
    title: '数量',
    width: 150
  }
]

export default {
  name: 'CycleStaticsList',
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
        key: ''
      },
      // 加载数据方法 必须为 Promise 对象
      loadData: [],
      pagination: {
        total: 0,
        current: 1,
        pageSize: 200,
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
    // handleAdd () {
    //   // get menu data
    //   this.roleMenus = []
    //   this.mdl = null
    //   this.visible = true
    // },
    // handleEdit (record) {
    //   // get menu data
    //   this.roleMenus = []
    //   this.visible = true
    //   this.mdl = { ...record }
    // },
    // handleOk () {
    //   // const form = this.$refs.createModal.form
    //   // const username = this.$store.getters.username
    //   // this.confirmLoading = true
    //   // form.validateFields((errors, values) => {
    //   //   if (!errors) {
    //   //     // 添加username
    //   //     values = {
    //   //       ...values,
    //   //       username
    //   //     }
    //   //     Object.keys(values).map(e => {
    //   //       if (values[e] === undefined) {
    //   //         values[e] = ''
    //   //       }
    //   //     })
    //   //     console.log(values)
    //   //     if (values.autoid > 0) {
    //   //       // 修改 e.g.
    //   //       editCurrency(values)
    //   //         .then(res => {
    //   //           console.log(res)
    //   //           this.visible = false
    //   //           this.confirmLoading = false
    //   //           // 重置表单数据
    //   //           form.resetFields()
    //   //           // 刷新表格
    //   //           // this.$refs.table.refresh()
    //   //           this.getData()

    //   //           this.$message.success('修改成功')
    //   //         })
    //   //     } else {
    //   //       // 新增
    //   //       addCurrency(values)
    //   //         .then(res => {
    //   //           console.log(res)
    //   //           this.visible = false
    //   //           this.confirmLoading = false
    //   //           // 重置表单数据
    //   //           form.resetFields()
    //   //           // 刷新表格
    //   //           // this.$refs.table.refresh()
    //   //           this.getData()

    //   //           this.$message.success('新增成功')
    //   //         })
    //   //     }
    //   //   } else {
    //   //     this.confirmLoading = false
    //   //   }
    //   // })
    // },
    // handleCancel () {
    //   this.visible = false

    //   const form = this.$refs.createModal.form
    //   form.resetFields() // 清理表单数据（可不做）
    //   this.roleMenus = []
    // },
    // handleDel (record) {
    //   console.log('del', record)
    //   // const ts = this
    //   // const delMod = Modal.confirm({
    //   //   centered: true,
    //   //   maskClosable: true,
    //   //   title: '提示信息',
    //   //   content: `确定删除【${record.username}】的记录？`,
    //   //   onOk: () => {
    //   //     // return new Promise((resolve, reject) => {
    //   //     //   setTimeout(Math.random() > 0.5 ? resolve : reject, 1500)
    //   //     // }).catch(() => console.log('Oops errors!'))
    //   //     // return this.$store.dispatch('Logout').then(() => {
    //   //     //   this.$router.push({ name: 'login' })
    //   //     // })
    //   //     delCurrency({
    //   //       username: record.username,
    //   //       autoid: record.autoid
    //   //     })
    //   //       .then(res => {
    //   //         console.log(res)
    //   //         ts.getData()
    //   //         delMod.destroy()
    //   //       })
    //   //   },
    //   //   onCancel () {}
    //   // })
    // },
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

      const res = await getCycleStaticsList(this.queryParam)
      const { code, data } = res
      if (code === '0') {
        this.loadData = data
        this.pagination.total = data.length
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
