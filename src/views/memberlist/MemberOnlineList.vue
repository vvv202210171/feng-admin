<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <!-- :model="queryParam" -->
      <a-form name="adminSearch" layout="inline" autocomplete="off" style="margin-bottom: 14px" @submit="doSearch">
        <a-form-item label="搜索内容">
          <a-input style="width: 240px" v-model="queryParam.key" placeholder="请输入要搜索的内容"> </a-input>
        </a-form-item>
        <a-form-item label="代理">
          <a-input style="width: 240px" v-model="queryParam.parentVal" placeholder="请输入要搜索的内容"> </a-input>
        </a-form-item>
        <a-form-item>
          <a-button htmlType="submit" :disabled="disabledSearch" type="primary" @click="doSearch">查询</a-button>
        </a-form-item>
        <a-form-item style="float: right" class="flex">
          <a-button type="danger" @click="freezeUserFlash" style="float: right">刷新剔除冻结用户</a-button></a-form-item
        >
      </a-form>

      <a-table
        ref="table"
        size="default"
        row-key="autoid"
        :scroll="{ x: 980 }"
        bordered
        :loading="loading"
        :columns="columns"
        :dataSource="loadData"
        :pagination="pagination"
      >
        <span slot="currAccessHost" slot-scope="text, record">
          <p>{{ record.loginTerminal }}</p>
          <p>{{ record.currAccessHost }}</p>
        </span>
        <span slot="ip" slot-scope="text, record">
          <p>{{ record.currAccessIp }}</p>
          <p>{{ record.currAccessAddress }}</p>
        </span>
        <span slot="action" slot-scope="text, record">
          <template>
            <!-- v-if="username === 'admin'"  v-if="username === 'admin' && record.username !== 'admin'" -->
            <a @click="handleTick(record)" :disabled="!$verify('107023')">踢掉</a>
          </template>
        </span>
      </a-table>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import moment from 'moment'
import { STable, Ellipsis } from '@/components'
import {
  // getRoleList,
  getUserOnLineList,
  tickUser,
  freezeUserFlash
} from '@/api/members'
import config from '@/config/defaultSettings'
import { Modal } from 'ant-design-vue'

//
// 序号	账号	真实姓名
//	登录终端本次使用线路
// 	本次访问IP
// 本次访问地址	登录时间	终端详情	操作
const columns = [
  {
    title: 'ID',
    dataIndex: 'autoid',
    width: 80
  },
  {
    title: '账号',
    dataIndex: 'member',
    width: 80
  },
  {
    title: '代理',
    dataIndex: 'parent',
    width: 80
  },
  {
    title: '电话',
    dataIndex: 'tel',
    width: 80
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    width: 80
  },
  {
    title: '用户名',
    dataIndex: 'username',
    width: 100
  },
  {
    title: '登录终端(线路)',
    dataIndex: 'currAccessHost',
    width: 150,
    scopedSlots: { customRender: 'currAccessHost' }
  },
  {
    title: 'IP',
    dataIndex: 'ip',
    width: 150,
    scopedSlots: { customRender: 'ip' }
  },
  {
    title: '终端详情',
    dataIndex: 'loginTerminalDetail',
    width: 240
  },
  {
    title: '登录时间',
    dataIndex: 'loginTime',
    width: 100
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: 60,
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'MemberOnlineList',
  components: {
    STable,
    Ellipsis
    // StepByStepModal
  },
  data() {
    // this.columns = columns
    return {
      version: config.version, // 接口版本
      username: null,
      loading: false,
      columns,
      rolesArr: [],
      targetsArr: [],
      // create model
      visible: false,
      confirmLoading: false,
      visibleChangeCode: false,
      mdl: null,
      changePwdModel: null,
      roleMenus: {},
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
    this.username = this.$store.getters.username
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
    async freezeUserFlash() {
      const ret = await freezeUserFlash()
      const { code } = ret
      if (code === 0) {
        this.$message.success('操作成功')
        this.doSearch()
      }
    },
    // 获取权限
    async getRoles(record) {
      this.targetsArr = []
      this.rolesArr = []
      this.roleMenus = {}
      if (this.version === '1.0') {
        await this.getMenus(record)
      } else {
        await this.getMenus2(record)
      }
    },
    handleTick(record) {
      console.log('del', record)
      const ts = this
      const delMod = Modal.confirm({
        centered: true,
        maskClosable: true,
        title: '提示信息',
        content: `确定要踢掉【${record.member}】吗？`,
        onOk: () => {
          tickUser({
            token: record.token
          }).then((res) => {
            console.log(res)
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
      this.pagination.page = 1
      this.getData()
    },
    async getData() {
      this.loading = true
      const { current, pageSize } = this.pagination
      this.queryParam.page = current
      this.queryParam.limit = pageSize
      const res = await getUserOnLineList(this.queryParam)
      const { code, data } = res
      if (code == '0') {
        this.loadData = data.records
        this.pagination.total = data.total
        this.issuper1 = data.searchCount
      } else {
        console.log(res)
      }
      setTimeout(() => {
        this.loading = false
      }, 800)
    },
    resetSearchForm() {
      this.queryParam = {
        date: moment(new Date())
      }
    }
  }
}
</script>
