<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <!-- :model="queryParam" -->
      <a-form
        name="Search"
        layout="inline"
        autocomplete="off"
        style="margin-bottom: 14px"
        @submit="doSearch"
      >
        <a-form-item label="搜索内容">
          <a-input
            style="width: 240px"
            v-model="queryParam.key"
            placeholder="请输入要搜索的内容"
          >
          </a-input>
        </a-form-item>
        <a-form-item label="代理账户">
          <a-input
            style="width: 240px"
            v-model="queryParam.parentVal"
            placeholder="请输入要搜索的内容"
          >
          </a-input>
        </a-form-item>
        <a-form-item label="状态">
          <a-select style="width: 100px" v-model="queryParam.state">
            <a-select-option value=""> 请选择 </a-select-option>
            <a-select-option value="enable"> 运行中 </a-select-option>
            <a-select-option value="success"> 已完成 </a-select-option>
            <a-select-option value="close"> 赎回 </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="时间">
          <a-date-picker
            v-model="queryParam.startdate"
            @change="startChange"
          />~<a-date-picker v-model="queryParam.enddate" @change="endChange" />
        </a-form-item>
        <a-form-item>
          <a-button
            htmlType="submit"
            :disabled="disabledSearch"
            type="primary"
            @click="doSearch"
            >查询</a-button
          >
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
      >
        <span slot="state" slot-scope="text, record">
          {{
            record.state === "enable"
              ? "运行中"
              : record.state === "success"
              ? "已完成"
              : record.state === "close"
              ? "赎回"
              : record.state
          }}
        </span>
        <!-- <span slot="action" slot-scope="text, record">
          <template>
            <a-button type="primary" :disabled="record.state !== 'enable'" @click="handleEdit(record)" size="small">
              赎回
            </a-button>
          </template>
        </span> -->
      </a-table>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { STable, Ellipsis } from "@/components";
import { getMinerOrderList } from "@/api/miner";
import { Modal } from "ant-design-vue";

// import StepByStepModal from './modules/StepByStepModal'
// import CreateForm from './modules/TradOrderForm'

const columns = [
  {
    dataIndex: "id",
    title: "ID",
    width: 100,
  },
  {
    dataIndex: "member",
    title: "会员",
    width: 120,
  },
  {
    dataIndex: "name",
    title: "名称",
    width: 200,
  },
  {
    dataIndex: "payCoin",
    title: "币种",
    width: 120,
  },
  {
    dataIndex: "payNumber",
    title: "质押数量",
    width: 120,
  },
  {
    dataIndex: "cycle",
    title: "锁仓周期(天)",
    width: 120,
  },
  {
    dataIndex: "onCycle",
    title: "运行周期(天)",
    width: 120,
  },
  {
    dataIndex: "todayIncome",
    title: "今日收益",
    width: 120,
  },
  {
    dataIndex: "income",
    title: "累计收益",
    width: 120,
  },
  {
    dataIndex: "state",
    title: "订单状态",
    width: 100,
    scopedSlots: { customRender: "state" },
  },
  {
    dataIndex: "writedate",
    title: "下单时间",
    width: 180,
  },
  {
    dataIndex: "enddate",
    title: "到期时间",
    width: 180,
  },
  // {
  //   title: '操作',
  //   dataIndex: 'action',
  //   width: 150,
  //   scopedSlots: { customRender: 'action' }
  // }
];

export default {
  name: "MinerOrderList",
  components: {
    STable,
    Ellipsis,
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
        key: "",
        state: "",
        startdate: "",
        enddate: "",
      },
      // 加载数据方法 必须为 Promise 对象
      loadData: [],
      pagination: {
        total: 0,
        current: 1,
        pageSize: 20,
        onChange: (page, pageSize) => {
          this.pagination.current = page;
          if (pageSize !== this.pagination.pageSize) {
            this.pagination.pageSize = pageSize;
          }
          this.queryParam["page"] = page;
          this.queryParam["pageSize"] = pageSize;
          this.getData();
          // console.log(page, pageSize)
        },
      },
      selectedRowKeys: [],
      selectedRows: [],
    };
  },

  created() {
    // getRoleList({ t: new Date() })
    this.getData();
  },
  computed: {
    // 搜索状态
    disabledSearch() {
      return this.loading;
    },
    rowSelection() {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange,
      };
    },
  },
  methods: {
    handleAdd() {
      // get menu data
      this.roleMenus = [];
      this.mdl = null;
      this.visible = true;
    },
    startChange(date, dateString) {
      this.queryParam.startdate = dateString;
    },
    endChange(date, dateString) {
      this.queryParam.enddate = dateString;
    },

    handleCancel() {
      this.visible = false;
      this.confirmLoading = false;
      const form = this.$refs.createModal.form;
      form.resetFields(); // 清理表单数据（可不做）
      this.roleMenus = [];
    },

    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys;
      this.selectedRows = selectedRows;
    },
    doSearch() {
      console.log(this.queryParam);
      this.getData();
    },
    async getData() {
      this.loading = true;

      const res = await getMinerOrderList(this.queryParam);
      const { code, data } = res;
      if (code === 0) {
        this.loadData = data.records;
        this.pagination.total = data.total;
      } else {
        console.log(res);
      }
      setTimeout(() => {
        this.loading = false;
      }, 800);
    },
  },
};
</script>
