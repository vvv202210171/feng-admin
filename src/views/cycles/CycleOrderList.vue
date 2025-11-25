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
        <a-form-item label="方向">
          <a-select style="width: 100px" v-model="queryParam.type">
            <a-select-option value=""> 请选择 </a-select-option>
            <a-select-option value="buy"> 开多 </a-select-option>
            <a-select-option value="sell"> 开空 </a-select-option>
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

      <div style="display: flex">
        <a-statistic title="已实现盈亏" :value="totallyData.totalProfit" :precision="4" style="margin-right: 50px" />
        <a-statistic title="手续费" :value="totallyData.totalGas" :precision="4" style="margin-right: 50px" />
      </div>
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
        expandRowByClick
      >
        <span slot="type" slot-scope="text, record">
          {{ record.type === 'buy' ? '开多' : record.type === 'sell' ? '开空' : record.type }}
        </span>

        <span slot="standrad" slot-scope="text, record">
          {{ record.standrad === 'enable' ? '重仓' : '标准仓' }}
        </span>

        <span slot="state" slot-scope="text, record">
          {{
            record.state === 'enable'
              ? '持仓中'
              : record.state === 'end'
              ? '强制平仓'
              : record.state === 'out'
              ? '手动平仓'
              : record.state
          }}
        </span>

        <template slot="cycle_state" slot-scope="text, record">
          <span :class="record.cycle_state">{{ record.cycle_state | cycleStateFormat }}</span>
        </template>
        <!-- <span slot="action" slot-scope="text, record">
          <template>
            <a @click="handleEdit(record)">编辑</a>
            <a-divider type="vertical" />
            <a @click="handleDel(record)">删除</a>
          </template>
        </span> -->
        <p slot="expandedRowRender" slot-scope="record" style="margin: 0">
          <a-card title="详情">
            <a-card-grid style="width: 25%" v-for="(key, index) in columns2" :key="index">
              <span>{{ key.title }}</span
              >:
              <span v-if="key.dataIndex == 'type'">
                {{ record.type === 'buy' ? '开多' : record.type === 'sell' ? '开空' : record.type }}
              </span>
              <span v-else-if="key.dataIndex == 'standrad'">
                {{ record.standrad === 'enable' ? '重仓' : '标准仓' }}
              </span>
              <span v-else-if="key.dataIndex == 'state'">
                {{
                  record.state === 'enable'
                    ? '持仓中'
                    : record.state === 'end'
                    ? '强制平仓'
                    : record.state === 'out'
                    ? '手动平仓'
                    : record.state
                }}
              </span>
              <span v-else-if="key.dataIndex == 'cycle_state'" :class="record.cycle_state">{{
                record.cycle_state | cycleStateFormat
              }}</span>
              <template v-else>
                <span>{{ record[key.dataIndex] }}</span>
              </template>
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
  getCycleOrderList
} from '@/api/cycle'

const columns = [
  {
    dataIndex: 'autoid',
    title: 'ID',
    width: 100
  },
  {
    dataIndex: 'member',
    title: '账户',
    width: 120
  },
  {
    dataIndex: 'parent',
    title: '代理',
    width: 100
  },
  {
    dataIndex: 'tel',
    title: '手机',
    width: 150
  },
  {
    dataIndex: 'email',
    title: '邮箱',
    width: 150
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
    title: '数量',
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
    dataIndex: 'paycoin',
    title: '支付币种',
    width: 100
  },
  {
    dataIndex: 'gas',
    title: '手续费',
    width: 100
  },
  {
    dataIndex: 'lever',
    title: '交易周期',
    width: 100
  },
  {
    dataIndex: 'profit',
    title: '仓位保证金',
    width: 100
  },
  {
    dataIndex: 'standrad',
    title: '仓位标准',
    width: 100,
    scopedSlots: { customRender: 'standrad' }
  },
  {
    dataIndex: 'today_order_id',
    title: '单数',
    width: 100
  },
  {
    dataIndex: 'state',
    title: '状态',
    width: 100,
    scopedSlots: { customRender: 'state' }
  }
]
const columns2 = [
  {
    dataIndex: 'autoid',
    title: 'ID',
    width: 100
  },
  {
    dataIndex: 'member',
    title: '账户',
    width: 120
  },
  {
    dataIndex: 'tel',
    title: '手机',
    width: 150
  },
  {
    dataIndex: 'email',
    title: '邮箱',
    width: 150
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
    title: '数量',
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
    // ,templet:function(d){
    //   if(d.type == "buy"){
    //       return '买入';
    //   }else if(d.type == "sell"){
    //       return "卖出";
    //   }
  },
  {
    dataIndex: 'paycoin',
    title: '支付币种',
    width: 100
  },
  {
    dataIndex: 'gas',
    title: '手续费',
    width: 100
  },
  {
    dataIndex: 'lever',
    title: '交易周期',
    width: 100
  },
  {
    dataIndex: 'profit',
    title: '仓位保证金',
    width: 100
  },
  {
    dataIndex: 'standrad',
    title: '仓位标准',
    width: 100,
    scopedSlots: { customRender: 'standrad' }
    // ,templet:function(d){
    //   if(d.standrad == "enable"){
    //       return '重仓';
    //   }else if(d.standrad == "disable"){
    //       return "标准仓";
    //   }
  },
  {
    dataIndex: 'today_order_id',
    title: '单数',
    width: 100
  },
  {
    dataIndex: 'state',
    title: '状态',
    width: 100,
    scopedSlots: { customRender: 'state' }
    // ,templet:function(d){
    //   if(d.state == "enable"){
    //       return '持仓中';
    //   }else if(d.state == "end"){
    //       return "强制平仓";
    //   }else if(d.state == "out"){
    //       return "手动平仓";
    //   }
  },
  {
    dataIndex: 'last_profit',
    title: '平仓价格',
    width: 120
  },
  {
    dataIndex: 'income',
    title: '盈亏金额',
    width: 120
  },
  {
    dataIndex: 'cycle_state',
    title: '周期状态',
    width: 80,
    scopedSlots: { customRender: 'cycle_state' }
  },
  {
    dataIndex: 'writedate',
    title: '下单时间',
    width: 170
  },
  {
    dataIndex: 'closedate',
    title: '平仓时间',
    width: 170
  }
]
export default {
  name: 'CycleOrderList',
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
      columns2,
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
        type: '',
        startdate: '',
        enddate: '',
        page: 1,
        limit: 20
      },
      // 加载数据方法 必须为 Promise 对象
      loadData: [],
      totallyData: { totalGas: '0', totalProfit: '0' },
      pagination: {
        total: 0,
        current: 1,
        pageSize: 20,
        onChange: (page, pageSize) => {
          this.pagination.current = page
          if (pageSize !== this.pagination.pageSize) {
            this.pagination.pageSize = pageSize
          }
          this.queryParam.page = page
          this.queryParam.limit = pageSize

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
      this.queryParam.page = 1
      console.log(this.queryParam)
      this.getData()
    },
    async getData() {
      this.loading = true
      const res = await getCycleOrderList(this.queryParam)
      const { code, data } = res
      if (code === 0) {
        this.loadData = data.pages.records
        this.pagination.total = data.pages.total
        this.totallyData = data.statictics
          ? data.statictics
          : {
              totalGas: '0',
              totalProfit: '0'
            }
      }
      setTimeout(() => {
        this.loading = false
      }, 800)
    }
  }
}
</script>
