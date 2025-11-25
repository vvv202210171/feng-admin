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
        <a-form-item label="通知类型">
          <a-select v-model="queryParam.noticeType" style="width: 120px" allowClear>
            <a-select-option
              v-for="item in enums['NotifyTypeEnum']"
              :key="item.code"
              :value="item.code"
              >{{ item.desc }}</a-select-option
            >
          </a-select>
        </a-form-item>
        <a-form-item label="时间">
          <QuickTime @change="changeDate"></QuickTime>
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
        size="small"
        row-key="autoid"
        :loading="loading"
        :scroll="{ x: 980 }"
        :columns="columns"
        :dataSource="loadData"
        :pagination="pagination"
      >
        <span slot="notifyType" slot-scope="text, record">
          {{ getDesc("NotifyTypeEnum", record.notifyType) }}
        </span>
        <span slot="readFlag" slot-scope="text, record">
          <a-tag v-if="record.readFlag === 1" color="green">已读</a-tag>
          <a-tag v-else color="red">未读</a-tag>
        </span>
        <p slot="expandedRowRender" slot-scope="record" style="margin: 0">
          <a-card title="详情">
            <a-card-grid v-for="(key, index) in columns2" :key="index" style="width: 50%">
              <span>{{ key.title }}</span
              >:
              <span>{{ formatContent(record.notifyDetailJson, key) }}</span>
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
  getNotifyLogList,
} from "@/api/log";
const columns = [
  {
    title: "ID",
    dataIndex: "notifyId",
    width: 80,
  },
  {
    dataIndex: "notifyType",
    title: "通知类型",
    scopedSlots: { customRender: "notifyType" },
    width: 120,
  },
  {
    dataIndex: "notifyTargetUid",
    title: "用户ID",
    width: 120,
  },
  {
    dataIndex: "readFlag",
    title: "是否已读",
    scopedSlots: { customRender: "readFlag" },
    width: 120,
  },
  {
    dataIndex: "notifyTime",
    title: "创建时间",
    width: 120,
  },
  {
    dataIndex: "readTime",
    title: "读取时间",
    width: 120,
  },
];
const columns2 = [
  {
    dataIndex: "businessId",
    title: "业务ID",
  },
  {
    dataIndex: "note",
    title: "备注",
  },
  {
    dataIndex: "content",
    title: "内容",
  },
];
export default {
  name: "TradOrderList",
  components: {
    STable,
    Ellipsis,
    // CreateForm
    // StepByStepModal
  },
  data() {
    return {
      loading: false,
      columns,
      columns2,
      // create model
      visible: false,
      confirmLoading: false,
      mdl: null,
      roleMenus: [],
      advanced: false,
      queryParam: {
        key: "",
      },
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
          this.getData();
        },
      },
      selectedRowKeys: [],
      selectedRows: [],
    };
  },
  filters: {},
  created() {
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
    doSearch() {
      this.getData();
    },
    formatContent(content, key) {
      if (!content) {
        return "";
      }
      let detail = JSON.parse(content);
      return detail[key.dataIndex] || "";
    },
    changeDate(data) {
      this.queryParam.startdate = data[0];
      this.queryParam.enddate = data[1];
    },
    async getData() {
      this.loading = true;
      this.queryParam.page = this.pagination.current;
      this.queryParam.limit = this.pagination.pageSize;
      const res = await getNotifyLogList(this.queryParam);
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
