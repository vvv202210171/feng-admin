<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <!-- :model="queryParam" -->
      <a-form name="Search" layout="inline" autocomplete="off" style="margin-bottom: 14px" @submit="doSearch">
        <a-form-item label="搜索内容">
          <a-input style="width: 240px" v-model="queryParam.key" placeholder="请输入要搜索的内容"> </a-input>
        </a-form-item>
        <a-form-item label="类型">
          <a-select style="width: 100px" v-model="queryParam.paymentMethod">
            <a-select-option value=""> 请选择 </a-select-option>

            <a-select-option v-for="item in enums['PaymentMethod']" :key="item.code" :value="item.code">{{ item.desc
            }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="时间">
          <a-date-picker v-model="queryParam.startdate" @change="startChange" />~<a-date-picker
            v-model="queryParam.enddate" @change="endChange" />
        </a-form-item>
        <a-form-item>
          <a-button htmlType="submit" :disabled="disabledSearch" type="primary" @click="doSearch">查询</a-button>
        </a-form-item>

      </a-form>
      <a-table ref="table" size="default" row-key="id" :loading="loading" expandRowByClick :scroll="{ x: 980 }" bordered
        :columns="columns" :dataSource="loadData" :pagination="pagination">
        <template slot="paymentMethod" slot-scope="text, record">
          {{ getDesc('PaymentMethod', record.paymentMethod) }}
        </template>

        <template slot="state" slot-scope="text, record">
          <span v-if="record.state === 'enable'">启用</span>
          <span v-if="record.state === 'disable'" style="color: #eb1345">冻结</span>
        </template>

        <template slot="imgurl" slot-scope="text, record">
          <span v-if="record.zm === '--'"></span>
          <img v-else :src="imgUrl(record.imgurl)" height="150" width="200" />
        </template>

        <template slot="fm" slot-scope="text, record">
          <span v-if="record.fm === '--'"></span>
          <img v-else :src="imgUrl(record.fm)" height="150" width="200" />
        </template>

        <template slot="sc" slot-scope="text, record">
          <span v-if="record.sc === '--'"></span>
          <img v-else :src="imgUrl(record.sc)" height="150" width="200" />
        </template>

        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="pass(record)" :disabled="!$verify('112011')">通过</a>
            <a-divider type="vertical" />
            <a @click="reject(record)" :disabled="!$verify('112011')">拒绝</a>
            <!-- 
            <a @click="handleDel(record)">删除</a> -->
          </template>
        </span>
        <p slot="expandedRowRender" slot-scope="record" style="margin: 0">
          <a-card title="用户详情">
            <a-card-grid style="width: 16.6666%; line-height: 10px" v-for="(key, index) in columns2" :key="index">
              <template>
                <span>{{ key.title }}</span>:<span>{{ record[key.dataIndex] }}</span>
              </template>
            </a-card-grid>
          </a-card>
        </p>
      </a-table>

      <s-modal ref="createModal" :config="modalConfig" :visible="visible" :loading="confirmLoading"
        :options="modalOptions" :model="mdl" @cancel="handleCancel" @ok="handleOk" />
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { STable, Ellipsis, SModal } from '@/components'
import {
  // getRoleList,
  rechargAuditList,
  // delRealyName,
  // addRealyName,
  editRealyName,
  rechageAudit
} from '@/api/examine'
// import { Modal } from 'ant-design-vue'

// import StepByStepModal from './modules/StepByStepModal'
// import CreateForm from './modules/RealyNameForm'

const columns = [
  {
    title: '单号',
    dataIndex: 'transactionNumber',
    width: 160
  },
  {
    dataIndex: 'member',
    title: '账户',
    width: 60
  },
  {
    dataIndex: 'userName',
    title: '真实姓名',
    width: 100
  },
  {
    dataIndex: 'nickName',
    title: '昵称',
    width: 100
  },
  {
    dataIndex: 'tel',
    title: '电话',
    width: 100
  },
  {
    dataIndex: 'email',
    title: '邮箱',
    width: 100
  },
  {
    dataIndex: 'paymentMethod',
    title: '支付方式',
    width: 100,
    scopedSlots: { customRender: 'paymentMethod' }
  },
  {
    dataIndex: 'amount',
    width: 100,
    title: '金额'
  },
  {
    dataIndex: 'imgurl',
    title: '凭证',
    width: 250,
    scopedSlots: { customRender: 'imgurl' }
  },


  {
    dataIndex: 'usdtAmount',
    title: 'USDT金额',
    width: 100,
  },
  {
    dataIndex: 'createdAt',
    title: '创建时间',
    width: 120,
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
    title: '银行',
    dataIndex: 'bankName',
    width: 80
  },
  {
    title: '持卡人',
    dataIndex: 'accountHolder',
    width: 80
  },
  {
    title: '持卡账号',
    dataIndex: 'accountNumber',
    width: 80
  },
  {
    title: 'USDT汇率',
    dataIndex: 'usdtRate',
    width: 80
  },
  {
    dataIndex: 'transactionTime',
    title: '交易时间',
    width: 100,
  },
]
const modalOptions = [
  { title: '编号', field: 'id', type: 'input', decorator: {}, disabled: true, hidden: true },
  { title: '单号', field: 'transactionNumber', type: 'input', decorator: {}, disabled: true },

  {
    title: '原因(会员可见)',
    field: 'reason',
    type: 'input',
    placeholder: '如果是驳回，请输入原因'
  }
]

export default {
  name: 'RealyNameList',
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
      modalOptions,
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
    pass(record) {
      const _this = this;
      this.$confirm({
        "title": "您确定要通过吗？" + record.transactionNumber, async onOk() {
          const ret = await rechageAudit({
            id: record.id, oper: "pass"
          });
          if (ret.code == 0) {
            _this.getData();
          } else {
            _this.$message.error(ret.msg)
          }

        }
      });

    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    startChange(date, dateString) {
      this.queryParam.startdate = dateString
    },
    endChange(date, dateString) {
      this.queryParam.enddate = dateString
    },
    reject(record) {
      // get menu data
      this.roleMenus = []
      this.visible = true
      this.mdl = { ...record }
      this.mdl.reason = ''
      this.modalConfig['title'] = '审核信息'
    },
    handleOk() {
      const form = this.$refs.createModal.form
      const username = this.$store.getters.username
      this.confirmLoading = true
      form.validateFields(async (errors, values) => {
        if (!errors) {
          const ret = await rechageAudit({ reason: values.reason, id: values.id, oper: "reject" })
          if (ret.code == 0) {
            this.handleCancel();
            this.getData();
          } else {
            this.$message.error(ret.msg)
          }
        }
        this.confirmLoading = false

      })
    },
    handleCancel() {
      this.visible = false
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
      const res = await rechargAuditList(this.queryParam)
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
