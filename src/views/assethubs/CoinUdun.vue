<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <!-- :model="queryParam" -->
      <a-form name="Search" layout="inline" autocomplete="off" style="margin-bottom: 14px" @submit="doSearch">
        <a-form-item label="搜索内容">
          <a-input style="width: 240px" v-model="queryParam.key" placeholder="请输入要搜索的内容"> </a-input>
        </a-form-item>
        <a-form-item>
          <a-button htmlType="submit" :disabled="disabledSearch" type="primary" @click="doSearch">查询 </a-button>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" icon="plus" @click="handleReload" :disabled="!$verify('113014')">重载币种</a-button>
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
        :dataSource="loadData"
        :pagination="pagination"
      >
        <span slot="tokenStatus" slot-scope="text, record">
          <template>
            <!-- <a @click="handleEdit(record)">编辑</a>
            <a-divider type="vertical" /> -->
            <span>{{ record.tokenStatus == 0 ? '主币' : '代币' }}</span>
          </template>
        </span>
        <span slot="writedate" slot-scope="text, record">
          <template>
            <!-- <a @click="handleEdit(record)">编辑</a>
            <a-divider type="vertical" /> -->
            {{ record.writedate | dayjs }}
          </template>
        </span>
      </a-table>

      <create-form
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
import {
  // getRoleList,
  getUdunCoinList,
  reloadUdunCoin
} from '@/api/assethub'

// import StepByStepModal from './modules/StepByStepModal'
import CreateForm from './modules/AddressForm'

const columns = [
  {
    title: '币种',
    dataIndex: 'symbol'
  },
  {
    title: '别名',
    dataIndex: 'name'
  },
  {
    title: '类型',
    dataIndex: 'tokenStatus',
    scopedSlots: { customRender: 'tokenStatus' }
  },
  {
    title: '所属链',
    dataIndex: 'mainSymbol'
  },
  {
    title: '余额',
    dataIndex: 'balance'
  },
  {
    title: '主类型',
    dataIndex: 'mainCoinType'
  },
  {
    title: '子类型',
    dataIndex: 'coinType'
  },
  {
    title: '操作时间',
    dataIndex: 'writedate',
    scopedSlots: { customRender: 'writedate' }
  }

  // {
  //   title: '操作',
  //   dataIndex: 'action',
  //   width: 150,
  //   scopedSlots: { customRender: 'action' },
  // },
]
const modalOptions = []

export default {
  name: 'AddressList',
  components: {
    STable,
    Ellipsis,
    CreateForm
    // StepByStepModal
  },
  data() {
    // this.columns = columns
    const username = this.$store.getters.username
    return {
      username,
      loading: false,
      columns,
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
        key: ''
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
    }
    // rowSelection () {
    //   return {
    //     selectedRowKeys: this.selectedRowKeys,
    //     onChange: this.onSelectChange
    //   }
    // }
  },
  methods: {
    async handleReload() {
      const ret = await reloadUdunCoin()
      if (ret.code === 0) {
        this.doSearch()
      }
    },
    handleEdit(record) {
      // get menu data
      // this.roleMenus = []
      this.visible = true
      this.mdl = { ...record }
    },
    handleOk() {
      const form = this.$refs.createModal.form
      // const username = this.$store.getters.username
      this.confirmLoading = true
      form.validateFields((errors, values) => {
        if (!errors) {
          // 添加username
          values = {
            ...values,
            username: this.username
          }
          Object.keys(values).map((e) => {
            if (values[e] === undefined) {
              values[e] = ''
            }
          })
          console.log(values)
          if (values.autoid > 0) {
          } else {
            // 新增
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
    handleDel(record) {},
    // onSelectChange (selectedRowKeys, selectedRows) {
    //   this.selectedRowKeys = selectedRowKeys
    //   this.selectedRows = selectedRows
    // },
    doSearch() {
      console.log(this.queryParam)
      this.getData()
    },
    async getData() {
      this.loading = true

      const res = await getUdunCoinList(this.queryParam)
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
