<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <!-- :model="queryParam" -->
      <a-form name="Search" layout="inline" autocomplete="off" style="margin-bottom: 14px" @submit="doSearch">
        <a-form-item label="搜索内容">
          <a-input style="width: 240px" v-model="queryParam.key" placeholder="请输入要搜索的内容"> </a-input>
        </a-form-item>
        <!-- <a-form-item label="时间">
          <a-date-picker v-model="queryParam.startdate" @change="startChange"/>~<a-date-picker v-model="queryParam.enddate" @change="endChange"/>
        </a-form-item> -->
        <a-form-item>
          <a-button htmlType="submit" :disabled="disabledSearch" type="primary" @click="doSearch">查询</a-button>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" icon="plus" @click="handleAdd" :disabled="!$verify('107015')">新建配置</a-button>
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
        <template slot="logo" slot-scope="text, record">
          <img :src="imgUrl(record.logo)" alt="" width="64" height="64" />
        </template>

        <template slot="blockweb" slot-scope="text, record">
          <a class="layui-blue" :href="record.blockweb" target="_blank">{{ record.blockweb }}</a>
        </template>

        <template slot="klineType" slot-scope="text, record">
          {{ typeFilter(record.klineType) }}
        </template>

        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="handleEdit(record)" :disabled="!$verify('107016')">编辑</a>
            <a-divider type="vertical" />
            <a @click="handleLangEdit(record)" :disabled="!$verify('107016')">简介设置多语言</a>
            <a-divider type="vertical" />
            <a @click="handleDel(record)" :disabled="!$verify('107014')">删除</a>
          </template>
        </span>
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
        ref="editModal"
        :config="modalConfig"
        :visible="edit.visible"
        :loading="confirmLoading"
        :options="editOptions"
        :model="edit.mdl"
        @cancel="handleCancel"
        @ok="handleEditOk"
      />
    </a-card>
    <CurrencyForm :visible="langVisible" @cancel="langVisible = false" @ok="handleLangEditOk" :langData="langData" />
  </page-header-wrapper>
</template>

<script>
import { STable, Ellipsis, SModal } from '@/components'
import {
  getcurrencyTypeList,
  getCurrencyList,
  delCurrency,
  addCurrency,
  editCurrency,
  selectLangIntro,
  saveLangIntro
} from '@/api/systemsetting'
import { Modal } from 'ant-design-vue'

// import StepByStepModal from './modules/StepByStepModal'
import CurrencyForm from './modules/CurrencyForm'

const columns = [
  {
    title: 'ID',
    dataIndex: 'autoid',
    width: 80
  },
  {
    dataIndex: 'logo',
    title: '图片',
    width: 130,
    scopedSlots: { customRender: 'logo' }
  },
  {
    dataIndex: 'coin',
    title: '名称',
    width: 100
  },
  {
    dataIndex: 'symbol',
    title: '币种全称',
    width: 100
  },
  {
    dataIndex: 'chinaname',
    title: '中文名称',
    width: 100
  },
  {
    dataIndex: 'blockname',
    title: '公链',
    width: 100
  },

  {
    dataIndex: 'number',
    title: '发行总量',
    width: 160
  },
  {
    dataIndex: 'usdt',
    title: '美元市值',
    width: 100
  },
  {
    dataIndex: 'cny',
    title: '人民币市值',
    width: 100
  },
  // {
  //   dataIndex: 'info', title: '币种信息'
  // },
  // {
  //   dataIndex: 'blockweb', title: '区块浏览器', scopedSlots: { customRender: 'blockweb' }
  // },
  {
    dataIndex: 'klineType',
    title: '类型',
    width: 100,
    scopedSlots: { customRender: 'klineType' }
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: 150,

    scopedSlots: { customRender: 'action' }
  }
]
const modalOptions = [
  // { title: 'ID', field: 'autoid', type: 'input', decorator: {}, disabled: true, hidden: true },
  {
    title: '币种名称',
    field: 'coin',
    type: 'input',
    placeholder: '请输入',
    decorator: { rules: [{ required: true, message: '请输入币种名称' }] }
  },
  {
    title: '币种类型',
    field: 'klineType',
    type: 'select',
    options: [],
    decorator: { rules: [{ required: true, message: '请选择币种类型' }] }
  },
  {
    title: '区块浏览器',
    field: 'blockweb',
    type: 'input',
    placeholder: '请输入',
    decorator: { rules: [{ required: true, message: '请输入区块浏览器' }] }
  },
  {
    title: '官网',
    field: 'web',
    type: 'input',
    placeholder: '请输入',
    decorator: { rules: [{ required: true, message: '官网不能为空' }] }
  },
  {
    title: '所属公链',
    field: 'blockname',
    type: 'input',
    placeholder: '请输入',
    decorator: { rules: [{ required: true, message: '所属公链不能为空' }] }
  },
  {
    title: '币种全称',
    field: 'symbol',
    type: 'input',
    placeholder: '请输入',
    decorator: { rules: [{ required: true, message: '币种全称不能为空' }] }
  },
  {
    title: '中文名称',
    field: 'chinaname',
    type: 'input',
    placeholder: '请输入',
    decorator: { rules: [{ required: true, message: '币种中文名称不能为空' }] }
  },

  {
    title: '发行数量',
    field: 'number',
    type: 'number',
    placeholder: '请输入',
    decorator: { rules: [{ required: true, message: '发行数量不能为空' }] }
  },
  {
    title: '美元市值',
    field: 'usdt',
    type: 'number',
    placeholder: '请输入',
    decorator: { rules: [{ required: true, message: '美元市值不能为空' }] }
  },
  {
    title: '人民币市值',
    field: 'cny',
    type: 'number',
    placeholder: '请输入',
    decorator: { rules: [{ required: true, message: '人民币市值不能为空' }] }
  },
  {
    title: '币种logo',
    field: 'logo',
    type: 'image',
    decorator: { rules: [{ required: true, message: '请上传图片' }] }
  },
  {
    title: '币种信息',
    field: 'info',
    type: 'textarea',
    rows: 6,
    placeholder: '请输入',
    decorator: { rules: [{ required: true, message: '币种信息不能为空' }] }
  }
]
const editOptions = [
  { title: 'ID', field: 'autoid', type: 'input', decorator: {}, disabled: true, hidden: true },
  {
    title: '币种名称',
    field: 'coin',
    type: 'input',
    placeholder: '请输入',
    decorator: { rules: [{ required: true, message: '请输入币种名称' }] }
  },
  {
    title: '币种类型',
    field: 'klineType',
    type: 'select',
    options: [],
    decorator: { rules: [{ required: true, message: '请选择币种类型' }] }
  },
  {
    title: '区块浏览器',
    field: 'blockweb',
    type: 'input',
    placeholder: '请输入',
    decorator: { rules: [{ required: true, message: '请输入区块浏览器' }] }
  },
  {
    title: '官网',
    field: 'web',
    type: 'input',
    placeholder: '请输入',
    decorator: { rules: [{ required: true, message: '官网不能为空' }] }
  },
  {
    title: '所属公链',
    field: 'blockname',
    type: 'input',
    placeholder: '请输入',
    decorator: { rules: [{ required: true, message: '所属公链不能为空' }] }
  },
  {
    title: '币种全称',
    field: 'symbol',
    type: 'input',
    placeholder: '请输入',
    decorator: { rules: [{ required: true, message: '币种全称不能为空' }] }
  },
  {
    title: '中文名称',
    field: 'chinaname',
    type: 'input',
    placeholder: '请输入',
    decorator: { rules: [{ required: true, message: '币种中文名称不能为空' }] }
  },

  {
    title: '发行数量',
    field: 'number',
    type: 'number',
    placeholder: '请输入',
    decorator: { rules: [{ required: true, message: '发行数量不能为空' }] }
  },
  {
    title: '美元市值',
    field: 'usdt',
    type: 'number',
    placeholder: '请输入',
    decorator: { rules: [{ required: true, message: '美元市值不能为空' }] }
  },
  {
    title: '人民币市值',
    field: 'cny',
    type: 'number',
    placeholder: '请输入',
    decorator: { rules: [{ required: true, message: '人民币市值不能为空' }] }
  },
  {
    title: '币种logo',
    field: 'logo',
    type: 'image',
    decorator: { rules: [{ required: true, message: '请上传图片' }] }
  },
  {
    title: '币种信息',
    field: 'info',
    type: 'textarea',
    rows: 6,
    placeholder: '请输入',
    decorator: { rules: [{ required: true, message: '币种信息不能为空' }] }
  }
]

export default {
  name: 'CurrencyList',
  components: {
    STable,
    Ellipsis,
    SModal,
    CurrencyForm
  },
  data() {
    // this.columns = columns
    return {
      loading: false,
      columns,
      // create model
      visible: false,
      langVisible: false,
      confirmLoading: false,
      currencyTypeList: [],
      mdl: null,
      langData: [],
      modalOptions,
      roleMenus: [],
      modalConfig: {},
      edit: {
        visible: false,
        mdl: null
      },
      editOptions,
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
    this.getcurrencyTypeList()
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
    typeFilter(type) {
      console.log('===================', type, this.currencyTypeList)
      const obj = this.currencyTypeList.find((v) => v.code === type)
      return obj ? obj.desc : type
    },
    async getcurrencyTypeList() {
      const { data } = await getcurrencyTypeList()
      this.currencyTypeList = data
      const obj = this.modalOptions.find((v) => v.field === 'klineType')
      const obj2 = this.editOptions.find((v) => v.field === 'klineType')
      obj.options = this.currencyTypeList.map((v) => {
        return { title: v.desc, val: v.code }
      })
      obj2.options = obj.options
    },
    handleAdd() {
      // get menu data
      this.roleMenus = []
      this.mdl = null
      this.visible = true
      this.modalConfig['title'] = '新增'
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
      this.edit.visible = true
      this.edit.mdl = { ...record }
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
            if (e === 'info') {
              values['abstract'] = values[e]
            }
          })
          console.log(values)
          if (values.autoid > 0) {
            // 修改 e.g.
            editCurrency(values)
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
            addCurrency(values)
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
            if (e === 'info') {
              values['abstract'] = values[e]
            }
          })
          console.log(values)
          if (values.autoid > 0) {
            // 修改 e.g.
            editCurrency(values)
              .then((res) => {
                console.log(res)
                const { code, msg } = res
                if (code === 0) {
                  this.edit.visible = false
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
          }
        } else {
          this.confirmLoading = false
        }
      })
    },
    handleCancel() {
      this.visible = false
      this.edit.visible = false
      this.confirmLoading = false
      const form = this.$refs.createModal.form
      form.resetFields() // 清理表单数据（可不做）
      const editform = this.$refs.editModal.form
      editform.resetFields() // 清理表单数据（可不做）
      this.roleMenus = []
    },
    handleDel(record) {
      console.log('del', record)
      const username = this.$store.getters.username
      const ts = this
      const delMod = Modal.confirm({
        centered: true,
        maskClosable: true,
        title: '提示信息',
        content: `确定删除【${record.autoid}】的记录？`,
        onOk: () => {
          delCurrency({
            username: username,
            autoid: record.autoid
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
      console.log(this.queryParam)
      this.getData()
    },
    async getData() {
      this.loading = true

      const res = await getCurrencyList(this.queryParam)
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
    },
    async handleLangEdit(data) {
      console.log(data)
      const ret = await selectLangIntro({
        belongTo: 'info',
        type: 'base_currency',
        coin: data.coin
      })
      if (ret.code === 0) {
        this.langData = ret.data
        for (const langData of this.langData) {
          langData.coinId = data.autoid
        }
        this.langVisible = true
      }
    },
    async handleLangEditOk(data) {
      const ret = await saveLangIntro(data)
      if (ret.code === 0) {
        this.langVisible = false
      } else {
        this.$message.error(data.msg)
      }
    }
  }
}
</script>
