<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <!-- :model="queryParam" -->
      <a-form
        name="Search"
        layout="inline"
        autocomplete="off"
        style="margin-bottom: 14px"
        @submit="doSearch"
      >
        <a-form-item label="搜索内容">
          <a-input
            v-model="queryParam.key"
            style="width: 240px"
            placeholder="请输入要搜索的内容"
          />
        </a-form-item>
        <a-form-item label="时间">
          <a-date-picker
            v-model="queryParam.startdate"
            @change="startChange"
          />~<a-date-picker v-model="queryParam.enddate" @change="endChange" />
        </a-form-item>
        <a-form-item>
          <a-button
            :disabled="disabledSearch"
            type="primary"
            html-type="submit"
            @click="doSearch"
          >
            查询
          </a-button>
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
        :scroll="{ x: 2000 }"
        bordered
        :columns="columns"
        :data-source="loadData"
        :pagination="pagination"
      >
        <!-- <span slot="serial" slot-scope="text, record, index">
          {{ index + 1 }}
        </span> -->
        <span slot="state" slot-scope="text, record">
          {{
            record.state === "buy"
              ? "已认购"
              : record.state === "sell"
              ? "交易完成"
              : ""
          }}
        </span>

        <span slot="actstate" slot-scope="text, record">
          {{
            record.actstate === "1"
              ? "开启"
              : record.actstate === "0"
              ? "关闭"
              : ""
          }}
        </span>
      </a-table>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { STable, Ellipsis } from "@/components"
import { getActOrderList } from "@/api/activity"

const columns = [
  {
    dataIndex: "id", // autoid → autoId
    title: "ID",
    width: 80
  },
  {
    dataIndex: "coin",
    title: "币种"
  },
  {
    dataIndex: "orderNo", // order_no → orderNo
    title: "交易号",
    width: 120
  },
  {
    dataIndex: "member",
    title: "账号",
    width: 100
  },
  {
    dataIndex: "preIncome", // pre_income → preIncome
    title: "预计收益"
  },
  {
    dataIndex: "curBuyPrice", // cur_buy_price → curBuyPrice
    title: "买入价格"
  },
  {
    dataIndex: "buyNumber", // buy_number → buyNumber
    title: "购买数量"
  },
  {
    dataIndex: "buyPrice", // buy_price → buyPrice
    title: "购买金额"
  },
  {
    dataIndex: "income",
    title: "实际收益"
  },
  {
    dataIndex: "curSellPrice", // cur_sell_price → curSellPrice
    title: "卖出价格"
  },
  {
    dataIndex: "sellNumber", // sell_number → sellNumber
    title: "卖出数量"
  },
  {
    dataIndex: "sellPrice", // sell_price → sellPrice
    title: "卖出金额"
  },
  {
    dataIndex: "h24Range", // h24_range → h24Range
    title: "24H涨幅%"
  },
  {
    dataIndex: "state",
    title: "订单状态",
    scopedSlots: { customRender: "state" }
  },
  {
    dataIndex: "actState", // actstate → actState
    title: "活动状态",
    scopedSlots: { customRender: "actstate" }
  },
  {
    dataIndex: "buyDate", // buy_date → buyDate
    title: "买入时间",
    width: 120
  },
  {
    dataIndex: "sellDate", // sell_date → sellDate
    title: "卖出时间",
    width: 120
  }
]

export default {
  name: "ActOrderList",
  components: {
    STable,
    Ellipsis
    // CreateForm
    // StepByStepModal
  },
  filters: {
    // statusFilter (type) {
    //   return statusMap[type].text
    // },
    // statusTypeFilter (type) {
    //   return statusMap[type].status
    // }
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
        key: "",
        startdate: "",
        enddate: ""
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
          this.queryParam["page"] = page
          this.queryParam["pageSize"] = pageSize
          this.getData()
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
    // rowSelection () {
    //   return {
    //     selectedRowKeys: this.selectedRowKeys,
    //     onChange: this.onSelectChange
    //   }
    // }
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

    doSearch() {
      console.log(this.queryParam)
      this.getData()
    },
    async getData() {
      this.loading = true
      const res = await getActOrderList(this.queryParam)
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
