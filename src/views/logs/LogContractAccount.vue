<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <!-- :model="queryParam" -->
      <a-form name="Search" layout="inline" autocomplete="off" style="margin-bottom: 14px" @submit="doSearch">
        <a-form-item label="搜索内容">
          <a-input v-model="queryParam.key" style="width: 240px" placeholder="请输入要搜索的内容" />
        </a-form-item>
        <a-form-item label="币种">
          <a-input v-model="queryParam.coin" style="width: 240px" placeholder="请输入要搜索的币种" />
        </a-form-item>
        <a-form-item label="类型">
          <a-select v-model="queryParam.type" style="width: 120px" allow-clear>
            <a-select-option value="in"> 入款 </a-select-option>
            <a-select-option value="out"> 出款 </a-select-option>
            <a-select-option value="no"> 其他 </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="时间">
          <QuickTime @change="changeDate"></QuickTime>
        </a-form-item>
        <a-form-item>
          <a-button html-type="submit" :disabled="disabledSearch" type="primary" @click="doSearch"> 查询 </a-button>
        </a-form-item>
      </a-form>

      <a-table
        ref="table"
        size="small"
        row-key="autoid"
        :loading="loading"
        :scroll="{ x: 980 }"
        :columns="columns"
        :data-source="loadData"
        :pagination="pagination"
      >
        <span slot="type" slot-scope="text, record">
          <span>
            <span v-if="record.type === 'no'" :class="record.type">
              <span>其他</span>
              <a-icon type="swap-right"
            /></span>
            <span v-if="record.type === 'in'" :class="record.type">
              <span>入款</span>
              <a-icon type="arrow-up"
            /></span>
            <span v-if="record.type === 'out'" :class="record.type">
              <span>出款</span>
              <a-icon type="arrow-down"
            /></span>
          </span>

          <!-- <span slot="action" slot-scope="text, record">
          <template>
            <a @click="handleEdit(record)">编辑</a>
            <a-divider type="vertical" />
            <a @click="handleDel(record)">删除</a>
          </template>
        </span> -->
        </span></a-table
      >
    </a-card>
  </page-header-wrapper>
</template>

<script>
import {
  // getRoleList,
  getLogContractAccountList
} from '@/api/log'

const columns = [
  {
    dataIndex: 'id',
    title: 'ID',
    width: 100
  },
  {
    dataIndex: 'member',
    title: '账号',
    width: 150
  },
  {
    dataIndex: 'coin',
    title: '币种',
    width: 150
  },
  {
    dataIndex: 'usableBefore',
    title: '变前',
    width: 150
  },
  {
    dataIndex: 'usableCurr',
    title: '变后',
    width: 150
  },
  {
    dataIndex: 'change',
    title: '变动',
    width: 150
  },
  {
    dataIndex: 'type',
    title: '类型',
    scopedSlots: { customRender: 'type' },
    width: 150
  },
  {
    dataIndex: 'usdisable',
    title: '冻结',
    width: 150
  },
  {
    dataIndex: 'remark',
    title: '操作内容',
    width: 180
  },
  {
    dataIndex: 'writedate',
    title: '时间',
    width: 150
  }
]

export default {
  name: 'LogUserSetting',
  components: {
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
        key: '',
        startdate: '',
        enddate: '',
        coin: ''
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
    changeDate(data) {
      this.queryParam.startdate = data[0]
      this.queryParam.enddate = data[1]
    },
    doSearch() {
      console.log(this.queryParam)
      this.queryParam.page = 1
      this.getData()
    },
    async getData() {
      this.loading = true
      this.queryParam.page = this.pagination.current
      this.queryParam.limit = this.pagination.pageSize
      const res = await getLogContractAccountList(this.queryParam)
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
<style lang="less">
.in {
  color: green;
}
.out {
  color: red;
}
.no {
  color: blue;
}
</style>
