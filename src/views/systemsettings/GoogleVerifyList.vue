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

      <a-table ref="table" size="default" row-key="autoid" :loading="loading" :scroll="{ x: 980 }" bordered
        :columns="columns" :dataSource="loadData" :pagination="pagination">
        <template slot="googleurl" slot-scope="text, record">
          <ImagePreview :imageUrl="generateQRCode(record.googleurl)" :title="record.username + '的谷歌验证器'"></ImagePreview>
          <!-- <p>{{ record.googleurl }}</p> -->
        </template>

        <template slot="googleurlFont" slot-scope="text, record">
          <p>{{ record.googleurl }}</p>
        </template>

        <template slot="isBind" slot-scope="text, record">
          <span v-if="record.isBind === '1'" style="color: #eb1345">未绑定</span>
          <span v-else>已绑定</span>
        </template>

        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="handleChange(record)" :disabled="!$verify('107018')">{{
              record.isBind === '1' ? '绑定密钥' : '更换密钥'
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
    dataIndex: 'id',
    width: 80
  },
  {
    dataIndex: 'username',
    title: '用户名',
    width: 110
  },
  {
    dataIndex: 'secretkey',
    title: '密钥key',
    width: 200
  },
  {
    dataIndex: 'host',
    title: 'google用户名',
    width: 120
  },
  {
    dataIndex: 'googleurl',
    title: '二维码',
    width: 180,
    scopedSlots: { customRender: 'googleurl' }
  },
  {
    dataIndex: 'googleurlFont',
    title: '二维码地址',
    width: 280,
    scopedSlots: { customRender: 'googleurlFont' }
  },
  {
    dataIndex: 'isBind',
    title: '绑定',
    width: 180,
    scopedSlots: { customRender: 'isBind' }
  },
  {
    dataIndex: 'writedate',
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
      const ts = this
      const newBind = record.isBind === '1' ? '0' : '2'
      const confirmTitle = record.isBind === '1' ? '绑定' : '刷新'
      const delMod = Modal.confirm({
        centered: true,
        maskClosable: true,
        title: '提示信息',
        content: `确定${confirmTitle}编号为【${record.username}】的记录？`,
        onOk: () => {
          bindGoogleVerify({
            id: record.id,
            isBind: newBind
          }).then((res) => {
            if (res.code !== 0) {
              this.$message.error()
            }
            ts.getData()
            delMod.destroy()
          })
        },
        onCancel() { }
      })
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