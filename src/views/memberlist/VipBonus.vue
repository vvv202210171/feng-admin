<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <!-- :model="queryParam" -->
      <a-form name="configSearch" layout="inline" autocomplete="off" style="margin-bottom: 14px" @submit="doSearch">
        <a-form-item label="搜索内容">
          <a-input style="width: 240px" v-model="queryParam.key" placeholder="请输入要搜索的内容"> </a-input>
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
        :columns="columns"
        :dataSource="loadData"
        :rowSelection="rowSelection"
        :pagination="pagination"
      >
        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="handleEdit(record)">编辑</a>
          </template>
        </span>
      </a-table>
    </a-card>
  </page-header-wrapper>
</template>
  <script>
import { STable, Ellipsis } from '@/components'

import {
  // getRoleList,
  getBonusList
} from '@/api/members'
const columns = [
  {
    title: 'ID',
    dataIndex: 'autoid',
    width: 80
  },

  {
    title: '会员',
    dataIndex: 'member'
  },
  {
    title: '级别ID',
    dataIndex: 'gradeId'
  },
  {
    title: '级别',
    dataIndex: 'name'
  },
  {
    title: '领取金额',
    dataIndex: 'usdt'
  },
  {
    title: '领取时间',
    dataIndex: 'writedate'
  },
  {
    title: '备注',
    dataIndex: 'remark'
  }
  //   {
  //     title: '操作',
  //     dataIndex: 'action',
  //     width: 150,
  //     scopedSlots: { customRender: 'action' }
  //   }
]

export default {
  name: 'ConfigList',
  components: {
    STable,
    Ellipsis
  },
  data() {
    return {
      loading: false,
      columns,
      visible: false,
      confirmLoading: false,
      roleMenus: [],
      advanced: false,
      queryParam: {
        key: ''
      },
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
        }
      },
      selectedRowKeys: [],
      selectedRows: []
    }
  },
  created() {
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
      const res = await getBonusList(this.queryParam)
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
  