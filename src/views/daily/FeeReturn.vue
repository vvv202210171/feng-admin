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
        <a-form-item label="类型">
          <a-select v-model="queryParam.type" style="width: 120px" allow-clear>
            <a-select-option
              :value="item.code"
              v-for="item in enums['DailyReturnTypeEnum']"
            >
              {{ item.desc }}
            </a-select-option>
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
        :row-key="(record) => record.id * Math.random()"
        :loading="loading"
        :scroll="{ x: 980 }"
        :columns="columns"
        :dataSource="loadData"
        :pagination="pagination"
      >
        <p slot="writedate" slot-scope="record" style="margin: 0">
          {{ record | dayjs("YYYY-MM-DD") }}
        </p>
        <p slot="rate" slot-scope="record" style="margin: 0">{{ record * 100 }}%</p>
        <template slot="amount" slot-scope="text, record">
          <span style="color: green">{{ record.amount }}</span> {{ record.coin }}
        </template>
        <p slot="type" slot-scope="record" style="margin: 0">
          <a-tag :color="record == 'self' ? 'blue' : 'green'">
            {{ getDesc("DailyReturnTypeEnum", record) }}
          </a-tag>
        </p>
      </a-table>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { STable, Ellipsis } from "@/components";
import {
  // getRoleList,
  getFeeReturnRecord,
} from "@/api/daily";

const columns = [
  {
    dataIndex: "member",
    title: "账号",
    width: 100,
  },
  {
    dataIndex: "email",
    title: "账号邮箱",
    width: 120,
  },
  {
    dataIndex: "team_member",
    title: "赠送人",
    width: 100,
  },
  {
    dataIndex: "teamEmail",
    title: "赠送人邮箱",
    width: 120,
  },
  {
    dataIndex: "amount",
    title: "数目",
    scopedSlots: { customRender: "amount" },
    width: 100,
  },
  {
    dataIndex: "type",
    title: "类型",
    width: 100,
    scopedSlots: { customRender: "type" },
  },
  {
    dataIndex: "rate",
    title: "手续费比例",
    scopedSlots: { customRender: "rate" },
    width: 120,
  },
  {
    dataIndex: "remark",
    title: "备注",
    width: 180,
  },
  {
    dataIndex: "writedate",
    title: "时间",
    scopedSlots: { customRender: "writedate" },
    width: 150,
  },
];

export default {
  name: "LogUserSetting",
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

          this.getData();
          // console.log(page, pageSize)
        },
      },
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
  },
  methods: {
    changeDate(data) {
      this.queryParam.startdate = data[0];
      this.queryParam.enddate = data[1];
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
      this.queryParam.page = this.pagination.current;
      this.queryParam.limit = this.pagination.pageSize;
      const res = await getFeeReturnRecord(this.queryParam);
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
