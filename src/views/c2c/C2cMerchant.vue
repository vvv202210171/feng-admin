<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <!-- :model="queryParam" -->
      <a-form name="Search" layout="inline" autocomplete="off" style="margin-bottom: 14px" @submit="doSearch">
        <a-form-item label="搜索内容">
          <a-input style="width: 240px" v-model="queryParam.key" placeholder="请输入要搜索的内容"> </a-input>
        </a-form-item>
        <a-form-item label="状态">
          <a-select v-model="queryParam.state" style="width: 120px" allowClear>
            <a-select-option :value="item.val" :key="item.val" v-for="item in merchartStateMapping">{{
              item.title
            }}</a-select-option>
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
        expandRowByClick
      >
        <span slot="state" slot-scope="text, record">
          {{ record.state | merchartStateMappingFormat }}
        </span>

        <span slot="robot" slot-scope="text, record">
          {{ record.robot === 'disable' ? '禁用' : record.robot === 'enable' ? '启用' : record.robot }}
        </span>

        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="handleEdit(record)" :disabled="record.state !== 'verify'">审核</a>
          </template>
        </span>
      </a-table>

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
  </page-header-wrapper>
</template>

<script>
import { STable, Ellipsis, SModal } from '@/components'
import {
  // getRoleList,
  getC2cMerchantList,
  editC2cCoin
} from '@/api/c2c'
import { merchartStateMapping } from '@/utils/const'

// import StepByStepModal from './modules/StepByStepModal'
// import CreateForm from './modules/C2cCoinForm'

const columns = [
  {
    dataIndex: 'autoid',
    title: 'ID',
    width: 50
  },
  {
    dataIndex: 'member',
    title: '账户',
    width: 50
  },

  {
    dataIndex: 'username',
    title: '真实姓名',
    width: 80
  },
  {
    dataIndex: 'coin',
    title: '抵押币种',
    width: 90
  },
  {
    dataIndex: 'number',
    title: '抵押数量',
    width: 80
  },
  {
    dataIndex: 'tel',
    title: '联系电话',
    width: 100
  },
  {
    dataIndex: 'wechat',
    title: '微信',
    width: 100
  },
  {
    dataIndex: 'email',
    title: '邮箱',
    width: 150
  },
  {
    dataIndex: 'writedate',
    title: '创建时间',
    width: 150
  },
  {
    dataIndex: 'state',
    title: '状态',
    width: 50,
    scopedSlots: { customRender: 'state' }
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: 150,

    scopedSlots: { customRender: 'action' }
  }
]
const editOptions = [
  { title: 'ID', field: 'autoid', type: 'input', decorator: {}, disabled: true },
  { title: '账户', field: 'member', type: 'input', placeholder: '请输入账户', disabled: true },
  {
    title: '审核结果',
    field: 'state',
    type: 'select',
    placeholder: '请选择审核结果',
    options: [
      { val: 'enable', title: '通过' },
      { val: 'overrule', title: '驳回' }
    ],
    decorator: { rules: [{ required: true, message: '请选择审核结果' }] }
  },
  { title: '原因', field: 'tag', type: 'input' }
]

export default {
  name: 'C2cCoinList',
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
      // create model
      roleMenus: [],
      modalConfig: {},
      confirmLoading: false,
      merchartStateMapping,
      add: {
        visible: false,
        mdl: null
      },
      edit: {
        visible: false,
        mdl: null
      },
      editOptions,
      // 高级搜索 展开/关闭
      advanced: false,
      // 搜索状态
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
    handleEdit(record) {
      // get menu data
      this.roleMenus = []
      this.edit.visible = true
      this.edit.mdl = { ...record }
      this.modalConfig['title'] = '编辑'
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
            editC2cCoin(values)
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
      this.add.visible = false
      this.edit.visible = false
      this.confirmLoading = false
      const form = this.$refs.addModal.form
      form.resetFields() // 清理表单数据（可不做）
      const editform = this.$refs.editModal.form
      editform.resetFields() // 清理表单数据（可不做）
      this.roleMenus = []
    },

    doSearch() {
      console.log(this.queryParam)
      this.getData()
    },
    async getData() {
      this.loading = true

      const res = await getC2cMerchantList(this.queryParam)
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
