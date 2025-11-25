<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <!-- :model="queryParam" -->
      <a-form name="Search" layout="inline" autocomplete="off" style="margin-bottom: 14px" @submit="doSearch">
        <a-form-item label="搜索内容">
          <a-input style="width: 240px" v-model="queryParam.key" placeholder="请输入要搜索的内容"> </a-input>
        </a-form-item>
        <a-form-item label="状态">
          <a-select v-model="queryParam.state" style="width: 120px" allow-clear>
            <a-select-option :value="item.code" v-for="item in orderStatus" :key="item.code">
              {{ item.desc }}
            </a-select-option>
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

      <!-- <div class="table-operator">
          <a-button type="primary" icon="plus" @click="handleAdd">新建配置</a-button>
        </div> -->

      <a-table
        ref="table"
        size="default"
        row-key="autoid"
        :loading="loading"
        :scroll="{ x: 1500 }"
        bordered
        :columns="columns"
        :dataSource="loadData"
        :pagination="pagination"
      >
        <template slot="state" slot-scope="text, record">
          <span>{{ getStateDesc(record) }}</span>
        </template>
        <!-- <span slot="action" slot-scope="text, record">
          <template>
            <a @click="handleEdit('data_success', record)" :disabled="!$verify('112022')">通过</a>
            <a-divider type="vertical" />
            <a @click="handleEdit('data_reject', record)" :disabled="!$verify('112022')" style="color: red">拒绝</a>
              <a @click="handleDel(record)">删除</a> 
          </template>
        </span> -->
        <p slot="expandedRowRender" slot-scope="record" style="margin: 0">
          <a-card title="详情">
            <a-card-grid style="width: 100%">
              <span>理财配置编号：</span>
              <span>{{ record.minId }}</span>
              <a-icon type="copy" @click="copy(record.addr)" />
            </a-card-grid>
            <a-card-grid style="width: 100%">
              <span>更新时间：</span>
              <span>{{ record.lastDate }}</span>
            </a-card-grid>
            <a-card-grid style="width: 100%">
              <span>到期时间：</span>
              <span>{{ record.enddate }}</span>
            </a-card-grid>
          </a-card>
        </p>
      </a-table>
    </a-card>
  </page-header-wrapper>
</template>
  
  <script>
import { STable, Ellipsis } from '@/components'
import { getOrderVipFundsList } from '@/api/funds'

const columns = [
  { dataIndex: 'ticketNo', title: '订单号', width: 120 },
  { dataIndex: 'member', title: '账号', width: 120 },
  { dataIndex: 'name', title: '理财配置名称', width: 150 },
  { dataIndex: 'payCoin', title: '支付币种', width: 100 },
  { dataIndex: 'outCoin', title: '产出币种', width: 100 },
  { dataIndex: 'payNumber', title: '投资数目', width: 120 },
  {
    dataIndex: 'state',
    title: '状态',
    width: 100,
    scopedSlots: { customRender: 'state' }
  },
  { dataIndex: 'cycle', title: '运行周期(天)', width: 120 },
  { dataIndex: 'onCycle', title: '已运行天数', width: 120 },
  { dataIndex: 'todayIncome', title: '今日收益', width: 120 },
  { dataIndex: 'income', title: '累计收益', width: 120 },
  { dataIndex: 'withdrawNum', title: '提走金额', width: 120 },
  { dataIndex: 'writedate', title: '创建时间', width: 160 }
]

export default {
  name: 'CoinOutList',
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
      confirmLoading: false,
      // 高级搜索 展开/关闭
      advanced: false,
      orderStatus: [],
      // // 搜索状态
      // disabledSearch: false,
      // 查询参数
      queryParam: {
        key: '',
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

  async created() {
    this.orderStatus = this.enums['VipOrderStatusEnum']
    this.getData()
  },
  computed: {
    // 搜索状态
    disabledSearch() {
      return this.loading
    }
  },
  methods: {
    getStateDesc(record) {
      return this.getDesc('VipOrderStatusEnum', record.state)
    },

    copy(iconName) {
      navigator.clipboard
        .writeText(iconName)
        .then(() => {
          this.$message.success(`${iconName} 已复制`)
        })
        .catch(() => {
          this.$message.error('复制失败')
        })
    },

    startChange(date, dateString) {
      this.queryParam.startdate = dateString
    },
    endChange(date, dateString) {
      this.queryParam.enddate = dateString
    },
    doSearch() {
      this.getData()
    },
    async getData() {
      this.loading = true

      const res = await getOrderVipFundsList(this.queryParam)
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
  