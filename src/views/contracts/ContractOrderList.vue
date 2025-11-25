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
        <a-form-item label="状态">
          <a-select v-model="queryParam.state" style="width: 120px" allowClear>
            <a-select-option :value="item.val" :key="item.val" v-for="item in contractStateMapping">{{
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
        <a-form-item label="方式">
          <a-select v-model="queryParam.style" style="width: 120px" allowClear>
            <a-select-option :value="item.val" :key="item.val" v-for="item in styleMapping">{{
              item.title
            }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="模式">
          <a-select v-model="queryParam.tdMode" style="width: 120px" allowClear>
            <a-select-option :value="item.val" :key="item.val" v-for="item in tdModeMapping">{{
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

      <!-- <span>已盈亏总额</span>:{{ totallyData.totalGas }} -->
      <div style="display: flex">
        <a-statistic title="已盈亏总额" :value="totallyData.totalOnProfit" :precision="4" style="margin-right: 50px" />
        <a-statistic
          title="未实现盈亏总额"
          :value="totallyData.totalUnProfit"
          :precision="4"
          style="margin-right: 50px"
        />
        <a-statistic title="手续费" :value="totallyData.totalFess" :precision="4" style="margin-right: 50px" />
        <a-statistic title="仓息" :value="totallyData.totalPosition" style="margin-right: 50px" />
        <a-statistic title="累计手续费" :value="totallyData.totalGas" :precision="4" style="margin-right: 50px" />
      </div>
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
        <!-- :rowSelection="rowSelection" -->

        <span slot="type" slot-scope="text, record">
          {{ record.type | typeMappingFormat }}
        </span>

        <span slot="style" slot-scope="text, record">
          {{ record.style | styleMappingFormat }}
        </span>

        <span slot="state" slot-scope="text, record">
          {{ record.state | contractStateMappingFormat }}
        </span>

        <span slot="td_mode" slot-scope="text, record">
          {{ record.td_mode | tdModeMappingFormat }}
        </span>
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
                {{ record.type | typeMappingFormat }}
              </span>

              <span v-else-if="key.dataIndex == 'style'">
                {{ record.style | styleMappingFormat }}
              </span>

              <span v-else-if="key.dataIndex == 'state'">
                {{ record.state | contractStateMappingFormat }}
              </span>

              <span v-else-if="key.dataIndex == 'td_mode'">
                {{ record.td_mode | tdModeMappingFormat }}
              </span>
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
  getContractOrderList
} from '@/api/contract'
import { styleMapping, typeMapping, contractStateMapping, tdModeMapping } from '@/utils/const'

const columns = [
  {
    title: 'ID',
    dataIndex: 'autoid',
    width: 80
  },
  {
    dataIndex: 'member',
    title: '账户',
    width: 120
  },
  {
    dataIndex: 'parent',
    title: '代理',
    width: 120
  },
  {
    dataIndex: 'tel',
    title: '手机',
    align: 'center',
    width: 150
  },
  {
    dataIndex: 'email',
    title: '邮箱',
    align: 'center',
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
    title: '数量(张)',
    width: 100
  },
  {
    dataIndex: 'price',
    title: '价格',
    width: 100
  },
  {
    dataIndex: 'td_mode',
    title: '模式',
    width: 100,
    scopedSlots: { customRender: 'td_mode' }
  },
  {
    dataIndex: 'type',
    title: '方向',
    width: 100,
    scopedSlots: { customRender: 'type' }
  },
  {
    dataIndex: 'style',
    title: '方式',
    width: 100,
    scopedSlots: { customRender: 'style' }
  },
  {
    dataIndex: 'gas',
    title: '手续费',
    width: 120
  },
  {
    dataIndex: 'lever',
    title: '杠杆倍数',
    width: 100
  },
  {
    dataIndex: 'point',
    title: '预估强平价',
    width: 120
  },
  {
    dataIndex: 'profit',
    title: '仓位保证金',
    width: 120
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
    title: 'ID',
    dataIndex: 'autoid',
    width: 80
  },
  {
    dataIndex: 'member',
    title: '账户',
    width: 120
  },
  {
    dataIndex: 'tel',
    title: '手机',
    align: 'center',
    width: 150
  },
  {
    dataIndex: 'email',
    title: '邮箱',
    align: 'center',
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
    title: '数量(张)',
    width: 100
  },
  {
    dataIndex: 'price',
    title: '价格',
    width: 100
  },
  {
    dataIndex: 'td_mode',
    title: '模式',
    width: 100,
    scopedSlots: { customRender: 'td_mode' }
  },
  {
    dataIndex: 'type',
    title: '方向',
    width: 100,
    scopedSlots: { customRender: 'type' }
  },
  {
    dataIndex: 'style',
    title: '方式',
    width: 100,
    scopedSlots: { customRender: 'style' }
  },
  {
    dataIndex: 'gas',
    title: '手续费',
    width: 120
  },
  {
    dataIndex: 'lever',
    title: '杠杆倍数',
    width: 100
  },
  {
    dataIndex: 'point',
    title: '预估强平价',
    width: 120
  },
  {
    dataIndex: 'profit',
    title: '仓位保证金',
    width: 120
  },
  {
    dataIndex: 'state',
    title: '状态',
    width: 100,
    scopedSlots: { customRender: 'state' }
  },
  {
    dataIndex: 'fess',
    title: '仓位资金利息',
    width: 120
  },
  {
    dataIndex: 'last_profit',
    title: '实际平仓价格',
    width: 120
  },
  {
    dataIndex: 'on_income',
    title: '已实现盈亏',
    width: 120
  },
  {
    dataIndex: 'writedate',
    title: '开仓时间',
    width: 180
  },
  {
    dataIndex: 'closedate',
    title: '平仓时间',
    width: 180
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
        page: 1,
        limit: 20
      },
      styleMapping: styleMapping,
      typeMapping: typeMapping,
      contractStateMapping: contractStateMapping,
      tdModeMapping: tdModeMapping,
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

      const res = await getContractOrderList(this.queryParam)
      const { code, data } = res
      if (code === 0) {
        const datas = data.pages
        const statictics = data.statictics
        if (!statictics) {
          this.totallyData = {
            totalFess: '0',
            totalGas: '0',
            totalOnProfit: '0',
            totalPosition: '0',
            totalUnProfit: '0'
          }
        } else {
          this.totallyData = statictics
        }
        this.loadData = datas.records
        this.pagination.total = datas.total
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
