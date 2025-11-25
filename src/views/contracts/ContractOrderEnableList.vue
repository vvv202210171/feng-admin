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
        <a-form-item>
          <a-button type="primary" icon="plus" @click="handleAdd" :disabled="!$verify('109028')">仓位调整</a-button>
        </a-form-item>
      </a-form>
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
        bordered
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

        <span slot="td_mode" slot-scope="text, record">
          {{ record.td_mode | tdModeMappingFormat }}
        </span>

        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="handleEdit(record)" :disabled="!$verify('109029')">平仓</a>
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

      <s-modal
        ref="addModal"
        :config="modalConfig"
        :visible="add.visible"
        :loading="confirmLoading"
        :options="addOrderOptions"
        :model="add.mdl"
        @cancel="handleCancel"
        @ok="handleAddOk"
      />

      <s-modal
        ref="editModal"
        :config="modalConfig"
        :visible="edit.visible"
        :loading="confirmLoading"
        :options="editOrderOptions"
        :model="edit.mdl"
        @cancel="handleCancel"
        @ok="handleEditOk"
      />
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { STable, Ellipsis, SModal } from '@/components'
import {
  // getRoleList,
  getContractOrderEnableList,
  editContractOrderEnable, // 平仓
  addContractOrderEnable // 仓位调整
} from '@/api/contract'
import { styleMapping, typeMapping, contractStateMapping, tdModeMapping } from '@/utils/const'

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
    width: 120
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
    title: '当前价格',
    width: 120
  },
  {
    dataIndex: 'income',
    title: '盈亏',
    width: 120
  },
  {
    dataIndex: 'writedate',
    title: '建仓时间',
    width: 180
  }
]
// 仓位调整
const addOrderOptions = [
  {
    title: '交易币种',
    field: 'tradcoin',
    type: 'select-currency',
    placeholder: '请选择',
    decorator: { rules: [{ required: true, message: '请选择交易币种' }] }
  },
  {
    title: '主币种',
    field: 'maincoin',
    type: 'select-currency',
    placeholder: '请选择',
    decorator: { rules: [{ required: true, message: '请选择主币种' }] }
  },
  {
    title: '开始时间',
    field: 'startdate',
    type: 'timer',
    placeholder: '请输入开始时间',
    decorator: { rules: [{ required: true, message: '请输入开始时间' }] }
  },
  {
    title: '结束时间',
    field: 'enddate',
    type: 'timer',
    placeholder: '请输入结束时间',
    decorator: { rules: [{ required: true, message: '请输入结束时间' }] }
  },
  {
    title: '最高价格',
    field: 'maxPrice',
    type: 'number',
    placeholder: '请输入价格',
    decorator: { rules: [{ required: true, message: '请输入价格' }] }
  },
  {
    title: '最低价格',
    field: 'minPrice',
    type: 'number',
    placeholder: '请输入价格',
    decorator: { rules: [{ required: true, message: '请输入价格' }] }
  }
]
// 平仓
const editOrderOptions = [
  { title: 'ID', field: 'autoid', type: 'input', decorator: {}, disabled: true },
  {
    title: '账号',
    field: 'member',
    type: 'input',
    disabled: true,
    placeholder: '请输入账号',
    decorator: { rules: [{ required: true, message: '请输入账号' }] }
  },
  {
    title: '币种',
    field: 'tradcoin',
    type: 'select-currency',
    disabled: true,
    placeholder: '请选择币种',
    decorator: { rules: [{ required: true, message: '请选择币种' }] }
  },
  {
    title: '可平张数',
    field: 'unfilled',
    type: 'number',
    disabled: true,
    placeholder: '请输入可平张数',
    decorator: { rules: [{ required: true, message: '请输入可平张数' }] }
  },
  {
    title: '方向',
    field: 'type',
    type: 'select',
    disabled: true,
    options: [
      { val: 'buy', title: '做多' },
      { val: 'sell', title: '做空' }
    ],
    decorator: { initialValue: 'buy', rules: [{ required: true, message: '请选择方向' }] }
  },

  {
    title: '杠杠倍数',
    field: 'lever',
    type: 'number',
    disabled: true,
    placeholder: '请输入',
    decorator: { rules: [{ required: true, message: '请输入杠杠倍数' }] }
  },
  {
    title: '预估强平价',
    field: 'point',
    type: 'number',
    disabled: true,
    placeholder: '请输入',
    decorator: { rules: [{ required: true, message: '请输入预估强平价' }] }
  },
  {
    title: '保证金',
    field: 'profit',
    type: 'number',
    disabled: true,
    placeholder: '请输入保证金',
    decorator: { rules: [{ required: true, message: '请输入保证金' }] }
  },

  {
    title: '盈亏',
    field: 'income',
    type: 'number',
    disabled: true,
    placeholder: '请输入',
    decorator: { rules: [{ required: true, message: '请输入盈亏' }] }
  },
  {
    title: '交易价格',
    field: 'price',
    type: 'number',
    disabled: true,
    placeholder: '请输入',
    decorator: { rules: [{ required: true, message: '请输入仓位价值' }] }
  },
  {
    title: '最终平仓价格',
    field: 'last_profit',
    type: 'number',
    placeholder: '请输入',
    decorator: { rules: [{ required: true, message: '请输入最终平仓价格' }] }
  }
]

export default {
  name: 'ContractOrderEnableList',
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
      confirmLoading: false,
      roleMenus: [],
      modalConfig: {},
      add: {
        visible: false,
        mdl: null
      },
      styleMapping: styleMapping,
      typeMapping: typeMapping,
      contractStateMapping: contractStateMapping,
      tdModeMapping: tdModeMapping,
      addOrderOptions,
      edit: {
        visible: false,
        mdl: null
      },
      editOrderOptions,
      // 高级搜索 展开/关闭
      advanced: false,
      // // 搜索状态
      // disabledSearch: false,
      // 查询参数
      queryParam: {
        key: ''
      },
      // 加载数据方法 必须为 Promise 对象
      loadData: [],
      totallyData: { totalFess: '0', totalGas: '0', totalOnProfit: '0', totalPosition: '0', totalUnProfit: '0' },
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
      this.add.mdl = null
      this.add.visible = true
      this.modalConfig['title'] = '仓位调整'
    },
    handleEdit(record) {
      // get menu data
      this.roleMenus = []
      this.edit.visible = true
      this.edit.mdl = { ...record }
      this.modalConfig['title'] = '平仓'
    },
    handleAddOk() {
      const form = this.$refs.addModal.form
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
          // 新增
          addContractOrderEnable(values)
            .then((res) => {
              const { code, msg } = res
              if (code === 0) {
                this.add.visible = false
                this.confirmLoading = false
                // 重置表单数据
                form.resetFields()
                // 刷新表格
                // this.$refs.table.refresh()
                this.getData()

                this.$message.success('仓位调整成功')
              } else {
                this.$message.error(msg)
                this.handleCancel()
              }
            })
            .catch((e) => {
              this.handleCancel()
            })
        } else {
          this.confirmLoading = false
        }
      })
    },
    handleEditOk() {
      const form = this.$refs.editModal.form
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
            editContractOrderEnable(values)
              .then((res) => {
                const { code, msg } = res
                if (code === 0) {
                  this.edit.visible = false
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
          }
        } else {
          this.confirmLoading = false
        }
      })
    },
    handleCancel() {
      this.add.visible = false
      this.edit.visible = false
      this.confirmLoading = false
      const form = this.$refs.addModal.form
      form.resetFields() // 清理表单数据（可不做）
      const editform = this.$refs.editModal.form
      editform.resetFields() // 清理表单数据（可不做）
      this.roleMenus = []
    },
    handleDel(record) {
      console.log('del', record)
      // const ts = this
      // const delMod =
      // Modal.confirm({
      //   centered: true,
      //   maskClosable: true,
      //   title: '提示信息',
      //   content: `确定删除【${record.username}】的记录？`,
      //   onOk: () => {
      //     // return new Promise((resolve, reject) => {
      //     //   setTimeout(Math.random() > 0.5 ? resolve : reject, 1500)
      //     // }).catch(() => console.log('Oops errors!'))
      //     // return this.$store.dispatch('Logout').then(() => {
      //     //   this.$router.push({ name: 'login' })
      //     // })
      //     // delUserLevel({
      //     //   username: record.username,
      //     //   autoid: record.autoid
      //     // })
      //     //   .then(res => {
      //     //     console.log(res)
      //     //     ts.getData()
      //     //     delMod.destroy()
      //     //   })
      //   },
      //   onCancel () {}
      // })
    },
    startChange(date, dateString) {
      this.queryParam.startdate = dateString
    },
    endChange(date, dateString) {
      this.queryParam.enddate = dateString
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

      const res = await getContractOrderEnableList(this.queryParam)
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
