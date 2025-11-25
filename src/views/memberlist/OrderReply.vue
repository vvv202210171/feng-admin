<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <!-- :model="queryParam" -->
      <a-form name="configSearch" layout="inline" autocomplete="off" style="margin-bottom: 14px" @submit="doSearch">
        <a-form-item label="搜索">
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
        <!-- :rowSelection="rowSelection" -->

        <!-- <template slot="info" slot-scope="text, record">
          <div v-html="record.info"></div>
        </template> -->
        <span slot="images" slot-scope="text, record">
          <span v-for="(img, index) in record.images.split(',')" :key="index" style="margin-right: 8px">
            <a :href="imgUrl(img)" target="_blank">
              <img :src="imgUrl(img)" width="50" />
            </a>
          </span>
        </span>

        <template slot="state" slot-scope="text, record">
          <span v-if="record.state === 'already'">已回复</span>
          <span v-if="record.state === 'sending'" style="color: #eb1345">待回复</span>
        </template>

        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="handleEdit(record)" :disabled="!$verify('101004')">编辑</a>
          </template>
        </span>
      </a-table>

      <s-modal
        ref="createModal"
        :config="{ title: '编辑' }"
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
  getOnlineOrderList,
  // addOnlineOrder,
  editOnlineOrder
} from '@/api/members'
// import { Modal } from 'ant-design-vue'
// import CreateForm from './modules/OrderReplyForm'
const modalOptions = [
  { title: 'ID', field: 'autoid', type: 'input', decorator: {}, disabled: true, hidden: true },
  { title: '会员', field: 'member', type: 'input', decorator: {}, disabled: true },
  { title: '概述', field: 'title', type: 'input', decorator: {} },
  {
    title: '问题',
    field: 'quest',
    type: 'textarea',
    rows: 8,
    decorator: { rules: [{ required: true, message: '请输入问题' }] }
  },
  {
    title: '回复',
    field: 'reply',
    type: 'textarea',
    rows: 8,
    decorator: { rules: [{ required: true, message: '请输入回复' }] }
  }
]

const columns = [
  {
    dataIndex: 'autoid',
    title: 'ID',
    width: 80
  },
  {
    dataIndex: 'member',
    title: '会员',
    width: 150
  },
  {
    dataIndex: 'title',
    title: '概述',
    width: 150
  },
  {
    dataIndex: 'quest',
    title: '问题',
    width: 300
  },
  {
    dataIndex: 'images',
    title: '问题图片',
    width: 300,
    scopedSlots: { customRender: 'images' }
  },
  {
    dataIndex: 'state',
    title: '状态',
    width: 100,
    scopedSlots: { customRender: 'state' }
  },
  {
    dataIndex: 'reply',
    title: '回复',
    width: 200
  },
  {
    dataIndex: 'writedate',
    title: '时间',
    width: 110
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: 150,

    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'OrderReplyList',
  components: {
    STable,
    Ellipsis,
    SModal
    // CreateForm
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
      modalOptions,
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
          console.log(values)
          if (values.autoid > 0) {
            // 修改 e.g.
            editOnlineOrder(values).then((res) => {
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
            // // 新增
            // addConfig(values)
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
      const { current, pageSize } = this.pagination
      this.queryParam.page = current
      this.queryParam.limit = pageSize
      const res = await getOnlineOrderList(this.queryParam)
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
