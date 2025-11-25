<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <!-- :model="queryParam" -->
      <a-form name="Search" layout="inline" autocomplete="off" style="margin-bottom: 14px" @submit="doSearch">
        <a-form-item label="搜索内容">
          <a-input style="width: 240px" v-model="queryParam.key" placeholder="请输入要搜索的内容"> </a-input>
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
        :scroll="{ x: 1500 }"
        bordered
        :columns="columns"
        :dataSource="loadData"
        :pagination="pagination"
      >
        <span slot="withDrawType" slot-scope="text, record">
          <span v-if="isBank(record)">提币到银行卡</span>
          <span v-else>提币到地址</span>
        </span>
        <template slot="state" slot-scope="text, record">
          <span v-if="record.state === 'sending'" style="color: #eb1345">待审核</span>
          <span v-if="record.state === 'disable'">已完成</span>
          <span v-if="record.state === 'disable'">已取消</span>
        </template>
        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="handleEdit(record)" :disabled="!$verify('112022')">编辑</a>
            <!-- <a-divider type="vertical" />
            <a @click="handleDel(record)">删除</a> -->
          </template>
        </span>
        <p slot="expandedRowRender" slot-scope="record" style="margin: 0">
          <a-card title="详情">
            <a-card-grid style="width: 25%" v-for="(key, index) in columns2" :key="index">
              <span>{{ key.title }}</span
              >:
              <template v-if="key.dataIndex == 'state'">
                <span v-if="record.state === 'sending'" style="color: #eb1345">待审核</span>
                <span v-if="record.state === 'disable'">已完成</span>
                <span v-if="record.state === 'disable'">已取消</span>
              </template>
              <template v-else-if="key.dataIndex == 'bankCardId'">
                <span v-if="isBank(record)">提币到银行卡</span>
                <span v-else>提币到地址</span>
              </template>
              <template v-else>
                <span>{{ record[key.dataIndex] }}</span>
              </template>
            </a-card-grid>
            <a-card-grid style="width: 25%" v-if="isBank(record) == false">
              <span>提币地址：</span>
              <span>{{ record.address }}</span>
            </a-card-grid>
            <a-card-grid style="width: 25%" v-if="isBank(record)">
              <span>持卡人:</span>
              <span>{{ record.holderName }}</span>
            </a-card-grid>
            <a-card-grid style="width: 25%" v-if="isBank(record)">
              <span>银行账号:</span>
              <span>{{ record.bankAccount }}</span>
            </a-card-grid>
            <a-card-grid style="width: 25%" v-if="isBank(record)">
              <span>银行名称:</span>
              <span>{{ record.bankName }}</span>
            </a-card-grid>
            <a-card-grid style="width: 25%" v-if="isBank(record)">
              <span>区域码:</span>
              <span>{{ record.areaCode }}</span>
            </a-card-grid>
            <a-card-grid style="width: 25%" v-if="isBank(record)">
              <span>联系电话:</span>
              <span>{{ record.phone }}</span>
            </a-card-grid>
            <a-card-grid style="width: 25%" v-if="isBank(record)">
              <span>法币:</span>
              <span>{{ record.fiatCode }}</span>
            </a-card-grid>
            <a-card-grid style="width: 25%" v-if="isBank(record)">
              <span>到账法币数量:</span>
              <span>{{ record.fiatNum }}</span>
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
      <s-modal
        ref="createModal"
        :config="modalConfig"
        :visible="bankVisible"
        :loading="confirmLoading"
        :options="modalOptionsBank"
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
  getCoinOutList,
  editCoinOut
} from '@/api/examine'
// import { Modal } from 'ant-design-vue'

// import StepByStepModal from './modules/StepByStepModal'
// import CreateForm from './modules/CoinOutForm'
const columns = [
  {
    dataIndex: 'autoid',
    title: 'ID',
    width: 80
  },
  {
    dataIndex: 'member',
    title: '账户',
    width: 120
  },
  {
    dataIndex: 'email',
    title: '邮箱',
    width: 80
  },
  {
    dataIndex: 'tel',
    title: '电话',
    width: 80
  },
  {
    dataIndex: 'bankCardId',
    title: '提币类型',
    width: 150,
    scopedSlots: { customRender: 'withDrawType' }
  },

  {
    dataIndex: 'coin',
    title: '币种',
    width: 100
  },
  {
    dataIndex: 'number',
    title: '数量',
    width: 100
  },
  {
    dataIndex: 'lastnumber',
    title: '实际到账数量',
    width: 100
  },
  {
    dataIndex: 'gas',
    title: '手续费',
    width: 100
  },
  {
    dataIndex: 'gascoin',
    title: '手续费币种',
    width: 80
  },
  {
    dataIndex: 'address',
    title: '提币地址',
    width: 150
  },

  {
    dataIndex: 'state',
    title: '状态',
    width: 100,
    scopedSlots: { customRender: 'state' }
  },

  {
    dataIndex: 'hash',
    title: '哈希',
    width: 150
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
    width: 150
  },
  {
    dataIndex: 'bankCardId',
    title: '提币类型',
    width: 150
  },
  {
    dataIndex: 'email',
    title: '邮箱',
    width: 150
  },
  {
    dataIndex: 'username',
    title: '姓名',
    width: 100
  },
  {
    dataIndex: 'coin',
    title: '币种',
    width: 100
  },
  {
    dataIndex: 'number',
    title: '数量',
    width: 100
  },
  {
    dataIndex: 'lastnumber',
    title: '实际到账数量',
    width: 100
  },
  {
    dataIndex: 'gas',
    title: '手续费',
    width: 100
  },
  {
    dataIndex: 'gascoin',
    title: '手续费币种',
    width: 80
  },
  {
    dataIndex: 'writedate',
    title: '时间',
    width: 150
  },
  {
    dataIndex: 'state',
    title: '状态',
    width: 100,
    scopedSlots: { customRender: 'state' }
  },
  {
    dataIndex: 'tag',
    title: '标签',
    width: 180
  },
  {
    dataIndex: 'hash',
    title: '哈希',
    width: 150
  }
]

const modalOptions = [
  { title: '编号', field: 'autoid', type: 'input', decorator: {}, disabled: true },
  {
    title: '账号',
    field: 'member',
    type: 'input',
    placeholder: '请输入账号',
    disabled: true,
    decorator: { rules: [{ required: true, message: '请输入账号' }] }
  },
  {
    title: '提现币种',
    field: 'coin',
    type: 'input',
    placeholder: '请输入',
    disabled: true,
    decorator: { rules: [{ required: true, message: '请输入提现币种' }] }
  },
  {
    title: '提现数量',
    field: 'number',
    type: 'input',
    placeholder: '请输入',
    disabled: true,
    decorator: { rules: [{ required: true, message: '请输入提现数量' }] }
  },

  {
    title: '实际到账数量',
    field: 'lastnumber',
    type: 'input',
    placeholder: '请输入',
    disabled: true,
    decorator: { rules: [{ required: true, message: '请输入实际到账数量' }] }
  },
  { title: '提现地址', field: 'address', type: 'label', hasQrCode: true },
  { title: '标签', field: 'tag', type: 'label', hasQrCode: true },

  {
    title: '审核结果',
    field: 'state',
    type: 'select',
    options: [
      { val: 'sending', title: '待审核' },
      { val: 'completed', title: '通过' },
      { val: 'dismissed', title: '驳回' }
    ],
    decorator: { rules: [{ required: true, message: '请选择审核结果' }] }
  },
  {
    title: '原因(会员可见)',
    type: 'input',
    field: 'reason',
    placeholder: '如果是驳回请输入原因'
  },
  {
    title: '原因(后台可见)',
    type: 'input',
    field: 'reasonBo',
    placeholder: '如果是驳回请输入原因'
  },
  {
    title: '转账哈希',
    field: 'hash',
    type: 'input',
    placeholder: '请输入',
    decorator: { rules: [{ required: true, message: '请输入转账哈希' }] }
  }
]
const modalOptionsBank = [
  { title: '编号', field: 'autoid', type: 'input', decorator: {}, disabled: true },
  {
    title: '账号',
    field: 'member',
    type: 'input',
    placeholder: '请输入账号',
    disabled: true,
    decorator: { rules: [{ required: true, message: '请输入账号' }] }
  },
  {
    title: '提现币种',
    field: 'coin',
    type: 'input',
    placeholder: '请输入',
    disabled: true,
    decorator: { rules: [{ required: true, message: '请输入提现币种' }] }
  },
  {
    title: '提现数量',
    field: 'number',
    type: 'input',
    placeholder: '请输入',
    disabled: true,
    decorator: { rules: [{ required: true, message: '请输入提现数量' }] }
  },

  {
    title: '实际到账数量',
    field: 'lastnumber',
    type: 'input',
    placeholder: '请输入',
    disabled: true,
    decorator: { rules: [{ required: true, message: '请输入实际到账数量' }] }
  },
  { title: '持卡人', field: 'holderName', type: 'input', disabled: true, hasQrCode: true },
  { title: '银行名称', field: 'bankName', type: 'input', disabled: true, hasQrCode: true },
  { title: '账户', field: 'bankAccount', type: 'input', disabled: true, hasQrCode: true },
  { title: '区域码', field: 'areaCode', type: 'input', disabled: true, hasQrCode: true },
  { title: '电话', field: 'phone', type: 'input', disabled: true, hasQrCode: true },
  { title: '标签', field: 'tag', type: 'label', hasQrCode: true },

  {
    title: '审核结果',
    field: 'state',
    type: 'select',
    options: [
      { val: 'sending', title: '待审核' },
      { val: 'completed', title: '通过' },
      { val: 'dismissed', title: '驳回' }
    ],
    decorator: { rules: [{ required: true, message: '请选择审核结果' }] }
  },
  {
    title: '转账哈希',
    field: 'hash',
    type: 'input',
    placeholder: '请输入',
    decorator: { rules: [{ required: true, message: '请输入转账哈希' }] }
  }
]
export default {
  name: 'CoinOutList',
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
      bankVisible: false,
      confirmLoading: false,
      mdl: null,
      modalOptions,
      modalOptionsBank,
      roleMenus: [],
      modalConfig: {},
      // 高级搜索 展开/关闭
      advanced: false,
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

  created() {
    // getRoleList({ t: new Date() })
    this.getData()
  },
  computed: {
    // 搜索状态
    disabledSearch() {
      return this.loading
    }
  },
  methods: {
    isBank(record) {
      return record.bankCardId !== 0
    },
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
      if (this.isBank(record)) {
        this.bankVisible = true
      } else {
        this.visible = true
      }
      this.mdl = { ...record }
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
            editCoinOut(values)
              .then((res) => {
                console.log(res)
                const { code, msg } = res
                if (code === 0) {
                  this.visible = false
                  this.bankVisible = false
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
            // // 新增
            // addCurrency(values)
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
      this.bankVisible = false
      this.confirmLoading = false
      const form = this.$refs.createModal.form
      form.resetFields() // 清理表单数据（可不做）
      this.roleMenus = []
    },

    doSearch() {
      console.log(this.queryParam)
      this.getData()
    },
    async getData() {
      this.loading = true

      const res = await getCoinOutList(this.queryParam)
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
