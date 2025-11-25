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
        <a-form-item label="时间">
          <a-date-picker v-model="queryParam.startdate" @change="startChange" />~<a-date-picker
            v-model="queryParam.enddate"
            @change="endChange"
          />
        </a-form-item>
        <a-form-item label="状态">
          <a-select v-model="queryParam.state" style="width: 120px" allowClear>
            <a-select-option value="unfilled">未成交</a-select-option>
            <a-select-option value="section">部分成交</a-select-option>
            <a-select-option value="all">全部成交</a-select-option>
            <a-select-option value="cancel">全部撤销</a-select-option>
            <a-select-option value="uncancel">部分撤销</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="方向">
          <a-select v-model="queryParam.type" style="width: 120px" allowClear>
            <a-select-option value="buy">买入</a-select-option>
            <a-select-option value="sell">卖出</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="方式">
          <a-select v-model="queryParam.style" style="width: 120px" allowClear>
            <a-select-option value="limit">限价</a-select-option>
            <a-select-option value="market">市价</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="模式">
          <a-select v-model="queryParam.tdMode" style="width: 120px" allowClear>
            <a-select-option value="cross">全仓</a-select-option>
            <a-select-option value="lsolate">逐仓</a-select-option>
          </a-select>
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
        bordered
        :columns="columns"
        :dataSource="loadData"
        :pagination="pagination"
      >
        <!-- :rowSelection="rowSelection" -->

        <span slot="type" slot-scope="text, record">
          {{ record.type | typeMappingFormat }}
        </span>

        <span slot="style" slot-scope="text, record">
          {{ record.style | styleMappingFormat }}
        </span>

        <span slot="state" slot-scope="text, record">
          {{
            record.state === 'unfilled'
              ? '未成交'
              : record.state === 'section'
              ? '部分成交'
              : record.state === 'all'
              ? '全部成交'
              : record.state === 'cancel'
              ? '全部撤销'
              : record.state === 'uncancel'
              ? '部分撤销'
              : ''
          }}
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
      </a-table>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { STable, Ellipsis } from '@/components'
import {
  // getRoleList,
  getContractEntrustList
} from '@/api/contract'
import { tdModeMapping, typeMapping } from '@/utils/const'

const columns = [
  {
    title: 'ID',
    dataIndex: 'autoid',
    width: 80
  },
  {
    dataIndex: 'member',
    title: '账户',
    width: 100
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
    width: 80
  },
  {
    dataIndex: 'tradcoin',
    title: '交易币种',
    width: 80
  },
  {
    dataIndex: 'number',
    title: '委托数量',
    width: 80
  },
  {
    dataIndex: 'price',
    title: '委托价',
    width: 80
  },
  {
    dataIndex: 'state',
    title: '状态',
    width: 100,
    scopedSlots: { customRender: 'state' }
  },
  {
    dataIndex: 'td_mode',
    title: '模式',
    width: 80,
    scopedSlots: { customRender: 'td_mode' }
  },
  {
    dataIndex: 'type',
    title: '方向',
    width: 80,
    scopedSlots: { customRender: 'type' }
  },
  {
    dataIndex: 'style',
    title: '方式',
    width: 80,
    scopedSlots: { customRender: 'style' }
  },
  {
    dataIndex: 'unfilled',
    title: '未成交数',
    width: 100
  },
  {
    dataIndex: 'completed',
    title: '已成交数',
    width: 100
  },
  {
    dataIndex: 'gas',
    title: '手续费',
    width: 80
  },
  {
    dataIndex: 'unfilledgas',
    title: '未成交手续费',
    width: 80
  },
  {
    dataIndex: 'completedgas',
    title: '已成交手续费',
    width: 120
  },
  {
    dataIndex: 'lever',
    title: '杠杆',
    width: 80
  },
  {
    dataIndex: 'writedate',
    title: '时间',
    width: 150
  }
]

export default {
  name: 'ContractEntrustList',
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
    // rowSelection () {
    //   return {
    //     selectedRowKeys: this.selectedRowKeys,
    //     onChange: this.onSelectChange
    //   }
    // }
  },
  methods: {
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
    startChange(date, dateString) {
      this.queryParam.startdate = dateString
    },
    endChange(date, dateString) {
      this.queryParam.enddate = dateString
    },
    handleCancel() {
      this.visible = false
      this.confirmLoading = false
      const form = this.$refs.createModal.form
      form.resetFields() // 清理表单数据（可不做）
      this.roleMenus = []
    },

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

      const res = await getContractEntrustList(this.queryParam)
      const { code, data } = res
      if (code === 0) {
        this.loadData = data.records
        this.pagination.total = data.total
      }
      setTimeout(() => {
        this.loading = false
      }, 800)
    }
  }
}
</script>
