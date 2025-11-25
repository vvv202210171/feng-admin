<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <!-- :model="queryParam" -->
      <a-form name="Search" layout="inline" autocomplete="off" style="margin-bottom: 14px" @submit="doSearch">
        <a-form-item label="搜索内容">
          <a-input style="width: 240px" v-model="queryParam.key" placeholder="请输入要搜索的内容"> </a-input>
        </a-form-item>
        <a-form-item label="异常类型">
          <a-select v-model="queryParam.exType" style="width: 120px" allowClear>
            <a-select-option value="">全部</a-select-option>
            <a-select-option value="web">web</a-select-option>
            <a-select-option value="admin">后台</a-select-option>
            <a-select-option value="schedule">定时任务</a-select-option>
            <a-select-option value="kline">kline</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="时间">
          <QuickTime @change="changeDate"></QuickTime>
        </a-form-item>
        <a-form-item>
          <a-button htmlType="submit" :disabled="disabledSearch" type="primary" @click="doSearch">查询</a-button>
        </a-form-item>
      </a-form>
      <a-table
        ref="table"
        size="small"
        row-key="autoid"
        :loading="loading"
        :scroll="{ x: 980 }"
        :columns="columns"
        :dataSource="loadData"
        :pagination="pagination"
      >
        <p slot="expandedRowRender" slot-scope="record" style="margin: 0">
          <a-card title="详情">
            <a-card-grid v-for="(key, index) in columns2" :key="index" style="width: 100%">
              <span>{{ key.title }}</span
              >:
              <span v-html="formatContent(record[key.dataIndex])"></span>
            </a-card-grid>
          </a-card>
        </p>
      </a-table>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { STable, Ellipsis } from '@/components'

import {
  // getRoleList,
  getExLogList
} from '@/api/log'
const columns = [
  {
    title: 'ID',
    dataIndex: 'autoid',
    width: 80
  },
  {
    dataIndex: 'exType',
    title: '异常类型',
    width: 120
  },
  {
    dataIndex: 'url',
    title: 'url',
    width: 120
  },
  {
    dataIndex: 'writedate',
    title: '时间',
    width: 120
  }
]
const columns2 = [
  {
    dataIndex: 'content',
    title: '内容'
  }
]
export default {
  name: 'TradOrderList',
  components: {
    STable,
    Ellipsis
    // CreateForm
    // StepByStepModal
  },
  data() {
    return {
      loading: false,
      columns,
      columns2,
      // create model
      visible: false,
      confirmLoading: false,
      mdl: null,
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
          this.getData()
        }
      },
      selectedRowKeys: [],
      selectedRows: []
    }
  },
  filters: {},
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
    doSearch() {
      this.getData()
    },
    formatContent(content) {
      if (content) {
        // 将 \r\n 或 \n 替换为 <br>
        return content.replace(/(?:\r\n|\r|\n)/g, '<br>')
      }
      return content
    },
    changeDate(data) {
      this.queryParam.startdate = data[0]
      this.queryParam.enddate = data[1]
    },
    async getData() {
      this.loading = true
      this.queryParam.page = this.pagination.current
      this.queryParam.limit = this.pagination.pageSize
      const res = await getExLogList(this.queryParam)
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
