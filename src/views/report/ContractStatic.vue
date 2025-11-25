<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <!-- :model="queryParam" -->
      <a-form name="Search" layout="inline" autocomplete="off" style="margin-bottom: 14px" @submit="doSearch">
        <a-form-item label="方向">
          <a-select v-model="queryParam.type" style="width: 120px" allowClear>
            <a-select-option value="buy">买多</a-select-option>
            <a-select-option value="sell">买少</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="方式">
          <a-select v-model="queryParam.style" style="width: 120px" allowClear>
            <a-select-option value="limit">限价</a-select-option>
            <a-select-option value="market">市价</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="模式">
          <a-select v-model="queryParam.tdMode" style="width: 120px" allowClear>
            <a-select-option value="cross">全仓</a-select-option>
            <a-select-option value="lsolate">逐仓</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="时间">
          <QuickTime @change="changeDate"></QuickTime>
        </a-form-item>
        <a-form-item>
          <a-button htmlType="submit" :disabled="disabledSearch" type="primary" @click="doSearch">查询</a-button>
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
        @change="handleTableChange"
      >
      </a-table>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { STable, Ellipsis } from '@/components'
import {
  // getRoleList,
  getContractStatic
} from '@/api/report'
import { exportExcel } from '@/utils/util'

const columns = [
  {
    title: '主币',
    dataIndex: 'maincoin'
  },
  {
    title: '交易币',
    dataIndex: 'tradcoin'
  },
  {
    title: '订单数',
    dataIndex: 'totalOrder',
    sorter: true
  },
  {
    title: '交易数目',
    dataIndex: 'number',
    sorter: true
  },
  {
    title: '保证金',
    dataIndex: 'profit',
    sorter: true
  },
  {
    title: '收益',
    dataIndex: 'income',
    sorter: true
  },
  {
    title: '手续费',
    dataIndex: 'gas',
    sorter: true
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
      queryParam: {},
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
    changeDate(data) {
      this.queryParam.startdate = data[0]
      this.queryParam.enddate = data[1]
    },
    doSearch() {
      this.pagination.current = 1
      this.getData()
    },
    doExport() {
      exportExcel(this.tableData, this.columns, this.$route.meta?.title || '报表')
    },
    handleTableChange(pagination, filters, sorter) {
      // 处理排序
      if (sorter && sorter.order) {
        const asc = sorter.order === 'ascend'
        this.tableData.sort((a, b) => {
          const field = sorter.field
          // 简单数字排序；如果是字符串可以加 localeCompare
          return asc ? a[field] - b[field] : b[field] - a[field]
        })
      } else {
        // 取消排序恢复原顺序（如果想恢复初始顺序，可以保留一份原数据备份）
      }

      // 更新分页状态
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize

      // 重新切分页
      this.splitPage()
    },

    splitPage() {
      const data = this.key ? this.tableData.filter((v) => v.coin.indexOf(this.key) !== -1) : this.tableData
      this.pagination.total = data.length
      const startIndex = (this.pagination.current - 1) * this.pagination.pageSize
      const endIndex = startIndex + this.pagination.pageSize

      this.loadData = data.slice(startIndex, endIndex)
    },
    async getData() {
      this.loading = true
      const res = await getContractStatic(this.queryParam)
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
