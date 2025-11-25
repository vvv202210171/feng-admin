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
        <a-form-item>
          <a-button
            htmlType="submit"
            :disabled="disabledSearch"
            type="primary"
            @click="doSearch"
            >查询</a-button
          >
        </a-form-item>
        <a-form-item>
          <a-button
            class="ml6"
            type="primary"
            icon="plus"
            @click="handleAdd"
            :disabled="!$verify('105012')"
            >新建</a-button
          >
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
        <span slot="plate" slot-scope="text, record">
          {{
            record.plate === "main" ? "主板" : record.plate === "pioneer" ? "创业板" : ""
          }}
        </span>

        <span slot="state" slot-scope="text, record">
          {{
            record.state === "enable"
              ? "正在交易"
              : record.state === "disable"
              ? "已下架"
              : record.state === "ready"
              ? "即将交易"
              : ""
          }}
        </span>

        <span slot="robot" slot-scope="text, record">
          {{ record.robot | statusMappingFormat }}
        </span>

        <span slot="limitPrice" slot-scope="text, record">
          {{ record.limitPrice | statusMappingFormat }}
        </span>

        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="handleEdit(record)" :disabled="!$verify('105013')">编辑</a>
            <a-divider type="vertical" />
            <a @click="handleDel(record)" :disabled="!$verify('105011')">删除</a>
          </template>
        </span>
        <p slot="expandedRowRender" slot-scope="record" style="margin: 0">
          <a-card title="详情">
            <a-card-grid style="width: 25%" v-for="(key, index) in columns2" :key="index">
              <span>{{ key.title }}</span
              >:
              <template v-if="key.dataIndex == 'plate'">
                <span>
                  {{
                    record.plate === "main"
                      ? "主板"
                      : record.plate === "pioneer"
                      ? "创业板"
                      : ""
                  }}
                </span>
              </template>
              <template v-else-if="key.dataIndex == 'state'">
                <span>
                  {{
                    record.state === "enable"
                      ? "正在交易"
                      : record.state === "disable"
                      ? "已下架"
                      : record.state === "ready"
                      ? "即将交易"
                      : ""
                  }}
                </span>
              </template>
              <template v-else-if="key.dataIndex == 'robot'">
                <span>
                  {{
                    record.robot === "disable"
                      ? "禁用"
                      : record.robot === "enable"
                      ? "启用"
                      : ""
                  }}
                </span>
              </template>
              <template v-else-if="key.dataIndex == 'limitPrice'">
                <span>
                  {{
                    record.limit_price === "disable"
                      ? "禁用"
                      : record.limit_price === "enable"
                      ? "启用"
                      : ""
                  }}
                </span>
              </template>
              <template v-else>
                <span>{{ record[key.dataIndex] }}</span>
              </template>
            </a-card-grid>
          </a-card>
        </p>
      </a-table>
      <s-modal
        ref="addModel"
        :config="modalConfig"
        :loading="confirmLoading"
        :visible="addVisible"
        :options="addModalOption"
        :model="addMdl"
        @cancel="addHandleCancel"
        @ok="addHandleOk"
      />
      <s-modal
        ref="editModel"
        :config="modalConfig"
        :loading="confirmLoading"
        :visible="editVisible"
        :options="editModalOption"
        :model="editMdl"
        @cancel="handleCancel"
        @ok="handleOk"
      />
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { STable, Ellipsis, SModal } from "@/components";
import {
  // getRoleList,
  getTradCoinList,
  delTradCoin,
  addTradCoin,
  editTradCoin,
} from "@/api/trad";
import { Modal } from "ant-design-vue";

// import StepByStepModal from './modules/StepByStepModal'
// import CreateForm from './modules/TradCoinForm'
const columns = [
  {
    dataIndex: "tradcoin",
    title: "交易币种",
    width: 90,
  },
  {
    dataIndex: "height",
    title: "最高价",
    width: 100,
  },
  {
    dataIndex: "low",
    title: "最低价",
    width: 100,
  },
  {
    dataIndex: "price",
    title: "最新价",
    width: 100,
  },
  {
    dataIndex: "state",
    title: "状态",
    width: 100,
    scopedSlots: { customRender: "state" },
  },
  {
    dataIndex: "rise",
    title: "涨跌幅",
    width: 100,
  },
  {
    dataIndex: "robot",
    title: "机器人",
    width: 80,
    scopedSlots: { customRender: "robot" },
  },
  {
    dataIndex: "robotPriceGas",
    title: "盘口幅度",
    width: 100,
  },
  {
    dataIndex: "robotPriceHigh",
    title: "价格上涨幅度",
    width: 100,
  },
  {
    dataIndex: "robotPriceLow",
    title: "价格下跌幅度",
    width: 100,
  },
  {
    dataIndex: "limitPrice",
    title: "限制价格",
    width: 80,
    scopedSlots: { customRender: "limitPrice" },
  },
  {
    dataIndex: "limitHigh",
    title: "限制最高价",
    width: 100,
  },

  {
    title: "操作",
    dataIndex: "action",
    width: 150,
    scopedSlots: { customRender: "action" },
  },
];

const columns2 = [
  {
    dataIndex: "autoid",
    title: "ID",
    width: 100,
  },
  {
    dataIndex: "tradcoin",
    title: "交易币种",
    width: 90,
  },
  {
    dataIndex: "maincoin",
    title: "主币种",
    width: 80,
  },
  {
    dataIndex: "marketBuyFee",
    title: "市价买单手续费",
    width: 120,
  },
  {
    dataIndex: "marketSellFee",
    title: "市价卖单手续费",
    width: 120,
  },
  {
    dataIndex: "limitBuyFee",
    title: "限价买单手续费",
    width: 120,
  },
  {
    dataIndex: "limitSellFee",
    title: "限价卖单手续费",
    width: 120,
  },
  {
    dataIndex: "height",
    title: "最高价",
    width: 100,
  },
  {
    dataIndex: "low",
    title: "最低价",
    width: 100,
  },
  {
    dataIndex: "price",
    title: "最新价",
    width: 100,
  },
  {
    dataIndex: "volume",
    title: "成交量",
    width: 100,
  },
  {
    dataIndex: "cny",
    title: "CNY",
    width: 100,
  },
  {
    dataIndex: "rise",
    title: "涨跌幅",
    width: 100,
  },
  {
    dataIndex: "priceAccuracy",
    title: "价格精度",
    width: 90,
  },
  {
    dataIndex: "amountAccuracy",
    title: "数量精度",
    width: 90,
  },
  {
    dataIndex: "plate",
    title: "交易区",
    width: 120,
    scopedSlots: { customRender: "plate" },
  },
  {
    dataIndex: "state",
    title: "状态",
    width: 100,
    scopedSlots: { customRender: "state" },
  },
  {
    dataIndex: "robot",
    title: "机器人",
    width: 80,
    scopedSlots: { customRender: "robot" },
  },
  {
    dataIndex: "minnumber",
    title: "最低交易额",
    width: 110,
  },
  {
    dataIndex: "robotPriceGas",
    title: "盘口幅度",
    width: 100,
  },
  {
    dataIndex: "robotPriceHigh",
    title: "价格上涨幅度",
    width: 100,
  },
  {
    dataIndex: "robotPriceLow",
    title: "价格下跌幅度",
    width: 100,
  },
  {
    dataIndex: "robotNumber",
    title: "单次数量",
    width: 100,
  },
  {
    dataIndex: "robotNumberGas",
    title: "数量幅度",
    width: 100,
  },
  {
    dataIndex: "robotMember",
    title: "机器人账号",
    width: 100,
  },
  {
    dataIndex: "limitPrice",
    title: "限制价格",
    width: 80,
    scopedSlots: { customRender: "limitPrice" },
  },
  {
    dataIndex: "limitHigh",
    title: "限制最高价",
    width: 100,
  },
  {
    dataIndex: "limitLow",
    title: "限制最低价",
    width: 100,
  },
  {
    dataIndex: "maincoinLowWarning",
    title: "主币种资产预警数量",
    width: 200,
  },
  {
    dataIndex: "tradcoinLowWarning",
    title: "交易币种资产预警数量",
    width: 200,
  },
  {
    dataIndex: "maincoinCloseWarning",
    title: "主币种触发关停机器人数量",
    width: 200,
  },
  {
    dataIndex: "tradcoinCloseWarning",
    title: "交易币种触发关停机器人数量",
    width: 200,
  },
  {
    dataIndex: "warningEmail",
    title: "预警接受人",
    width: 200,
  },
];

const addModalOption = [
  {
    title: "主币种名称",
    field: "maincoin",
    type: "select-currency",
    placeholder: "请选择主币种",

    decorator: { rules: [{ required: true, message: "请选择主币种" }] },
  },
  {
    title: "交易币种名称",
    field: "tradcoin",
    type: "select-currency",
    placeholder: "请选择交易币种",
    decorator: { rules: [{ required: true, message: "请选择交易币种" }] },
  },
  {
    title: "市价买单手续费",
    field: "marketBuyFee",
    type: "input",
    placeholder: "请输入市价买单手续费",
    decorator: { rules: [{ required: true, message: "请输入市价买单手续费" }] },
  },
  {
    title: "市价卖单手续费",
    field: "marketSellFee",
    type: "input",
    placeholder: "请输入市价卖单手续费",
    decorator: { rules: [{ required: true, message: "请输入市价卖单手续费" }] },
  },
  {
    title: "限价买单手续费",
    field: "limitBuyFee",
    type: "input",
    placeholder: "请输入限价买单手续费",
    decorator: { rules: [{ required: true, message: "请输入限价买单手续费" }] },
  },
  {
    title: "限价卖单手续费",
    field: "limitSellFee",
    type: "input",
    placeholder: "请输入限价卖单手续费",
    decorator: { rules: [{ required: true, message: "请输入限价卖单手续费" }] },
  },
  {
    title: "最小交易额",
    field: "minnumber",
    type: "input",
    placeholder: "请输入最小交易额",
    decorator: { rules: [{ required: true, message: "请输入最小交易额" }] },
  },
  {
    title: "数量精度",
    field: "amountAccuracy",
    type: "input",
    placeholder: "请输入数量精度",
    decorator: { rules: [{ required: true, message: "请输入数量精度" }] },
  },
  {
    title: "价格精度",
    field: "priceAccuracy",
    type: "input",
    placeholder: "请输入价格精度",
    decorator: { rules: [{ required: true, message: "请输入价格精度" }] },
  },
  {
    title: "交易区",
    field: "plate",
    type: "select",
    options: [
      { val: "main", title: "主板" },
      { val: "pioneer", title: "创业板" },
    ],
    decorator: { rules: [{ required: true, message: "请选择交易区" }] },
  },
];

const editModalOption = [
  {
    title: "ID",
    field: "autoid",
    type: "input",
    span: 8,
    decorator: {},
    disabled: true,
    hidden: true,
  },
  {
    title: "主币种名称",
    field: "maincoin",
    type: "select-currency",
    placeholder: "请选择主币种",
    span: 12,

    disabled: true,
    decorator: { rules: [{ required: true, message: "请选择主币种" }] },
  },
  {
    title: "交易币种名称",
    field: "tradcoin",
    type: "select-currency",
    placeholder: "请选择交易币种",
    disabled: true,
    span: 12,
    decorator: { rules: [{ required: true, message: "请选择交易币种" }] },
  },
  {
    title: "市价买单手续费",
    field: "marketBuyFee",
    type: "input",
    span: 12,
    placeholder: "请输入市价买单手续费",
    decorator: { rules: [{ required: true, message: "请输入市价买单手续费" }] },
  },
  {
    title: "市价卖单手续费",
    field: "marketSellFee",
    type: "input",
    span: 12,
    placeholder: "请输入市价卖单手续费",
    decorator: { rules: [{ required: true, message: "请输入市价卖单手续费" }] },
  },
  {
    title: "限价买单手续费",
    field: "limitBuyFee",
    type: "input",
    span: 12,
    placeholder: "请输入限价买单手续费",
    decorator: { rules: [{ required: true, message: "请输入限价买单手续费" }] },
  },
  {
    title: "限价卖单手续费",
    field: "limitSellFee",
    type: "input",
    span: 12,
    placeholder: "请输入限价卖单手续费",
    decorator: { rules: [{ required: true, message: "请输入限价卖单手续费" }] },
  },
  {
    title: "最小交易额",
    field: "minnumber",
    type: "input",
    span: 12,
    placeholder: "请输入最小交易额",
    decorator: { rules: [{ required: true, message: "请输入最小交易额" }] },
  },
  {
    title: "数量精度",
    field: "amountAccuracy",
    type: "input",
    span: 12,
    placeholder: "请输入数量精度",
    decorator: { rules: [{ required: true, message: "请输入数量精度" }] },
  },
  {
    title: "价格精度",
    field: "priceAccuracy",
    type: "input",
    span: 12,
    placeholder: "请输入价格精度",
    decorator: { rules: [{ required: true, message: "请输入价格精度" }] },
  },
  {
    title: "交易区",
    span: 12,
    field: "plate",
    type: "select",
    options: [
      { val: "main", title: "主板" },
      { val: "pioneer", title: "创业板" },
    ],
    decorator: { rules: [{ required: true, message: "请选择交易区" }] },
  },
  {
    title: "状态",
    span: 12,
    field: "state",
    type: "select",
    options: [
      { val: "enable", title: "正在交易" },
      { val: "disable", title: "已下架" },
      { val: "ready", title: "即将交易" },
    ],
    decorator: { rules: [{ required: true, message: "请选择状态" }] },
  },
  {
    title: "机器人状态",
    field: "robot",
    span: 12,
    type: "select",
    options: [
      { val: "enable", title: "开启" },
      { val: "disable", title: "关闭" },
    ],
    decorator: { rules: [{ required: true, message: "请选择机器人状态" }] },
  },
  {
    title: "机器人单次交易数量",
    field: "robotNumber",
    type: "input",
    span: 12,
    placeholder: "请输入机器人单次交易数量",
    decorator: {},
  },
  {
    title: "机器人交易数量幅度",
    field: "robotNumberGas",
    span: 12,
    type: "input",
    placeholder: "请输入机器人交易数量幅度",
    decorator: {},
  },
  {
    title: "机器人价格波动幅度",
    field: "robotPriceGas",
    span: 12,
    type: "input",
    placeholder: "请输入机器人价格波动幅度",
    decorator: {},
  },
  {
    title: "机器人最高价上涨幅度",
    field: "robotPriceHigh",
    span: 12,
    type: "input",
    placeholder: "请输入机器人最高价上涨幅度",
    decorator: {},
  },
  {
    title: "机器人最低价下跌幅度",
    field: "robotPriceLow",
    span: 12,
    type: "input",
    placeholder: "请输入机器人最低价下跌幅度",
    decorator: {},
  },
  {
    title: "机器人账号",
    field: "robotMember",
    type: "input",
    span: 12,
    placeholder: "请输入机器人账号",
    decorator: {},
  },
  {
    title: "限制价格",
    field: "limitPrice",
    type: "input",
    span: 12,
    placeholder: "请输入限制价格",
    decorator: {},
  },
  {
    title: "限制最高价",
    field: "limitHigh",
    type: "input",
    span: 12,
    placeholder: "请输入限制最高价",
    decorator: {},
  },
  {
    title: "限制最低价",
    field: "limitLow",
    type: "input",
    span: 12,
    placeholder: "请输入限制最低价",
    decorator: {},
  },
  {
    title: "主币种预警数量",
    field: "maincoinLowWarning",
    span: 12,
    type: "input",
    placeholder: "请输入主币种预警数量",
    decorator: {},
  },
  {
    title: "交易币种预警数量",
    field: "tradcoinLowWarning",
    span: 12,
    type: "input",
    placeholder: "请输入交易币种预警数量",
    decorator: {},
  },
  {
    title: "主币种触发关停机器人数量",
    span: 12,
    field: "maincoinCloseWarning",
    type: "input",
    placeholder: "请输入主币种触发关停机器人数量",
    decorator: {},
  },
  {
    title: "交易币种触发关停机器人数量",
    span: 12,
    field: "tradcoinCloseWarning",
    type: "input",
    placeholder: "请输入交易币种触发关停机器人数量",
    decorator: {},
  },
  {
    title: "预警接受人邮箱",
    field: "warningEmail",
    span: 12,
    type: "input",
    placeholder: "请输入预警接受人邮箱",
    decorator: {},
  },
];

export default {
  name: "TradCoinList",
  components: {
    STable,
    Ellipsis,
    SModal,
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
      addVisible: false,
      editVisible: false,
      confirmLoading: false,
      addMdl: null,
      editMdl: null,
      addModalOption,
      editModalOption,
      modalConfig: {},
      // 高级搜索 展开/关闭
      advanced: false,
      // // 搜索状态
      // disabledSearch: false,
      // 查询参数
      queryParam: {
        key: "",
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
    // rowSelection () {
    //   return {
    //     selectedRowKeys: this.selectedRowKeys,
    //     onChange: this.onSelectChange
    //   }
    // }
  },
  methods: {
    handleAdd() {
      this.addMdl = null;
      this.addVisible = true;
      this.modalConfig["title"] = "新增";
    },
    handleEdit(record) {
      this.editVisible = true;
      this.editMdl = { ...record };
      this.modalConfig["title"] = "编辑";
    },
    handleOk() {
      const form = this.$refs.editModel.form;
      const username = this.$store.getters.username;
      this.confirmLoading = true;
      form.validateFields((errors, values) => {
        if (!errors) {
          // 添加username
          values = {
            ...values,
            username,
          };
          Object.keys(values).map((e) => {
            if (values[e] === undefined) {
              values[e] = "";
            }
          });
          editTradCoin(values)
            .then((res) => {
              console.log(res);
              const { code, msg } = res;
              if (code === 0) {
                this.editVisible = false;
                this.confirmLoading = false;
                // 重置表单数据
                form.resetFields();
                // 刷新表格
                // this.$refs.table.refresh()
                this.getData();
                this.$message.success("修改成功");
              } else {
                this.$message.error(msg);
                this.handleCancel();
              }
            })
            .catch((e) => {
              this.handleCancel();
            });
        } else {
          this.confirmLoading = false;
        }
      });
    },
    handleCancel() {
      this.editVisible = false;
      this.confirmLoading = false;
      const form = this.$refs.editModel.form;
      form.resetFields(); // 清理表单数据（可不做）
    },
    addHandleOk() {
      const form = this.$refs.addModel.form;
      const username = this.$store.getters.username;
      this.confirmLoading = true;
      form.validateFields((errors, values) => {
        if (!errors) {
          // 添加username
          values = {
            ...values,
            username,
          };
          Object.keys(values).map((e) => {
            if (values[e] === undefined) {
              values[e] = "";
            }
          });
          addTradCoin(values)
            .then((res) => {
              const { code, msg } = res;
              if (code === 0) {
                this.addVisible = false;
                this.confirmLoading = false;
                // 重置表单数据
                form.resetFields();
                // 刷新表格
                this.getData();
                this.$message.success("新增成功");
              } else {
                this.$message.error(msg);
                this.addHandleCancel();
              }
            })
            .catch((e) => {
              this.addHandleCancel();
            });
        } else {
          this.confirmLoading = false;
        }
      });
    },
    addHandleCancel() {
      this.addVisible = false;
      this.confirmLoading = false;
      const form = this.$refs.addModel.form;
      form.resetFields(); // 清理表单数据（可不做）
    },

    handleDel(record) {
      const username = this.$store.getters.username;
      const ts = this;
      const delMod = Modal.confirm({
        centered: true,
        maskClosable: true,
        title: "提示信息",
        content: `确定删除【${record.autoid}】的记录？`,
        onOk: () => {
          delTradCoin({
            username: username,
            autoid: record.autoid,
          }).then((res) => {
            console.log(res);
            ts.getData();
            delMod.destroy();
          });
        },
        onCancel() {},
      });
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

      const res = await getTradCoinList(this.queryParam);
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
