<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <!-- :model="queryParam" -->
      <a-form name="Search" layout="inline" autocomplete="off" style="margin-bottom: 14px" @submit="doSearch">
        <a-form-item label="搜索内容">
          <a-input style="width: 240px" v-model="queryParam.key" placeholder="请输入要搜索的内容"> </a-input>
        </a-form-item>
        <a-form-item label="状态">
          <a-select style="width: 100px" v-model="queryParam.state">
            <a-select-option value=""> 请选择 </a-select-option>
            <a-select-option v-for="item in enteustStatusMapping" :value="item.val" :key="item.val">
              {{ item.title }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="方向">
          <a-select style="width: 100px" v-model="queryParam.type">
            <a-select-option value=""> 请选择 </a-select-option>
            <a-select-option v-for="item in typeMapping" :value="item.val" :key="item.val">
              {{ item.title }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="方式">
          <a-select style="width: 100px" v-model="queryParam.style">
            <a-select-option value=""> 请选择 </a-select-option>
            <a-select-option v-for="item in styleMapping" :value="item.val" :key="item.val">
              {{ item.title }}
            </a-select-option>
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
        <a-button type="primary" icon="plus" @click="handleAdd">新建</a-button>
      </div> -->

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
        <span slot="state" slot-scope="text, record">
          {{ record.state | enteustStatusMappingFormat }}
        </span>

        <span slot="type" slot-scope="text, record">
          {{ record.type | typeMappingFormat }}
        </span>

        <span slot="style" slot-scope="text, record">
          {{ record.style | styleMappingFormat }}
        </span>

        <span slot="action" slot-scope="text, record">
          <template>
            <div v-if="record.state === 'all' || record.state === 'cancel'">
              <span>直接成交</span>
              <a-divider type="vertical" />
              <span>撤单</span>
            </div>
            <div v-else>
              <a @click="handleDirectTrad(record)" :disabled="!$verify('105022')">直接成交</a>
              <a-divider type="vertical" />
              <a @click="handleCancelEntrust(record)" :disabled="!$verify('105023')">撤单</a>
            </div>
            <!-- <a @click="handleDel(record)">删除</a> -->
          </template>
        </span>
      </a-table>

      <create-form
        ref="createModal"
        :visible="visible"
        :loading="confirmLoading"
        :roles="roleMenus"
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
  directTrad,
  cancelEntrust,
  getTradEntrustList
} from '@/api/trad'
import { Modal } from 'ant-design-vue'
import { enteustStatusMapping, styleMapping, typeMapping } from '@/utils/const'
// import StepByStepModal from './modules/StepByStepModal'
import CreateForm from './modules/TradEntrustForm'

const columns = [
  {
    dataIndex: 'autoid',
    title: 'ID',
    width: 80
  },
  {
    dataIndex: 'member',
    title: '账号',
    width: 100
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
    title: '委托数量',
    width: 100
  },
  {
    dataIndex: 'price',
    title: '委托价',
    width: 100
  },
  {
    dataIndex: 'state',
    title: '状态',
    width: 100,
    scopedSlots: { customRender: 'state' }
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
    width: 100
  },
  {
    dataIndex: 'unfilledgas',
    title: '未成交书续费',
    width: 150
  },
  {
    dataIndex: 'completedgas',
    title: '已成交手续费',
    width: 150
  },
  {
    dataIndex: 'writedate',
    title: '时间',
    width: 110
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: 150,
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'TradEntrustList',
  components: {
    STable,
    Ellipsis,
    CreateForm
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
      enteustStatusMapping: enteustStatusMapping,
      styleMapping: styleMapping,
      typeMapping: typeMapping,
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
        type: '',
        style: '',
        state: ''
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
  },
  methods: {
    handleDirectTrad(record) {
      const ts = this
      const mod = Modal.confirm({
        centered: true,
        maskClosable: true,
        title: '提示信息',
        content: `确定成交【${record.autoid}】的记录？`,
        onOk: () => {
          directTrad({
            autoid: record.autoid
          }).then((res) => {
            // console.log(res)
            const { code, msg } = res
            if (code === 0) {
              this.$message.success('成功')
            } else {
              this.$message.error(msg)
            }
            ts.getData()
            mod.destroy()
          })
        },
        onCancel() {}
      })
    },
    handleCancelEntrust(record) {
      const ts = this
      const mod = Modal.confirm({
        centered: true,
        maskClosable: true,
        title: '提示信息',
        content: `确定撤销【${record.autoid}】的记录？`,
        onOk: () => {
          cancelEntrust({
            autoid: record.autoid,
            member: record.member
          }).then((res) => {
            // console.log(res)
            const { code, msg } = res
            if (code === 0) {
              this.$message.success('撤销成功')
            } else {
              this.$message.error(msg)
            }
            ts.getData()
            mod.destroy()
          })
        },
        onCancel() {}
      })
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
      this.visible = true
      this.mdl = { ...record }
    },
    handleOk() {
      // const form = this.$refs.createModal.form
      // const username = this.$store.getters.username
      // this.confirmLoading = true
      // form.validateFields((errors, values) => {
      //   if (!errors) {
      //     // 添加username
      //     values = {
      //       ...values,
      //       username
      //     }
      //     Object.keys(values).map(e => {
      //       if (values[e] === undefined) {
      //         values[e] = ''
      //       }
      //     })
      //     console.log(values)
      //     if (values.autoid > 0) {
      //       // 修改 e.g.
      //       editMember(values)
      //         .then(res => {
      //           console.log(res)
      //           this.visible = false
      //           this.confirmLoading = false
      //           // 重置表单数据
      //           form.resetFields()
      //           // 刷新表格
      //           // this.$refs.table.refresh()
      //           this.getData()
      //           this.$message.success('修改成功')
      //         })
      //     } else {
      //       // 新增
      //       // addMember(values)
      //       //   .then(res => {
      //       //     console.log(res)
      //       //     this.visible = false
      //       //     this.confirmLoading = false
      //       //     // 重置表单数据
      //       //     form.resetFields()
      //       //     // 刷新表格
      //       //     // this.$refs.table.refresh()
      //       //     this.getData()
      //       //     this.$message.success('新增成功')
      //       //   })
      //     }
      //   } else {
      //     this.confirmLoading = false
      //   }
      // })
    },
    handleCancel() {
      this.visible = false
      this.confirmLoading = false
      const form = this.$refs.createModal.form
      form.resetFields() // 清理表单数据（可不做）
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
    // onSelectChange (selectedRowKeys, selectedRows) {
    //   this.selectedRowKeys = selectedRowKeys
    //   this.selectedRows = selectedRows
    // },
    doSearch() {
      this.getData()
    },
    async getData() {
      this.loading = true

      const res = await getTradEntrustList(this.queryParam)
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
