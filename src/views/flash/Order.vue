<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <!-- :model="queryParam" -->
      <a-form name="Search" layout="inline" autocomplete="off" style="margin-bottom: 14px" @submit="doSearch">
        <a-form-item label="搜索内容">
          <a-input style="width: 240px" v-model="queryParam.key" placeholder="请输入要搜索的内容"> </a-input>
        </a-form-item>
        <!-- <a-form-item label="代理账户">
            <a-input style="width: 240px;" v-model="queryParam.parentVal" placeholder="请输入要搜索的内容">
            </a-input>
          </a-form-item> -->
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
          <a-button type="primary" icon="plus" @click="handleAdd">新建配置</a-button>
        </div> -->

      <a-table
        ref="table"
        size="default"
        row-key="autoid"
        :loading="loading"
        :scroll="{ x: 980 }"
        :columns="columns"
        :dataSource="loadData"
        :pagination="pagination"
      >
        <!-- <span slot="serial" slot-scope="text, record, index">
            {{ index + 1 }}
          </span> -->

        <!-- <span slot="action" slot-scope="text, record">
            <template>
              <a @click="handleEdit(record)">编辑</a>
              <a-divider type="vertical" />
              <a @click="handleDel(record)">删除</a>
            </template>
          </span> -->
      </a-table>

      <!-- <create-form
          ref="createModal"
          :visible="visible"
          :loading="confirmLoading"
          :roles="roleMenus"
          :model="mdl"
          @cancel="handleCancel"
          @ok="handleOk"
        /> -->
    </a-card>
  </page-header-wrapper>
</template>
  
  <script>
import { STable, Ellipsis } from '@/components'
import {
  // getRoleList,
  flashOrder
} from '@/api/flash'

const columns = [
  {
    dataIndex: 'autoid',
    title: 'ID',
    width: 100
  },
  {
    dataIndex: 'member',
    title: '会员ID',
    width: 150
  },
  {
    dataIndex: 'maincoin',
    title: '主币',
    width: 200
  },
  {
    dataIndex: 'tradcoin',
    title: '交易币',
    width: 200
  },
  {
    dataIndex: 'fromnumber',
    title: '主币数量',
    width: 200
  },
  {
    dataIndex: 'mainprice',
    title: '主币单价',
    width: 200
  },
  {
    dataIndex: 'tradprice',
    title: '兑换币单价',
    width: 200
  },
  {
    dataIndex: 'tonumber',
    title: '到账交易数量',
    width: 200
  },
  //   {
  //     dataIndex: 'totalprice',
  //     title: '总价',
  //     width: 200
  //   },

  {
    dataIndex: 'writedate',
    title: '时间',
    width: 150
  }
]

export default {
  name: 'LogAdminLogin',
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
        enddate: '',
        page: 1,
        limit: 20
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
          this.queryParam['limit'] = pageSize
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
    handleOk() {},
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

      const res = await flashOrder(this.queryParam)
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