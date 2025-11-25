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

      <!-- <div class="table-operator">
        <a-button type="primary" icon="plus" @click="handleAdd">仓位调整</a-button>
      </div> -->

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

        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="handleEdit(record)" :disabled="!$verify('110015')">平仓</a>
            <!-- <a-divider type="vertical" />
            <a @click="handleDel(record)">删除</a> -->
          </template>
        </span>
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
              <template v-else-if="key.dataIndex == 'cycle_state'">
                <span :class="record.cycle_state">{{ record.cycle_state | cycleStateFormat }}</span>
              </template>
              <template v-else>
                <span>{{ record[key.dataIndex] }}</span>
              </template>
            </a-card-grid>
          </a-card>
        </p>
      </a-table>

      <CycleCloseModal
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
import { STable, Ellipsis } from '@/components'
import CycleCloseModal from './modules/CycleCloseModal.vue'
import {
  getCycleOrderEnableList,
  editCycleOrderEnable // 平仓
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
    dataIndex: 'tradcoin',
    title: '交易币种',
    width: 100
  },
  {
    dataIndex: 'lever',
    title: '交易周期',
    width: 120
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
    dataIndex: 'standrad',
    title: '仓位标准',
    width: 100
  },
  {
    dataIndex: 'today_order_id',
    title: '单数',
    width: 100
  },
  {
    dataIndex: 'state',
    title: '持仓状态',
    width: 100,
    scopedSlots: { customRender: 'state' }
  },
  {
    dataIndex: 'writedate',
    title: '下单时间',
    width: 150
  },
  {
    dataIndex: 'cycle_state',
    title: '周期状态',
    width: 100,
    scopedSlots: { customRender: 'cycle_state' }
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: 150,

    scopedSlots: { customRender: 'action' }
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
    width: 100
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
    width: 100
  },
  {
    dataIndex: 'today_order_id',
    title: '单数',
    width: 100
  },
  {
    dataIndex: 'state',
    title: '持仓状态',
    width: 100
  },
  {
    dataIndex: 'writedate',
    title: '下单时间',
    width: 150
  },
  {
    dataIndex: 'cycle_state',
    title: '周期状态',
    width: 80
  }
]
const modalOptions = [
  { title: 'ID', field: 'autoid', type: 'input', decorator: {}, disabled: true },
  { title: '账号', field: 'member', type: 'input', decorator: {}, disabled: true },
  { title: '币种', field: 'tradcoin', type: 'input', decorator: {}, disabled: true },
  { title: '仓位保证金', field: 'profit', type: 'input', decorator: {}, disabled: true },
  { title: '收益率', field: 'profit_gas', type: 'input', decorator: {}, disabled: true },
  { title: '亏损率', field: 'loss_gas', type: 'input', decorator: {}, disabled: true },
  { title: '方向', field: 'type', type: 'input', decorator: {}, disabled: true },
  { title: '买入价格', field: 'price', type: 'input', decorator: {}, disabled: true },
  {
    title: '最终平仓价格',
    field: 'last_profit',
    type: 'number',
    placeholder: '请输入最终平仓价格',
    decorator: { rules: [{ required: true, message: '请输入最终平仓价格' }] }
  }
]

export default {
  name: 'CycleOrderEnableList',
  components: {
    STable,
    Ellipsis,
    CycleCloseModal
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
      timer: null,
      roleMenus: [],
      modalConfig: {},
      modalOptions,
      // 高级搜索 展开/关闭
      advanced: false,
      // // 搜索状态
      // disabledSearch: false,
      // 查询参数
      queryParam: {
        key: '',
        type: '',
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
  created() {
    this.getData()
    this.timer = setInterval(() => {
      this.getData()
    }, 2000)
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
  destroyed() {
    if (this.timer) {
      clearInterval(this.timer)
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
      this.mdl.type = this.mdl.type == 'buy' ? '买多' : '买空'
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
            editCycleOrderEnable(values)
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
                  this.$message.success('平仓成功')
                } else {
                  this.$message.error(msg)
                  this.handleCancel()
                }
              })
              .catch((e) => {
                this.handleCancel()
              })
          } else {
            // // 新增
            // addCycleOrderEnable(values)
            //   .then(res => {
            //     console.log(res)
            //     this.visible = false
            //     this.confirmLoading = false
            //     // 重置表单数据
            //     form.resetFields()
            //     // 刷新表格
            //     // this.$refs.table.refresh()
            //     this.getData()
            //     this.$message.success('新增成功')
            //   })
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
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    doSearch() {
      console.log(this.queryParam)
      this.getData()
    },
    async getData() {
      const res = await getCycleOrderEnableList(this.queryParam)
      const { code, data } = res
      if (code === 0) {
        this.loadData = data.pages.records
        this.pagination.total = data.pages.total
      } else {
        console.log(res)
      }
    }
  }
}
</script>
