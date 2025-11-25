<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <!-- :model="queryParam" -->
      <a-form name="Search" layout="inline" autocomplete="off" style="margin-bottom: 14px" @submit="doSearch">
        <a-form-item label="搜索内容">
          <a-input v-model="queryParam.key" style="width: 240px" placeholder="请输入要搜索的内容" />
        </a-form-item>
        <a-form-item>
          <a-button html-type="submit" :disabled="disabledSearch" type="primary" @click="doSearch"> 查询 </a-button>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" icon="plus" :disabled="!$verify('109012')" @click="handleAdd"> 新建 </a-button>
        </a-form-item>
      </a-form>

      <a-table
        ref="table"
        size="default"
        row-key="autoid"
        :loading="loading"
        :scroll="{ x: 980 }"
        bordered
        :columns="columns"
        :data-source="loadData"
        :pagination="pagination"
        expand-row-by-click
      >
        <template slot="state" slot-scope="text, record">
          <span v-if="record.state === 'enable'">正在交易</span>
          <span v-if="record.state === 'disable'" style="color: #eb1345">已下架</span>
          <span v-if="record.state === 'ready'">即将交易</span>
        </template>

        <template slot="plate" slot-scope="text, record">
          <span v-if="record.plate === 'main'">主板</span>
          <span v-if="record.plate === 'pioneer'">创业板</span>
        </template>

        <template slot="robot" slot-scope="text, record">
          <span v-if="record.robot === 'disable'">禁用</span>
          <span v-if="record.robot === 'enable'">启用</span>
        </template>

        <template slot="mainMarket" slot-scope="text, record">
          <span v-if="record.mainMarket === 'enable'">是</span>
          <span v-else-if="record.mainMarket === 'disable'">否</span>
        </template>

        <template slot="mainMarket" slot-scope="text, record">
          <span v-if="record.mainMarket === 'enable'">启用</span>
          <span v-else-if="record.mainMarket === 'disable'">禁用</span>
        </template>

        <template slot="marketcontrl" slot-scope="text, record">
          <span v-if="record.marketcontrl === 'Y'">启用</span>
          <span v-else-if="record.marketcontrl === 'N'">禁用</span>
        </template>

        <span slot="action" slot-scope="text, record">
          <template>
            <a :disabled="!$verify('109013')" @click="handleEdit(record)">编辑</a>
            <a-divider type="vertical" />
            <a :disabled="!$verify('109011')" @click="handleDel(record)">删除</a>
            <a-divider v-if="record.mainMarket !== 'enable'" type="vertical" />
            <a v-if="record.mainMarket !== 'enable'" @click="toStray(record)">策略</a>
            <a-divider v-if="record.mainMarket !== 'enable'" type="vertical" />
            <a v-if="record.mainMarket !== 'enable'" @click="toControl(record)">行情价控制</a>
          </template>
        </span>
        <p slot="expandedRowRender" slot-scope="record" style="margin: 0">
          <a-card title="详情">
            <a-card-grid v-for="(key, index) in columns2" :key="index" style="width: 25%">
              <span>{{ key.title }}</span
              >:
              <template v-if="key.dataIndex == 'state'">
                <span v-if="record.state === 'enable'">正在交易</span>
                <span v-if="record.state === 'disable'" style="color: #eb1345">已下架</span>
                <span v-if="record.state === 'ready'">即将交易</span>
              </template>

              <template v-else-if="key.dataIndex == 'plate'">
                <span v-if="record.plate === 'main'">主板</span>
                <span v-if="record.plate === 'pioneer'">创业板</span>
              </template>

              <template v-else-if="key.dataIndex == 'robot'">
                <span v-if="record.robot === 'disable'">禁用</span>
                <span v-if="record.robot === 'enable'">启用</span>
              </template>

              <template v-else-if="key.dataIndex == 'mainMarket'">
                <span v-if="record.mainMarket === 'enable'">是</span>
                <span v-else-if="record.mainMarket === 'disable'">否</span>
              </template>

              <template v-else-if="key.dataIndex == 'marketcontrl'">
                <span v-if="record.marketcontrl === 'Y'">启用</span>
                <span v-else-if="record.marketcontrl === 'N'">禁用</span>
              </template>

              <template v-else>
                <span>{{ record[key.dataIndex] }}</span>
              </template>
            </a-card-grid>
          </a-card>
        </p>
      </a-table>

      <s-modal
        ref="createModal"
        :config="modalConfig"
        :visible="visible"
        :loading="confirmLoading"
        :options="modalOptions"
        :model="mdl"
        @cancel="handleCancel"
        @ok="handleOk"
      />
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { STable, Ellipsis, SModal } from '@/components'
import {
  // getRoleList,
  getContractCoinList,
  delContractCoin,
  addContractCoin,
  editContractCoin
} from '@/api/contract'
import { Modal } from 'ant-design-vue'

// import StepByStepModal from './modules/StepByStepModal'
// import CreateForm from './modules/ContractCoinForm'

const columns = [
  {
    title: 'ID',
    dataIndex: 'autoid',
    width: 80
  },
  {
    dataIndex: 'tradcoin',
    title: '交易币种',
    width: 90
  },
  {
    dataIndex: 'maincoin',
    title: '主币种',
    width: 80
  },
  {
    dataIndex: 'gas',
    title: '手续费',
    width: 80
  },
  {
    dataIndex: 'height',
    title: '最高价',
    width: 100
  },
  {
    dataIndex: 'low',
    title: '最低价',
    width: 100
  },
  {
    dataIndex: 'price',
    title: '最新价',
    width: 100
  },
  {
    dataIndex: 'volume',
    title: '成交量',
    width: 150
  },
  {
    dataIndex: 'cny',
    title: 'CNY',
    width: 80
  },
  {
    dataIndex: 'rise',
    title: '涨跌幅',
    width: 80
  },
  {
    dataIndex: 'priceAccuracy',
    title: '价格精度',
    width: 80
  },
  {
    dataIndex: 'amountAccuracy',
    title: '数量精度',
    width: 80
  },
  {
    dataIndex: 'plate',
    title: '交易区',
    width: 80,
    scopedSlots: { customRender: 'plate' }
  },
  {
    dataIndex: 'state',
    title: '状态',
    width: 100,
    scopedSlots: { customRender: 'state' }
  },
  {
    dataIndex: 'robot',
    title: '机器人',
    width: 80,
    scopedSlots: { customRender: 'robot' }
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: 160,

    scopedSlots: { customRender: 'action' }
  }
]
const columns2 = [
  {
    title: 'ID',
    dataIndex: 'autoid',
    width: 80
  },
  {
    dataIndex: 'tradcoin',
    title: '交易币种',
    width: 90
  },
  {
    dataIndex: 'maincoin',
    title: '主币种',
    width: 80
  },
  {
    dataIndex: 'gas',
    title: '手续费',
    width: 80
  },
  {
    dataIndex: 'height',
    title: '最高价',
    width: 100
  },
  {
    dataIndex: 'low',
    title: '最低价',
    width: 100
  },
  {
    dataIndex: 'price',
    title: '最新价',
    width: 100
  },
  {
    dataIndex: 'volume',
    title: '成交量',
    width: 150
  },
  {
    dataIndex: 'cny',
    title: 'CNY',
    width: 100
  },
  {
    dataIndex: 'rise',
    title: '涨跌幅',
    width: 100
  },
  {
    dataIndex: 'priceAccuracy',
    title: '价格精度',
    width: 90
  },
  {
    dataIndex: 'amountAccuracy',
    title: '数量精度',
    width: 90
  },
  {
    dataIndex: 'plate',
    title: '交易区',
    width: 120,
    scopedSlots: { customRender: 'plate' }
  },
  {
    dataIndex: 'state',
    title: '状态',
    width: 100,
    scopedSlots: { customRender: 'state' }
  },
  {
    dataIndex: 'robot',
    title: '机器人',
    width: 80,
    scopedSlots: { customRender: 'robot' }
  },
  {
    dataIndex: 'mainMarket',
    title: '主流交易对',
    width: 110,
    scopedSlots: { customRender: 'mainMarket' }
  },
  {
    dataIndex: 'minnumber',
    title: '最低交易额',
    width: 110
  },
  {
    dataIndex: 'maxnumber',
    title: '最大交易额',
    width: 110
  },
  {
    dataIndex: 'robotPriceGas',
    title: '盘口幅度',
    width: 100
  },
  {
    dataIndex: 'robotPriceHigh',
    title: '价格上涨幅度',
    width: 100
  },
  {
    dataIndex: 'robotPriceLow',
    title: '价格下跌幅度',
    width: 100
  },
  {
    dataIndex: 'robotMaxNumber',
    title: '机器人最大挂掉',
    width: 140
  },
  {
    dataIndex: 'robotMinNumber',
    title: '机器人最小挂掉',
    width: 140
  },
  {
    dataIndex: 'robotMember',
    title: '机器人账号',
    width: 110
  },
  {
    dataIndex: 'mainMarket',
    title: '限制价格',
    width: 100,
    scopedSlots: { customRender: 'mainMarket' }
  },
  {
    dataIndex: 'limitHigh',
    title: '限制最高价',
    width: 110
  },
  {
    dataIndex: 'limitLow',
    title: '限制最低价',
    width: 110
  },
  {
    dataIndex: 'maincoinLowWarning',
    title: '主币种资产预警数量',
    width: 110
  },
  {
    dataIndex: 'tradcoinLowWarning',
    title: '交易币种资产预警数量',
    width: 100
  },
  {
    dataIndex: 'maincoinCloseWarning',
    title: '主币种触发关停机器人数量',
    width: 100
  },
  {
    dataIndex: 'tradcoinCloseWarning',
    title: '交易币种触发关停机器人数量',
    width: 110
  },
  {
    dataIndex: 'warningEmail',
    title: '预警接受人',
    width: 120
  },
  {
    dataIndex: 'unitPrice',
    title: '标的指数价',
    width: 120
  },
  {
    dataIndex: 'maxLever',
    title: '最大杠杆倍数',
    width: 120
  },
  {
    dataIndex: 'fundingRate',
    title: '资金费率',
    width: 100
  },
  {
    dataIndex: 'unit',
    title: '单张代表数量',
    width: 150
  },
  {
    dataIndex: 'marketcontrl',
    title: '行情价控制',
    width: 110,
    scopedSlots: { customRender: 'marketcontrl' }
  },
  {
    dataIndex: 'market',
    title: '行情价',
    width: 100
  }
]
const modalOptions = [
  { title: 'ID', field: 'autoid', type: 'input', decorator: {}, span: 12, disabled: true, hidden: true },
  {
    title: '主币种名称',
    field: 'maincoin',
    type: 'select-currency',
    span: 12,
    placeholder: '请选择',
    decorator: { rules: [{ required: true, message: '请选择币种' }] }
  },
  {
    title: '交易币种名称',
    field: 'tradcoin',
    span: 12,
    type: 'select-currency',
    placeholder: '请选择',
    decorator: { rules: [{ required: true, message: '请选择币种' }] }
  },

  {
    title: '手续费',
    field: 'gas',
    span: 12,
    type: 'number',
    placeholder: '请输入',
    decorator: { rules: [{ required: true, message: '手续费不能为空' }] }
  },
  {
    title: '最小交易额',
    field: 'minnumber',
    span: 12,
    type: 'number',
    placeholder: '请输入',
    decorator: { rules: [{ required: true, message: '最小交易额不能为空' }] }
  },
  {
    title: '最大交易额',
    field: 'maxnumber',
    span: 12,
    type: 'number',
    placeholder: '请输入',
    decorator: { rules: [{ required: true, message: '最大交易额不能为空' }] }
  },
  {
    title: '数量精度',
    field: 'amountAccuracy',
    span: 12,
    type: 'input',
    placeholder: '请输入',
    decorator: { rules: [{ required: true, message: '数量精度不能为空' }] }
  },
  {
    title: '价格精度',
    field: 'priceAccuracy',
    span: 12,
    type: 'input',
    placeholder: '请输入',
    decorator: { rules: [{ required: true, message: '价格精度不能为空' }] }
  },
  {
    title: '交易区',
    field: 'plate',
    span: 12,
    type: 'select',
    options: [
      { val: 'main', title: '主板' },
      { val: 'pioneer', title: '创业板' }
    ],
    decorator: { rules: [{ required: true, message: '请选择交易区' }] }
  },
  {
    title: '状态',
    field: 'state',
    span: 12,
    type: 'select',
    options: [
      { val: 'enable', title: '正在交易' },
      { val: 'disable', title: '已下架' },
      { val: 'ready', title: '即将交易' }
    ],
    decorator: { rules: [{ required: true, message: '请选择状态' }] }
  },
  {
    title: '机器人状态',
    field: 'robot',
    span: 12,
    type: 'select',
    options: [
      { val: 'enable', title: '启用' },
      { val: 'disable', title: '禁用' }
    ],
    decorator: { rules: [{ required: true, message: '请选择状态' }] }
  },

  {
    title: '大盘价格',
    field: 'price',
    span: 12,
    type: 'input',
    placeholder: '请输入',
    decorator: { rules: [{ required: true, message: '大盘价格不能为空' }] }
  },
  {
    title: '盘口幅度',
    field: 'robotPriceGas',
    span: 12,
    type: 'input',
    placeholder: '请输入',
    decorator: { rules: [{ required: true, message: '盘口幅度不能为空' }] }
  },
  {
    title: '上涨幅度',
    field: 'robotPriceHigh',
    span: 12,
    type: 'input',
    placeholder: '请输入',
    decorator: { rules: [{ required: true, message: '幅度不能为空' }] }
  },
  {
    title: '下跌幅度',
    field: 'robotPriceLow',
    span: 12,
    type: 'input',
    placeholder: '请输入',
    decorator: { rules: [{ required: true, message: '幅度不能为空' }] }
  },

  {
    title: '机器人每单最大量',
    field: 'robotMaxNumber',
    span: 12,
    type: 'number',
    placeholder: '请输入',
    decorator: { rules: [{ required: true, message: '机器人每单最大量不能为空' }] }
  },
  {
    title: '机器人每单最小量',
    field: 'robotMinNumber',
    span: 12,
    type: 'number',
    placeholder: '请输入',
    decorator: { rules: [{ required: true, message: '机器人每单最小量不能为空' }] }
  },
  {
    title: '机器人账号',
    field: 'robotMember',
    span: 12,
    type: 'input',
    placeholder: '请输入',
    decorator: { rules: [{ required: true, message: '请输入机器人账号' }] }
  },
  {
    title: '限制价格',
    field: 'mainMarket',
    span: 12,
    type: 'select',
    options: [
      { val: 'enable', title: '启用' },
      { val: 'disable', title: '禁用' }
    ],
    decorator: { rules: [{ required: true, message: '请选择限制价格' }] }
  },
  {
    title: '限制最高价',
    field: 'limitHigh',
    span: 12,
    type: 'input',
    placeholder: '请输入',
    decorator: { rules: [{ required: true, message: '限制最高价不能为空' }] }
  },
  {
    title: '限制最低价',
    field: 'limitLow',
    span: 12,
    type: 'input',
    placeholder: '请输入',
    decorator: { rules: [{ required: true, message: '限制最低价不能为空' }] }
  },

  {
    title: '主币种资产预警数量',
    field: 'maincoinLowWarning',
    span: 12,
    type: 'input',
    placeholder: '请输入',
    decorator: { rules: [{ required: true, message: '主币种资产预警数量不能为空' }] }
  },
  {
    title: '交易币种资产预警数量',
    field: 'tradcoinLowWarning',
    span: 12,
    type: 'input',
    placeholder: '请输入',
    decorator: { rules: [{ required: true, message: '交易币种资产预警数量不能为空' }] }
  },
  {
    title: '主币种触发关停机器人数量',
    field: 'maincoinCloseWarning',
    span: 12,
    type: 'input',
    placeholder: '请输入',
    decorator: { rules: [{ required: true, message: '主币种触发关停机器人数量不能为空' }] }
  },
  {
    title: '交易币种触发关停机器人数量',
    field: 'tradcoinCloseWarning',
    span: 12,
    type: 'input',
    placeholder: '请输入',
    decorator: { rules: [{ required: true, message: '交易币种触发关停机器人数量不能为空' }] }
  },

  {
    title: '预警接受人',
    field: 'warningEmail',
    span: 12,
    type: 'input',
    placeholder: '请输入',
    decorator: { rules: [{ required: true, message: '预警接受人不能为空' }] }
  },
  {
    title: '标的指数价',
    field: 'unitPrice',
    span: 12,
    type: 'input',
    placeholder: '请输入',
    decorator: { rules: [{ required: true, message: '标的指数价不能为空' }] }
  },
  {
    title: '最大杠杆倍数',
    field: 'maxLever',
    span: 12,
    type: 'input',
    placeholder: '请输入',
    decorator: { rules: [{ required: true, message: '最大杠杆倍数不能为空' }] }
  },
  {
    title: '资金费率',
    field: 'fundingRate',
    span: 12,
    type: 'input',
    placeholder: '请输入',
    decorator: { rules: [{ required: true, message: '请输入资金费率' }] }
  },
  {
    title: '单张代表数量',
    field: 'unit',
    type: 'input',
    span: 12,
    placeholder: '请输入',
    decorator: { rules: [{ required: true, message: '请输入单张代表数量' }] }
  },

  {
    title: '主流交易对',
    field: 'mainMarket',
    span: 12,
    type: 'select',
    options: [
      { val: 'enable', title: '是' },
      { val: 'disable', title: '否' }
    ],
    decorator: { rules: [{ required: true, message: '请选择主流交易对' }] }
  },
  {
    title: '行情价控制',
    field: 'marketcontrl',
    span: 12,
    type: 'select',
    options: [
      { val: 'Y', title: '开启' },
      { val: 'N', title: '关闭' }
    ],
    decorator: { rules: [{ required: true, message: '请选择行情价控制' }] }
  },
  {
    title: '行情价',
    field: 'market',
    span: 12,
    type: 'input',
    placeholder: '请输入',
    decorator: { rules: [{ required: true, message: '请输入行情价' }] }
  }
  // { title: '语言', field: 'locale', type: 'select', options: [{ val: 'CN', title: '中文' }, { val: 'EN', title: '英文' }, { val: 'JP', title: '日语' }, { val: 'KO', title: '韩语' }, { val: 'DE', title: '德国' }, { val: 'ES', title: '西班牙' }, { val: 'FR', title: '法语' }, { val: 'IT', title: '意大利' }], decorator: { rules: [{ required: true, message: '请选择语言版本' }] } },
  // { title: '公告内容', field: 'reply', type: 'textarea', rows: 10, placeholder: '请输入内容', decorator: { rules: [{ required: true, message: '请输入内容' }] } }
  // { title: '图片', field: 'imgsrc', type: 'image', decorator: { rules: [{ required: true, message: '请上传图片' }] } }
]

export default {
  name: 'ContractCoinList',
  components: {
    STable,
    Ellipsis,
    SModal
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
      modalConfig: {},
      modalOptions,
      roleMenus: [],
      // 高级搜索 展开/关闭
      advanced: false,
      // 搜索状态
      // disabledSearch: false,
      // 查询参数
      queryParam: {
        key: ''
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
      this.modalConfig['title'] = '新增'
    },
    handleEdit(record) {
      // get menu data
      this.roleMenus = []
      this.visible = true
      this.mdl = { ...record }
      this.modalConfig['title'] = '编辑'
    },
    handleOk() {
      const form = this.$refs.createModal.form
      const username = this.$store.getters.username
      this.confirmLoading = true
      form.validateFields((errors, values) => {
        if (!errors) {
          // 添加username
          values = {
            ...values,
            username
          }
          Object.keys(values).map((e) => {
            if (values[e] === undefined) {
              values[e] = ''
            }
          })
          console.log(values)
          if (values.autoid > 0) {
            // 修改 e.g.
            editContractCoin(values)
              .then((res) => {
                console.log(res)
                const { code, msg } = res
                if (code === 0) {
                  this.visible = false
                  this.confirmLoading = false
                  // 重置表单数据
                  form.resetFields()
                  // 刷新表格
                  // this.$refs.table.refresh()
                  this.getData()

                  this.$message.success('修改成功')
                } else {
                  this.$message.error(msg)
                  this.handleCancel()
                }
              })
              .catch((e) => {
                this.handleCancel()
              })
          } else {
            // 新增
            addContractCoin(values)
              .then((res) => {
                console.log(res)
                const { code, msg } = res
                if (code === 0) {
                  this.visible = false
                  this.confirmLoading = false
                  // 重置表单数据
                  form.resetFields()
                  // 刷新表格
                  // this.$refs.table.refresh()
                  this.getData()

                  this.$message.success('新增成功')
                } else {
                  this.$message.error(msg)
                  this.handleCancel()
                }
              })
              .catch((e) => {
                this.handleCancel()
              })
          }
        } else {
          this.confirmLoading = false
        }
      })
    },
    handleCancel() {
      this.visible = false
      this.confirmLoading = false
      const form = this.$refs.createModal.form
      form.resetFields() // 清理表单数据（可不做）
      this.roleMenus = []
    },
    toStray(record) {
      this.$router.push({
        path: '/contract/stragy',
        query: { autoid: record.autoid, maincoin: record.maincoin, tradcoin: record.tradcoin }
      })
    },
    toControl(record) {
      this.$router.push({
        path: '/contract/control',
        query: { autoid: record.autoid, maincoin: record.maincoin, tradcoin: record.tradcoin }
      })
    },
    handleDel(record) {
      console.log('del', record)
      const ts = this
      const delMod = Modal.confirm({
        centered: true,
        maskClosable: true,
        title: '提示信息',
        content: `确定删除【${record.autoid}】的记录？`,
        onOk: () => {
          delContractCoin({
            autoid: record.autoid
          }).then((res) => {
            ts.getData()
            delMod.destroy()
          })
        },
        onCancel() {}
      })
    },
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

      const res = await getContractCoinList(this.queryParam)

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
