<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <!-- :model="queryParam" -->
      <a-form name="Search" layout="inline" autocomplete="off" style="margin-bottom: 14px" @submit="doSearch">
        <a-form-item label="搜索内容">
          <a-input style="width: 240px" v-model="queryParam.key" placeholder="请输入要搜索的内容" />
        </a-form-item>
        <a-form-item label="时间">
          <a-date-picker v-model="queryParam.startdate" @change="startChange" />~<a-date-picker
            v-model="queryParam.enddate"
            @change="endChange"
          />
        </a-form-item>
        <a-form-item>
          <a-button htmlType="submit" :disabled="disabledSearch" type="primary" @click="doSearch">查询 </a-button>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" icon="plus" @click="handleAdd" :disabled="!$verify('1130013')">新建 </a-button>
        </a-form-item>
      </a-form>

      <a-table
        ref="table"
        size="default"
        row-key="id"
        :loading="loading"
        :scroll="{ x: 980 }"
        bordered
        :columns="columns"
        :dataSource="loadData"
        :pagination="pagination"
        expandRowByClick
      >
        <!-- <span slot="serial" slot-scope="text, record, index">
          {{ index + 1 }}
        </span> -->
        <span slot="difDay" slot-scope="text, record">
          {{
            record.difDay > 0
              ? '还有' + record.difDay + '天'
              : record.difDay === 0
              ? '今日上市'
              : '已上市' + Math.abs(record.difDay) + '天'
          }}
        </span>
        <template slot="state" slot-scope="text, record">
          <span v-if="record.state === '0'" style="color: #eb1345">关闭</span>
          <span v-else>开启</span>
        </template>
        <template slot="imgUrl" slot-scope="text, record">
          <a :href="imgUrl(record.imgUrl)" target="_blank" style="height: 100px; display: inline-block">
            <img :src="imgUrl(record.imgUrl)" width="100%" height="100%" />
          </a>
        </template>
        <span slot="status" slot-scope="text, record">
          {{ formatStatus(record.status) }}
        </span>

        <span slot="action" slot-scope="text, record">
          <template>
            <a :disabled="!$verify('1130014')" @click="handleEdit(record)">编辑</a>
            <a-divider type="vertical" />
            <a :disabled="!$verify('1130012')" @click="handleDel(record)">删除</a>
            <a-divider type="vertical" />
            <a-dropdown>
              <a class="ant-dropdown-link" @click.prevent> 多语言设置 <a-icon type="down" /> </a>
              <a-menu slot="overlay">
                <a-menu-item>
                  <a @click="showLang('title', record)">标题</a>
                </a-menu-item>
                <a-menu-item>
                  <a @click="showLang('remarks', record)">描述</a>
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </template>
        </span>
        <p slot="expandedRowRender" slot-scope="record" style="margin: 0">
          <a-card title="详情">
            <a-card-grid v-for="(key, index) in columns2" :key="index" style="width: 25%">
              <span>{{ key.title }} </span>:
              <span v-if="key.dataIndex == 'difDay'">
                {{
                  record.difDay > 0
                    ? '还有' + record.difDay + '天'
                    : record.difDay === 0
                    ? '今日上市'
                    : '已上市' + Math.abs(record.difDay) + '天'
                }}
              </span>
              <span v-else-if="key.dataIndex == 'state'">
                <span v-if="record.state === '0'" style="color: #eb1345">关闭</span>
                <span v-else>开启</span>
              </span>
              <span v-else-if="key.dataIndex == 'imgUrl'">
                <a :href="imgUrl(record.imgUrl)" target="_blank" style="height: 100px; display: inline-block">
                  <img :src="imgUrl(record.imgUrl)" width="100%" height="100%" />
                </a>
              </span>
              <span v-else-if="key.dataIndex == 'status'">
                {{
                  record.status === '0'
                    ? '未公告'
                    : record.status === '1'
                    ? '已公告'
                    : record.status === '2'
                    ? '认购中'
                    : record.status === '3'
                    ? '已上市'
                    : record.status === '4'
                    ? '已结束'
                    : ''
                }}
              </span>
              <template v-else>
                <span>{{ record[key.dataIndex] }}</span>
              </template>
            </a-card-grid>
          </a-card>
        </p>
      </a-table>

      <s-modal
        ref="addModal"
        :config="modalConfig"
        :visible="add.visible"
        :loading="confirmLoading"
        :options="addOrderOptions"
        :model="add.mdl"
        @cancel="handleCancel"
        @ok="handleAddOk"
      />

      <s-modal
        ref="editModal"
        :config="modalConfig"
        :visible="edit.visible"
        :loading="confirmLoading"
        :options="editOrderOptions"
        :model="edit.mdl"
        @cancel="handleCancel"
        @ok="handleEditOk"
      />
      <info-form
        :type="type"
        :visible="langVisible"
        :langData="langData"
        @ok="saveLang"
        @cancel="langVisible = false"
      ></info-form>
    </a-card>
  </page-header-wrapper>
</template>

<script>
// import moment from 'moment'
import { STable, Ellipsis, SModal } from '@/components'
import {
  // getRoleList,
  getActList,
  delAct,
  addAct,
  editAct
} from '@/api/activity'
import { Modal } from 'ant-design-vue'
import moment from 'moment/moment'
import InfoForm from './components/InfoForm.vue'
import {
  // getRoleList,
  selectLangIntro,
  saveLangIntro
} from '@/api/systemsetting'
// import StepByStepModal from './modules/StepByStepModal'
// import CreateForm from './modules/TradCoinForm'
const columns = [
  {
    dataIndex: 'id',
    title: 'ID',
    width: 100
  },
  {
    dataIndex: 'title',
    title: '标题',
    width: 80
  },
  {
    dataIndex: 'coin',
    title: '币种',
    width: 80
  },
  {
    dataIndex: 'min',
    title: '最小购买数量',
    width: 80
  },
  {
    dataIndex: 'issuePrice',
    title: '发行价格',
    width: 80
  },
  {
    dataIndex: 'winRate',
    title: '中签率%',
    width: 80
  },

  {
    dataIndex: 'issueNum',
    title: '发行数量',
    width: 80
  },
  {
    dataIndex: 'surplusNum',
    title: '剩余数量',
    width: 80
  },
  {
    dataIndex: 'progress',
    title: '进度百分比（%s）',
    width: 80
  },
  {
    dataIndex: 'difDay',
    title: '上市倒计时天数',
    width: 120,
    scopedSlots: { customRender: 'difDay' }
  },
  {
    dataIndex: 'h24Per',
    title: '24H涨跌幅%',
    width: 80
  },
  {
    dataIndex: 'd30RangePer',
    title: '30天涨跌幅%',
    width: 80
  },
  {
    dataIndex: 'state',
    title: '启用状态',
    width: 100,
    scopedSlots: { customRender: 'state' }
  },
  {
    dataIndex: 'status',
    title: '活动状态',
    width: 100,
    scopedSlots: { customRender: 'status' }
  },
  {
    dataIndex: 'imgUrl',
    title: '宣传图',
    width: 150,
    scopedSlots: { customRender: 'imgUrl' }
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
    dataIndex: 'id',
    title: 'ID',
    width: 100
  },
  {
    dataIndex: 'title',
    title: '标题',
    width: 80
  },
  {
    dataIndex: 'coin',
    title: '币种',
    width: 80
  },
  {
    dataIndex: 'min',
    title: '最小购买数量',
    width: 120
  },
  {
    dataIndex: 'issuePrice',
    title: '发行价格',
    width: 95
  },
  {
    dataIndex: 'yesterdayPrice',
    title: '昨日价格',
    width: 95
  },
  {
    dataIndex: 'currentPrice',
    title: '当前价格',
    width: 95
  },
  {
    dataIndex: 'issueNum',
    title: '发行数量',
    width: 130
  },
  {
    dataIndex: 'surplusNum',
    title: '剩余数量',
    width: 130
  },
  {
    dataIndex: 'difDay',
    title: '上市倒计时天数',
    width: 150,
    scopedSlots: { customRender: 'difDay' }
  },
  {
    dataIndex: 'h24Range',
    title: '24涨幅设置',
    width: 130
  },
  {
    dataIndex: 'h24Per',
    title: '24H涨跌幅%',
    width: 135
  },
  {
    dataIndex: 'd30RangePer',
    title: '30天涨跌幅%',
    width: 130
  },
  {
    dataIndex: 'state',
    title: '启用状态',
    width: 100,
    scopedSlots: { customRender: 'state' }
  },
  {
    dataIndex: 'status',
    title: '活动状态',
    width: 100,
    scopedSlots: { customRender: 'status' }
  },
  {
    dataIndex: 'noticeDate',
    title: '公告时间',
    width: 155
  },
  {
    dataIndex: 'startBuyDate',
    title: '认购开始时间',
    width: 140
  },
  {
    dataIndex: 'upDate',
    title: '上市时间',
    width: 140
  },
  {
    dataIndex: 'closeDate',
    title: '活动关闭时间',
    width: 155
  },
  {
    dataIndex: 'updateDate',
    title: '更新时间',
    width: 130
  },
  {
    dataIndex: 'updateby',
    title: '操作人',
    width: 90
  },
  {
    dataIndex: 'imgUrl',
    title: '宣传图',
    width: 150,
    scopedSlots: { customRender: 'imgUrl' }
  }
]
const addOrderOptions = [
  {
    title: '标题',
    field: 'title',
    type: 'input',
    span: 8,
    placeholder: '请选择标题',
    decorator: { rules: [{ required: true, message: '请选择标题' }] }
  },
  {
    title: '币种',
    field: 'coin',
    type: 'select-currency',
    span: 8,
    placeholder: '请选择',
    decorator: { rules: [{ required: true, message: '请选择币种' }] }
  },
  {
    title: '发行价格',
    field: 'issuePrice',
    type: 'number',
    span: 8,
    placeholder: '请输入',
    decorator: { rules: [{ required: true, message: '请输入发行价格' }] }
  },
  {
    title: '当前价格',
    field: 'currentPrice',
    type: 'number',
    span: 8,
    placeholder: '请输入',
    decorator: { rules: [{ required: true, message: '请输入交易当前价格' }] }
  },
  {
    title: '发行数量',
    field: 'issueNum',
    type: 'number',
    span: 8,
    placeholder: '请输入',
    decorator: { rules: [{ required: true, message: '请输入发行数量' }] }
  },
  {
    title: '最小购买数量',
    field: 'min',
    span: 8,
    type: 'number',
    placeholder: '请输入',
    labelCol: { xs: { span: 12 }, sm: { span: 8 } },
    decorator: {
      rules: [{ required: true, message: '请输入交易最小购买数量' }]
    }
  },
  {
    title: '中签率',
    field: 'winRate',
    span: 8,
    type: 'number',
    placeholder: '请输入中签率',
    decorator: {
      rules: [{ required: true, message: '请输入中签率' }]
    }
  },
  {
    title: '活动开关',
    field: 'state',
    type: 'select',
    span: 8,
    placeholder: '请选择',
    options: [
      { val: '0', title: '禁用' },
      { val: '1', title: '启用' }
    ],
    decorator: { rules: [{ required: true, message: '请选择活动开关' }] }
  },

  {
    title: '公告时间',
    field: 'noticeDate',
    type: 'timer',
    span: 8,
    placeholder: 'yyyy-MM-dd HH:mm:ss',
    decorator: { rules: [{ required: true, message: '请输入公告时间' }] }
  },
  {
    title: '认购时间',
    field: 'startBuyDate',
    type: 'timer',
    span: 8,
    placeholder: 'yyyy-MM-dd HH:mm:ss',
    decorator: { rules: [{ required: true, message: '请输入认购开始时间' }] }
  },
  {
    title: '上市时间',
    field: 'upDate',
    type: 'timer',
    span: 8,
    placeholder: 'yyyy-MM-dd HH:mm:ss',
    decorator: { rules: [{ required: true, message: '请输入上市时间' }] }
  },
  {
    title: '结束时间',
    field: 'closeDate',
    type: 'timer',
    span: 8,
    placeholder: 'yyyy-MM-dd HH:mm:ss',
    decorator: { rules: [{ required: true, message: '请输入结束时间' }] }
  },
  {
    title: '24小时涨幅设置',
    field: 'h24Range',
    type: 'number',
    span: 12,
    placeholder: '请输入',
    decorator: { rules: [{ required: true, message: '请输入24小时涨幅设置' }] }
  },
  {
    title: '宣传图',
    field: 'imgUrl',
    type: 'image',
    span: 8,
    decorator: { rules: [{ required: true, message: '请输入宣传图' }] }
  },
  {
    title: '描述',
    field: 'remarks',
    type: 'textarea',
    rows: 18,
    labelCol: { xs: { span: 12 }, sm: { span: 2 } },
    placeholder: '请输入描述',
    decorator: { rules: [{ required: true, message: '请输入描述' }] }
  }
]
const editOrderOptions = [
  {
    title: 'ID',
    field: 'id',
    type: 'input',
    decorator: {},
    disabled: true,
    hidden: true
  },
  {
    title: '标题',
    field: 'title',
    type: 'input',
    span: 8,
    placeholder: '请选择标题',
    decorator: { rules: [{ required: true, message: '请选择标题' }] }
  },
  {
    title: '币种',
    field: 'coin',
    type: 'select-currency',
    span: 8,
    placeholder: '请选择',
    decorator: { rules: [{ required: true, message: '请选择币种' }] }
  },
  {
    title: '发行价格',
    field: 'issuePrice',
    type: 'number',
    span: 8,
    labelCol: { xs: { span: 12 }, sm: { span: 8 } },
    placeholder: '请输入',
    decorator: { rules: [{ required: true, message: '请输入发行价格' }] }
  },
  {
    title: '当前价格',
    field: 'currentPrice',
    type: 'number',
    span: 8,
    placeholder: '请输入',
    decorator: { rules: [{ required: true, message: '请输入交易当前价格' }] }
  },
  {
    title: '发行数量',
    field: 'issueNum',
    type: 'number',
    span: 8,
    placeholder: '请输入',
    decorator: { rules: [{ required: true, message: '请输入发行数量' }] }
  },
  {
    title: '最小购买数量',
    field: 'min',
    span: 8,
    type: 'number',
    placeholder: '请输入',
    labelCol: { xs: { span: 12 }, sm: { span: 8 } },
    decorator: {
      rules: [{ required: true, message: '请输入交易最小购买数量' }]
    }
  },
  {
    title: '剩余数量',
    field: 'surplusNum',
    type: 'number',
    span: 8,
    placeholder: '请输入',
    decorator: { rules: [{ required: true, message: '请输入剩余数量' }] }
  },
  {
    title: '中签率',
    field: 'winRate',
    span: 8,
    type: 'number',
    placeholder: '请输入中签率',
    decorator: {
      rules: [{ required: true, message: '请输入中签率' }]
    }
  },

  {
    title: '活动开关',
    field: 'state',
    type: 'select',
    span: 8,
    placeholder: '请选择',
    options: [
      { val: '0', title: '禁用' },
      { val: '1', title: '启用' }
    ],
    decorator: { rules: [{ required: true, message: '请选择活动开关' }] }
  },

  {
    title: '公告时间',
    field: 'noticeDate',
    type: 'timer',
    span: 8,
    placeholder: 'yyyy-MM-dd HH:mm:ss',
    decorator: { rules: [{ required: true, message: '请输入公告时间' }] }
  },
  {
    title: '认购时间',
    field: 'startBuyDate',
    type: 'timer',
    span: 8,
    placeholder: 'yyyy-MM-dd HH:mm:ss',
    decorator: { rules: [{ required: true, message: '请输入认购开始时间' }] }
  },
  {
    title: '上市时间',
    field: 'upDate',
    type: 'timer',
    span: 8,
    placeholder: 'yyyy-MM-dd HH:mm:ss',
    decorator: { rules: [{ required: true, message: '请输入上市时间' }] }
  },
  {
    title: '结束时间',
    field: 'closeDate',
    type: 'timer',
    span: 8,
    placeholder: 'yyyy-MM-dd HH:mm:ss',
    decorator: { rules: [{ required: true, message: '请输入结束时间' }] }
  },
  {
    title: '24小时涨幅设置',
    field: 'h24Range',
    type: 'number',
    span: 12,
    labelCol: { xs: { span: 12 }, sm: { span: 6 } },
    placeholder: '请输入',
    decorator: { rules: [{ required: true, message: '请输入24小时涨幅设置' }] }
  },
  {
    title: '宣传图',
    field: 'imgUrl',
    type: 'image',
    span: 8,

    placeholder: 'yyyy-MM-dd HH:mm:ss',
    decorator: { rules: [{ required: true, message: '请输入结束时间' }] }
  },
  {
    title: '描述',
    field: 'remarks',
    type: 'textarea',
    rows: 18,
    labelCol: { xs: { span: 12 }, sm: { span: 2 } },
    placeholder: '请输入描述',
    decorator: { rules: [{ required: true, message: '请输入描述' }] }
  }
]

export default {
  name: 'ActList',
  components: {
    STable,
    Ellipsis,
    SModal,
    InfoForm
  },
  data() {
    // this.columns = columns
    return {
      loading: false,
      columns,
      columns2,
      type: '',
      langData: [],
      langVisible: false,
      // create model
      confirmLoading: false,
      roleMenus: [],
      modalConfig: {},
      add: {
        visible: false,
        mdl: null
      },
      addOrderOptions,
      edit: {
        visible: false,
        mdl: null
      },
      editOrderOptions,
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
        pageSize: 10,
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
    }
  },
  created() {
    // getRoleList({ t: new Date() })
    this.getData()
  },

  methods: {
    formatStatus(s) {
      return this.getDesc('ActivityStatusEnum', s)
    },
    handleAdd() {
      // get menu data
      this.roleMenus = []
      this.add.mdl = null
      this.add.visible = true
      this.modalConfig['title'] = '新增'
    },
    startChange(date, dateString) {
      this.queryParam.startdate = dateString
    },
    endChange(date, dateString) {
      this.queryParam.enddate = dateString
    },
    handleEdit(record) {
      this.roleMenus = []
      this.edit.visible = true
      const mdl = { ...record }
      mdl.noticeDate = moment(record.noticeDate, 'YYYY-MM-DD HH:mm')
      mdl.startBuyDate = moment(record.startBuyDate, 'YYYY-MM-DD HH:mm')
      mdl.upDate = moment(record.upDate, 'YYYY-MM-DD HH:mm')
      mdl.closeDate = moment(record.closeDate, 'YYYY-MM-DD HH:mm')
      this.edit.mdl = mdl
      this.modalConfig['title'] = '编辑'
    },
    handleAddOk() {
      const form = this.$refs.addModal.form
      this.confirmLoading = true
      form.validateFields((errors, values) => {
        if (!errors) {
          addAct(values)
            .then((res) => {
              const { code, msg } = res
              if (code === 0) {
                this.add.visible = false
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
        } else {
          this.confirmLoading = false
        }
      })
    },
    handleEditOk() {
      const form = this.$refs.editModal.form
      this.confirmLoading = true
      form.validateFields((errors, values) => {
        if (!errors) {
          Object.keys(values).map((e) => {
            if (values[e] === undefined) {
              values[e] = ''
            }
          })
          if (values.id > 0) {
            // 修改 e.g.
            editAct(values)
              .then((res) => {
                console.log(res)
                const { code, msg } = res
                if (code === 0) {
                  this.edit.visible = false
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
          this.confirmLoading = false
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
    handleDel(record) {
      console.log('del', record)
      const ts = this
      const delMod = Modal.confirm({
        centered: true,
        maskClosable: true,
        title: '提示信息',
        content: `确定删除【${record.id}】的记录？`,
        onOk: () => {
          delAct({
            id: record.id
          }).then((res) => {
            console.log(res)
            ts.getData()
            delMod.destroy()
          })
        },
        onCancel() {}
      })
    },
    async showLang(belongTo, record) {
      this.type = belongTo
      this.langVisible = true
      const { code, data, msg } = await selectLangIntro({
        belongTo: belongTo,
        type: 'activity_' + belongTo,
        coin: record.coin
      })
      if (code != 0) {
        this.$message.error(msg)
        return
      }
      this.langData = data
    },
    async saveLang(data) {
      const { code, msg } = await saveLangIntro(data)
      if (code != 0) {
        this.$message.error(msg)
        return
      }
      this.langVisible = false
    },
    doSearch() {
      this.getData()
    },

    async getData() {
      this.loading = true
      this.queryParam.page = this.pagination.current
      this.queryParam.limit = this.pagination.pageSize
      const res = await getActList(this.queryParam)
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
