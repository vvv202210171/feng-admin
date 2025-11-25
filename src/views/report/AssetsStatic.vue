<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <a-form name="Search" layout="inline" autocomplete="off" style="margin-bottom: 14px" @submit="doSearch">
        <a-form-item label="搜索内容">
          <a-input style="width: 240px" v-model="key" placeholder="请输入要搜索的内容"> </a-input>
        </a-form-item>

        <a-form-item>
          <a-button html-type="submit" :disabled="disabledSearch" type="primary" @click="doSearch"> 查询 </a-button>
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
        :pagination="pagination"
        :data-source="loadData"
      >
      </a-table>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { STable, Ellipsis } from '@/components'
import {
  // getRoleList,
  getAsstesStatic
} from '@/api/report'
import { exportExcel } from '@/utils/util'
const columns = [
  {
    title: '币种',
    dataIndex: 'coin'
  },
  {
    title: '总可用资产',
    dataIndex: 'allUsable'
  },
  {
    title: '总持仓资产',
    dataIndex: 'allDisable'
  },
  {
    title: '货币可用资产',
    dataIndex: 'usable'
  },
  {
    title: '货币持仓资产',
    dataIndex: 'disable'
  },
  {
    title: '合约可用资产',
    dataIndex: 'contractUsable'
  },
  {
    title: '合约持仓资产',
    dataIndex: 'contractDisable'
  }
]

export default {
  name: 'CoinInList',
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
      mdl: null,
      roleMenus: [],
      // 高级搜索 展开/关闭
      advanced: false,
      key: '',
      tableData: [],
      // 加载数据方法 必须为 Promise 对象
      loadData: [],
      pagination: {
        current: 1,
        total: 0,
        pageSize: 30,
        onChange: (page, pageSize) => {
          this.pagination.current = page
          if (pageSize !== this.pagination.pageSize) {
            this.pagination.pageSize = pageSize
          }
          this.splitPage()
          // console.log(page, pageSize)
        }
      },
      selectedRowKeys: [],
      selectedRows: []
    }
  },
  computed: {
    // 搜索状态
    disabledSearch() {
      return this.loading
    }
  },
  created() {
    // getRoleList({ t: new Date() })
    this.getData()
  },
  methods: {
    handleAdd() {
      // get menu data
      this.roleMenus = []
      this.mdl = null
      this.visible = true
    },
    handleEdit(record) {
      // get menu data
      this.roleMenus = []
      this.visible = true
      this.mdl = { ...record }
    },

    doSearch() {
      this.pagination.current = 1
      this.getData()
    },
    splitPage() {
      const data = this.key ? this.tableData.filter((v) => v.coin.indexOf(this.key) !== -1) : this.tableData

      this.pagination.total = data.length
      const page = this.pagination.current
      const pageSize = this.pagination.pageSize

      // Calculate start and end indices for slicing
      const startIndex = (page - 1) * pageSize
      const endIndex = startIndex + pageSize

      // Slice the data array to get only the current page data
      const paginatedData = data.slice(startIndex, endIndex)

      // You might want to set this to some data property for rendering
      this.loadData = paginatedData
    },
    doExport() {
      exportExcel(this.tableData, this.columns, this.$route.meta?.title || '报表')
    },
    async getData() {
      this.loading = true
      const res = await getAsstesStatic(this.queryParam)
      const { code, data } = res
      if (code === 0) {
        this.tableData = data
        this.splitPage()
      }
      setTimeout(() => {
        this.loading = false
      }, 800)
    }
  }
}
</script>
