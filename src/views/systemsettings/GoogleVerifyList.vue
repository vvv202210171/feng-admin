<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <!-- :model="queryParam" -->
      <a-form name="Search" layout="inline" autocomplete="off" style="margin-bottom: 14px" @submit="doSearch">
        <a-form-item label="搜索内容">
          <a-input style="width: 240px" v-model="queryParam.key" placeholder="请输入要搜索的内容"> </a-input>
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
        <template slot="googleUrl" slot-scope="text, record">
          <ImagePreview
            :imageUrl="generateQRCode(record.googleUrl)"
            :title="record.username + '的谷歌验证器'"
          ></ImagePreview>
          <!-- <p>{{ record.googleUrl }}</p> -->
        </template>

        <template slot="googleUrlFont" slot-scope="text, record">
          <p>{{ record.googleUrl }}</p>
        </template>

        <template slot="is_bind" slot-scope="text, record">
          <span v-if="record.is_bind === '1'" style="color: #eb1345">未绑定</span>
          <span v-else>已绑定</span>
        </template>

        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="handleChange(record)" :disabled="!$verify('107018')">{{
              record.is_bind === '1' ? '绑定密钥' : '更换密钥'
            }}</a>
            <!-- <a @click="handleEdit(record)">编辑</a>
            <a-divider type="vertical" />
            <a @click="handleDel(record)">删除</a> -->
          </template>
        </span>
      </a-table>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { STable, Ellipsis } from '@/components'
import ImagePreview from '@/components/ImagePreview'
import {
  // getRoleList,
  getGoogleList,
  // delUserLevel,
  // addUserLevel,
  // editUserLevel
  bindGoogleVerify
} from '@/api/systemsetting'
import { Modal } from 'ant-design-vue'
import QRCode from 'qrcode-generator'
// import StepByStepModal from './modules/StepByStepModal'
// import CreateForm from './modules/GoogleVerifyListForm'

const columns = [
  {
    title: 'ID',
    dataIndex: 'autoid',
    width: 80
  },
  {
    dataIndex: 'username',
    title: '用户名',
    width: 110
  },
  {
    dataIndex: 'secretKey',
    title: '密钥key',
    width: 200
  },
  {
    dataIndex: 'host',
    title: 'google用户名',
    width: 120
  },
  {
    dataIndex: 'googleUrl',
    title: '二维码',
    width: 180,
    scopedSlots: { customRender: 'googleUrl' }
  },
  {
    dataIndex: 'googleUrlFont',
    title: '二维码地址',
    width: 280,
    scopedSlots: { customRender: 'googleUrlFont' }
  },
  {
    dataIndex: 'is_bind',
    title: '绑定',
    width: 180,
    scopedSlots: { customRender: 'is_bind' }
  },
  {
    dataIndex: 'update_date',
    title: '创建时间',
    width: 160
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: 100,
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'CoinList',
  components: {
    STable,
    Ellipsis,
    ImagePreview
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
    handleChange(record) {
      // console.log(bindGoogleVerify)
      const ts = this
      const newBind = record.is_bind === '1' ? '0' : '2'
      const confirmTitle = record.is_bind === '1' ? '绑定' : '刷新'
      const delMod = Modal.confirm({
        centered: true,
        maskClosable: true,
        title: '提示信息',
        content: `确定${confirmTitle}编号为【${record.autoid}】的记录？`,
        onOk: () => {
          const username = this.$store.getters.username

          bindGoogleVerify({
            username,
            user_name: record.username,
            autoid: record.autoid,
            is_bind: newBind
          }).then((res) => {
            console.log(res)
            ts.getData()
            delMod.destroy()
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
      //       editUserLevel(values)
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
      //       // addUserLevel(values)
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
    generateQRCode(text) {
      const typeNumber = 8
      const errorCorrectionLevel = 'L'
      const qr = QRCode(typeNumber, errorCorrectionLevel)
      qr.addData(text)
      qr.make()
      const imgSrc = qr.createDataURL()
      return imgSrc
    },
    handleCancel() {
      this.visible = false
      this.confirmLoading = false
      const form = this.$refs.createModal.form
      form.resetFields() // 清理表单数据（可不做）
      this.roleMenus = []
    },
    handleDel(record) {
      // // const ts = this
      // // const delMod =
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
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    doSearch() {
      this.getData()
    },
    async getData() {
      this.loading = true

      const res = await getGoogleList(this.queryParam)
      const { code, data, count } = res
      if (code === '0') {
        this.loadData = data
        this.pagination.total = count
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