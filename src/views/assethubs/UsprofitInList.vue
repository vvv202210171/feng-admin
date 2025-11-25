<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <!-- :model="queryParam" -->
      <a-form name="Search" layout="inline" autocomplete="off" style="margin-bottom: 14px" @submit="doSearch">
        <a-form-item label="搜索内容">
          <a-input style="width: 240px" v-model="queryParam.key" placeholder="请输入要搜索的内容"> </a-input>
        </a-form-item>
        <a-form-item label="代理账户">
          <a-input style="width: 240px" v-model="queryParam.parentVal" placeholder="请输入要搜索的内容"> </a-input>
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
        <template slot="state" slot-scope="text, record">
          <span v-if="record.state === 'sending'" style="color: #eb1345">未审核</span>
          <span v-else-if="record.state === 'completed'">已完成</span>
          <span v-else-if="record.state === 'dismissed'">已驳回</span>
        </template>
        <template slot="collect" slot-scope="text, record">
          <span v-if="record.collect === 'disable'" style="color: #eb1345">未汇总</span>
          <span v-else-if="record.collect === 'enable'">已汇总</span>
        </template>
        <template slot="collectstate" slot-scope="text, record">
          <span v-if="record.collectstate === 'disable'" style="color: #eb1345">未充值</span>
          <span v-else-if="record.collectstate === 'enable'">已充值</span>
        </template>
        <template slot="imgurl" slot-scope="text, record">
          <a :href="imgUrl(record.imgurl)" target="_blank">
            <img :src="imgUrl(record.imgurl)" width="100%" height="50%" />
          </a>
        </template>
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
  getUsprofitinList
} from '@/api/assethub'

const columns = [
  {
    dataIndex: 'autoid',
    title: 'ID',
    width: 80
  },
  {
    dataIndex: 'member',
    title: '账户',
    width: 100
  },
  {
    dataIndex: 'parent',
    title: '代理',
    width: 100
  },
  {
    dataIndex: 'tel',
    title: '手机',
    width: 130
  },
  {
    dataIndex: 'email',
    title: '邮箱',
    width: 150
  },
  {
    dataIndex: 'username',
    title: '姓名',
    width: 100
  },
  {
    dataIndex: 'coin',
    title: '币种',
    width: 100
  },
  {
    dataIndex: 'number',
    title: '数量',
    width: 100
  },
  {
    dataIndex: 'address',
    title: '地址',
    width: 200
  },
  {
    dataIndex: 'imgurl',
    title: '充值截图',
    width: 100,
    scopedSlots: { customRender: 'imgurl' }
  },
  {
    dataIndex: 'writedate',
    title: '充值时间',
    width: 150
  },
  {
    dataIndex: 'state',
    title: '审核状态',
    width: 90,
    scopedSlots: { customRender: 'state' }
  },
  {
    dataIndex: 'collect',
    title: '汇总状态',
    width: 90,
    scopedSlots: { customRender: 'collect' }
  },
  {
    dataIndex: 'conllectaddress',
    title: '审核人',
    width: 95
  },
  {
    dataIndex: 'collectstate',
    title: '手续费状态',
    width: 100,
    scopedSlots: { customRender: 'collectstate' }
  },
  {
    dataIndex: 'conllectdate',
    title: '汇总时间',
    width: 150
  },
  {
    dataIndex: 'conllecthash',
    title: '汇总哈希',
    width: 200
  },
  {
    dataIndex: 'title',
    title: '备注',
    width: 100
  },
  {
    dataIndex: 'tag',
    title: '标签',
    width: 100
  },
  {
    dataIndex: 'reason',
    title: '驳回原因（会员可见）',
    width: 150
  },
  {
    dataIndex: 'reasonBo',
    title: '驳回原因（后台可见）',
    width: 150
  }
]
export default {
  name: 'UsprofitInList',
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
        parentVal: '',
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
      this.queryParam.page = 1
      this.getData()
    },
    async getData() {
      this.loading = true

      const res = await getUsprofitinList(this.queryParam)
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
