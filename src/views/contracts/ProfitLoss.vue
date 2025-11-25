<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <!-- :model="queryParam" -->
      <a-form name="Search" layout="inline" autocomplete="off" style="margin-bottom: 14px" @submit="doSearch">
        <a-form-item label="搜索内容">
          <a-input style="width: 240px" v-model="queryParam.key" placeholder="请输入要搜索的内容"> </a-input>
        </a-form-item>
        <a-form-item label="状态">
          <a-select v-model="queryParam.state" style="width: 120px" allowClear>
            <a-select-option :value="item.val" :key="item.val" v-for="item in profitLossStateMapping">{{
              item.title
            }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="方向">
          <a-select v-model="queryParam.type" style="width: 120px" allowClear>
            <a-select-option :value="item.val" :key="item.val" v-for="item in typeMapping">{{
              item.title
            }}</a-select-option>
          </a-select>
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
        :columns="columns"
        :dataSource="loadData"
        :pagination="pagination"
        expandRowByClick
      >
        <span slot="type" slot-scope="text, record">
          {{ record.type | typeMappingFormat }}
        </span>

        <span slot="state" slot-scope="text, record">
          {{ record.state | profitLossStateMappingFormat }}
        </span>
        <span slot="stopLossPrice" slot-scope="text, record">
          {{ record.stopLoss == 'enable' ? record.stopLossPrice : '未开启' }}
        </span>
        <span slot="takeProfitPrice" slot-scope="text, record">
          {{ record.takeProfit == 'enable' ? record.takeProfitPrice : '未开启' }}
        </span>
      </a-table>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { STable, Ellipsis } from '@/components'
import { getContractProfitLoss } from '@/api/contract'
import { styleMapping, typeMapping, profitLossStateMapping } from '@/utils/const'

const columns = [
  {
    title: '订单ID',
    dataIndex: 'orderid',
    width: 80
  },
  {
    dataIndex: 'member',
    title: '账户',
    width: 120
  },
  {
    dataIndex: 'maincoin',
    title: '主币种',
    width: 100
  },
  {
    dataIndex: 'tradcoin',
    title: '交易币种',
    width: 100
  },
  {
    dataIndex: 'number',
    title: '数量(张)',
    width: 100
  },
  {
    dataIndex: 'price',
    title: '价格',
    width: 100
  },
  {
    dataIndex: 'type',
    title: '方向',
    width: 100,
    scopedSlots: { customRender: 'type' }
  },
  {
    dataIndex: 'state',
    title: '状态',
    width: 100,
    scopedSlots: { customRender: 'state' }
  },
  {
    dataIndex: 'stopLossPrice',
    title: '止损价',
    width: 120,
    scopedSlots: { customRender: 'stopLossPrice' }
  },
  {
    dataIndex: 'takeProfitPrice',
    title: '止盈价',
    width: 120,
    scopedSlots: { customRender: 'takeProfitPrice' }
  },
  {
    dataIndex: 'writedate',
    title: '时间',
    width: 120
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
      styleMapping: styleMapping,
      typeMapping: typeMapping,
      profitLossStateMapping: profitLossStateMapping,
      // 加载数据方法 必须为 Promise 对象
      loadData: [],
      totallyData: { totalFess: '0', totalGas: '0', totalOnProfit: '0', totalPosition: '0', totalUnProfit: '0' },
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
    startChange(date, dateString) {
      this.queryParam.startdate = dateString
    },
    endChange(date, dateString) {
      this.queryParam.enddate = dateString
    },
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
    handleCancel() {
      this.visible = false
      this.confirmLoading = false
      const form = this.$refs.createModal.form
      form.resetFields() // 清理表单数据（可不做）
      this.roleMenus = []
    },

    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    doSearch() {
      this.getData()
    },
    async getData() {
      this.loading = true

      const res = await getContractProfitLoss(this.queryParam)
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
