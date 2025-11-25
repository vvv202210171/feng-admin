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
            <a-select-option value="completed"> 已完成 </a-select-option>
            <a-select-option value="dismissed"> 已驳回 </a-select-option>
            <a-select-option value="sending"> 待审核 </a-select-option>
            <a-select-option value="revoke"> 已撤销 </a-select-option>
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
        row-key="autoid"
        :loading="loading"
        :scroll="{ x: 1500 }"
        bordered
        :columns="columns"
        :dataSource="loadData"
        :pagination="pagination"
      >
        <span slot="withDrawType" slot-scope="text, record">
          <span v-if="isBank(record)">提币到银行卡</span>
          <span v-else>提币到地址</span>
        </span>
        <template slot="state" slot-scope="text, record">
          <span v-if="record.state === 'sending'" style="color: #eb1345">待审核</span>
          <span v-if="record.state === 'completed'">已完成</span>
          <span v-if="record.state === 'revoke'">已取消</span>
          <span v-if="record.state === 'dismissed'">已驳回</span>
        </template>
        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="handleEdit(record)" :disabled="!$verify('112022')">编辑</a>
            <!-- <a-divider type="vertical" />
            <a @click="handleDel(record)">删除</a> -->
          </template>
        </span>
        <p slot="expandedRowRender" slot-scope="record" style="margin: 0">
          <a-card title="详情">
            <a-card-grid style="width: 25%" v-for="(key, index) in columns2" :key="index">
              <span>{{ key.title }}</span
              >:
              <template v-if="key.dataIndex == 'state'">
                <span v-if="record.state === 'sending'" style="color: #eb1345"
                  >待审核</span
                >
                <span v-if="record.state === 'completed'">已完成</span>
                <span v-if="record.state === 'revoke'">已取消</span>
                <span v-if="record.state === 'dismissed'">已驳回</span>
              </template>
              <template v-else-if="key.dataIndex == 'bankCardId'">
                <span v-if="isBank(record)">提币到银行卡</span>
                <span v-else>提币到地址</span>
              </template>
              <template v-else>
                <span>{{ record[key.dataIndex] }}</span>
              </template>
            </a-card-grid>
            <a-card-grid style="width: 25%" v-if="isBank(record) == false">
              <span>提币地址：</span>
              <span>{{ record.address }}</span>
            </a-card-grid>
            <a-card-grid style="width: 25%" v-if="isBank(record)">
              <span>持卡人:</span>
              <span>{{ record.holderName }}</span>
            </a-card-grid>
            <a-card-grid style="width: 25%" v-if="isBank(record)">
              <span>银行账号:</span>
              <span>{{ record.bankAccount }}</span>
            </a-card-grid>
            <a-card-grid style="width: 25%" v-if="isBank(record)">
              <span>银行名称:</span>
              <span>{{ record.bankName }}</span>
            </a-card-grid>
            <a-card-grid style="width: 25%" v-if="isBank(record)">
              <span>区域码:</span>
              <span>{{ record.areaCode }}</span>
            </a-card-grid>
            <a-card-grid style="width: 25%" v-if="isBank(record)">
              <span>联系电话:</span>
              <span>{{ record.phone }}</span>
            </a-card-grid>
            <a-card-grid style="width: 25%" v-if="isBank(record)">
              <span>法币:</span>
              <span>{{ record.fiatCode }}</span>
            </a-card-grid>
            <a-card-grid style="width: 25%" v-if="isBank(record)">
              <span>到账法币数量:</span>
              <span>{{ record.fiatNum }}</span>
            </a-card-grid>
          </a-card>
        </p>
      </a-table>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { STable, Ellipsis } from "@/components";
import {
  // getRoleList,
  getUsprofitoutList,
} from "@/api/assethub";

const columns = [
  {
    dataIndex: "autoid",
    title: "ID",
    width: 80,
  },
  {
    dataIndex: "member",
    title: "账户",
    width: 120,
  },
  {
    dataIndex: "email",
    title: "邮箱",
    width: 80,
  },
  {
    dataIndex: "tel",
    title: "电话",
    width: 80,
  },
  {
    dataIndex: "bankCardId",
    title: "提币类型",
    width: 150,
    scopedSlots: { customRender: "withDrawType" },
  },

  {
    dataIndex: "coin",
    title: "币种",
    width: 100,
  },
  {
    dataIndex: "number",
    title: "数量",
    width: 100,
  },
  {
    dataIndex: "lastnumber",
    title: "实际到账数量",
    width: 100,
  },
  {
    dataIndex: "gas",
    title: "手续费",
    width: 100,
  },
  {
    dataIndex: "gascoin",
    title: "手续费币种",
    width: 80,
  },
  {
    dataIndex: "address",
    title: "提币地址",
    width: 150,
  },
  {
    dataIndex: "reason",
    title: "驳回原因（会员可见）",
    width: 150,
  },
  {
    dataIndex: "reasonBo",
    title: "驳回原因（后台可见）",
    width: 150,
  },
  {
    dataIndex: "state",
    title: "状态",
    width: 100,
    scopedSlots: { customRender: "state" },
  },

  {
    dataIndex: "hash",
    title: "哈希",
    width: 150,
  },
];
const columns2 = [
  {
    dataIndex: "autoid",
    title: "ID",
    width: 80,
  },
  {
    dataIndex: "member",
    title: "账户",
    width: 120,
  },

  {
    dataIndex: "tel",
    title: "手机",
    width: 150,
  },
  {
    dataIndex: "bankCardId",
    title: "提币类型",
    width: 150,
  },
  {
    dataIndex: "email",
    title: "邮箱",
    width: 150,
  },
  {
    dataIndex: "username",
    title: "姓名",
    width: 100,
  },
  {
    dataIndex: "coin",
    title: "币种",
    width: 100,
  },
  {
    dataIndex: "number",
    title: "数量",
    width: 100,
  },
  {
    dataIndex: "lastnumber",
    title: "实际到账数量",
    width: 100,
  },
  {
    dataIndex: "gas",
    title: "手续费",
    width: 100,
  },
  {
    dataIndex: "gascoin",
    title: "手续费币种",
    width: 80,
  },
  {
    dataIndex: "writedate",
    title: "时间",
    width: 150,
  },
  {
    dataIndex: "state",
    title: "状态",
    width: 100,
    scopedSlots: { customRender: "state" },
  },
  {
    dataIndex: "tag",
    title: "标签",
    width: 180,
  },
  {
    dataIndex: "hash",
    title: "哈希",
    width: 150,
  },
];

export default {
  name: "UsprofitOutList",
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
      columns2,
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
        pageSize: 10,
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
    // rowSelection () {
    //   return {
    //     selectedRowKeys: this.selectedRowKeys,
    //     onChange: this.onSelectChange
    //   }
    // }
  },
  methods: {
    isBank(record) {
      return record.bankCardId !== 0;
    },
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
    handleEdit(record) {
      // get menu data
      this.roleMenus = [];
      this.visible = true;
      this.mdl = { ...record };
    },

    handleCancel() {
      this.visible = false;
      this.confirmLoading = false;
      const form = this.$refs.createModal.form;
      form.resetFields(); // 清理表单数据（可不做）
      this.roleMenus = [];
    },

    // onSelectChange (selectedRowKeys, selectedRows) {
    //   this.selectedRowKeys = selectedRowKeys
    //   this.selectedRows = selectedRows
    // },
    doSearch() {
      console.log(this.queryParam);
      this.getData();
    },
    async getData() {
      this.loading = true;

      const res = await getUsprofitoutList(this.queryParam);
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
