<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <!-- :model="queryParam" -->
      <a-form name="Search" layout="inline" autocomplete="off" style="margin-bottom: 14px" @submit="getData">
        <!-- <a-form-item label="搜索内容">
          <a-input style="width: 240px;" v-model="queryParam.key" placeholder="请输入要搜索的内容">
          </a-input>
        </a-form-item> -->
        <a-form-item label="类型">
          <a-select default-value="按日" style="width: 120px" v-model="queryParam.type">
            <a-select-option value="%Y-%m-%d"> 按日 </a-select-option>
            <a-select-option value="%Y-%m"> 按月 </a-select-option>
            <a-select-option value="%Y"> 按年 </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-button htmlType="submit" :disabled="disabledSearch" type="primary" @click="getData">查询</a-button>
        </a-form-item>
        <a-form-item style="float: right">
          <a-button type="primary" @click="doExport" icon="export"> 导出 </a-button>
        </a-form-item>
      </a-form>

      <a-table
        ref="table"
        size="default"
        :row-key="
          (record, inx) => {
            return inx
          }
        "
        :loading="loading"
        :scroll="{ x: 980 }"
        bordered
        :columns="columns"
        :dataSource="loadData"
        :pagination="pagination"
      >
      </a-table>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { STable, Ellipsis } from '@/components'
import {
  // getRoleList,
  getCoinOutList
} from '@/api/assethub'
import { exportExcel } from '@/utils/util'

const columns = [
  {
    title: '时间',
    dataIndex: 'writedate'
  },
  {
    title: '币种',
    dataIndex: 'coin'
  },
  {
    title: '数量',
    dataIndex: 'account'
  }
]

export default {
  name: 'Useraccount',
  components: {
    STable,
    Ellipsis
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
        type: '%Y-%m-%d'
      },
      pageData: [],
      loadData: [],
      pagination: {
        total: 0,
        current: 1,
        pageSize: 15,
        onChange: (page, pageSize) => {
          this.pagination.current = page
          if (pageSize !== this.pagination.pageSize) {
            this.pagination.pageSize = pageSize
          }

          this.splitPage()
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
    }
  },
  methods: {
    splitPage() {
      const { current, pageSize } = this.pagination
      let start = (current - 1) * pageSize
      let end = current * pageSize
      this.loadData = this.pageData.slice(start, end)
    },
    doExport() {
      exportExcel(this.pageData, this.columns, this.$route.meta?.title || '报表')
    },
    async getData() {
      this.loading = true

      const res = await getCoinOutList(this.queryParam)
      const { code, data } = res
      if (code === 0) {
        this.pagination.total = data.length
        this.pageData = data
        this.pagination.current = 1
        this.pagination.pageSize = 15
        this.splitPage()
      } else {
      }
      setTimeout(() => {
        this.loading = false
      }, 800)
    }
  }
}
</script>
