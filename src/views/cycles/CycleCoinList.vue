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
            type="primary"
            icon="plus"
            @click="handleAdd"
            :disabled="!$verify('110012')"
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
        <!-- :rowSelection="rowSelection" -->

        <span slot="state" slot-scope="text, record">
          {{
            record.state === "enable"
              ? "正在交易"
              : record.state === "disable"
              ? "已下架"
              : record.state === "ready"
              ? "即将交易"
              : record.state
          }}
        </span>

        <span slot="robot" slot-scope="text, record">
          {{
            record.robot === "disable"
              ? "禁用"
              : record.robot === "enable"
              ? "启用"
              : record.robot
          }}
        </span>

        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="handleEdit(record)" :disabled="!$verify('110013')">编辑</a>
            <a-divider type="vertical" />
            <a @click="handleDel(record)" :disabled="!$verify('110011')">删除</a>
          </template>
        </span>
        <p slot="expandedRowRender" slot-scope="record" style="margin: 0">
          <a-card title="详情">
            <a-card-grid style="width: 25%" v-for="(key, index) in columns2" :key="index">
              <span>{{ key.title }}</span
              >:
              <span v-if="key.dataIndex == 'state'">
                {{
                  record.state === "enable"
                    ? "正在交易"
                    : record.state === "disable"
                    ? "已下架"
                    : record.state === "ready"
                    ? "即将交易"
                    : record.state
                }}
              </span>
              <span v-else-if="key.dataIndex == 'robot'">
                {{
                  record.robot === "disable"
                    ? "禁用"
                    : record.robot === "enable"
                    ? "启用"
                    : record.robot
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
        :options="addOptions"
        :model="add.mdl"
        @cancel="handleCancel"
        @ok="handleAddOk"
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
  </page-header-wrapper>
</template>

<script>
import { STable, Ellipsis, SModal } from "@/components";
import {
  // getRoleList,
  getCycleCoinList,
  delCycleCoin,
  addCycleCoin,
  editCycleCoin,
} from "@/api/cycle";
import { Modal } from "ant-design-vue";

// import StepByStepModal from './modules/StepByStepModal'
// import CreateForm from './modules/CycleCoinForm'

const columns = [
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
    dataIndex: "gas",
    title: "手续费",
    width: 80,
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
    title: "成交价",
    width: 150,
  },
  {
    dataIndex: "volume",
    title: "成交量",
    width: 150,
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
    width: 50,
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
    dataIndex: "gas",
    title: "手续费",
    width: 80,
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
    title: "成交价",
    width: 150,
  },
  {
    dataIndex: "volume",
    title: "成交量",
    width: 150,
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
    dataIndex: "robotPriceGas",
    title: "价格幅度",
    width: 100,
  },
  {
    dataIndex: "robotMaxNumber",
    title: "机器人最大挂单",
    width: 150,
  },
  {
    dataIndex: "robotMinNumber",
    title: "机器人最小挂单",
    width: 150,
  },
  {
    dataIndex: "profitGas",
    title: "收益率",
    width: 100,
  },
  {
    dataIndex: "lossGas",
    title: "亏损率",
    width: 100,
  },
];
const addOptions = [
  {
    title: "主币种名称",
    field: "maincoin",
    type: "select-currency",
    placeholder: "请选择主币种名称",
    decorator: { rules: [{ required: true, message: "请选择主币种名称" }] },
  },
  {
    title: "交易币种名称",
    field: "tradcoin",
    type: "select-currency",
    placeholder: "请选择币种",
    decorator: { rules: [{ required: true, message: "请选择币种" }] },
  },
  {
    title: "手续费",
    field: "gas",
    type: "number",
    placeholder: "请输入手续费",
    decorator: { rules: [{ required: true, message: "请输入手续费" }] },
  },

  {
    title: "价格精度",
    field: "priceAccuracy",
    type: "number",
    placeholder: "请输入价格精度",
    decorator: { rules: [{ required: true, message: "请输入价格精度" }] },
  },
  {
    title: "数量精度",
    field: "amountAccuracy",
    type: "number",
    placeholder: "请输入数量精度",
    decorator: { rules: [{ required: true, message: "请输入数量精度" }] },
  },
];
const editOptions = [
  { title: "ID", field: "autoid", type: "input", decorator: {}, disabled: true },
  {
    title: "主币种名称",
    field: "maincoin",
    type: "select-currency",
    placeholder: "请选择主币种名称",
    disabled: true,
    decorator: { rules: [{ required: true, message: "请选择主币种名称" }] },
  },
  {
    title: "交易币种名称",
    field: "tradcoin",
    type: "select-currency",
    placeholder: "请选择币种",
    disabled: true,
    decorator: { rules: [{ required: true, message: "请选择币种" }] },
  },
  {
    title: "手续费",
    field: "gas",
    type: "number",
    placeholder: "请输入手续费",
    decorator: { rules: [{ required: true, message: "请输入手续费" }] },
  },
  {
    title: "价格精度",
    field: "priceAccuracy",
    type: "number",
    placeholder: "请输入价格精度",
    decorator: { rules: [{ required: true, message: "请输入价格精度" }] },
  },
  {
    title: "数量精度",
    field: "amountAccuracy",
    type: "number",
    placeholder: "请输入数量精度",
    decorator: { rules: [{ required: true, message: "请输入数量精度" }] },
  },

  {
    title: "状态",
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
    field: "state",
    type: "select",
    options: [
      { val: "enable", title: "启用" },
      { val: "disable", title: "禁用" },
    ],
    decorator: { rules: [{ required: true, message: "请选择机器人状态" }] },
  },

  {
    title: "价格幅度",
    field: "robotPriceGas",
    type: "number",
    placeholder: "请输入价格幅度",
    decorator: { rules: [{ required: true, message: "请输入价格幅度" }] },
  },
  {
    title: "机器人最大挂单数量",
    field: "robotMaxNumber",
    type: "number",
    placeholder: "请输入机器人最大挂单数量",
    decorator: { rules: [{ required: true, message: "请输入机器人最大挂单数量" }] },
  },
  {
    title: "机器人最小挂单数量",
    field: "robotMinNumber",
    type: "number",
    placeholder: "请输入机器人最小挂单数量",
    decorator: { rules: [{ required: true, message: "请输入机器人最小挂单数量" }] },
  },
  {
    title: "收益率",
    field: "profitGas",
    type: "number",
    placeholder: "请输入收益率",
    decorator: { rules: [{ required: true, message: "请输入收益率" }] },
  },
  {
    title: "亏损率",
    field: "lossGas",
    type: "number",
    placeholder: "请输入亏损率",
    decorator: { rules: [{ required: true, message: "请输入亏损率" }] },
  },
];

export default {
  name: "CycleCoinList",
  components: {
    STable,
    Ellipsis,
    SModal,
    // StepByStepModal
  },
  data() {
    // this.columns = columns
    return {
      loading: false,
      columns,
      columns2,
      // create model
      roleMenus: [],
      modalConfig: {},
      confirmLoading: false,
      add: {
        visible: false,
        mdl: null,
      },
      addOptions,
      edit: {
        visible: false,
        mdl: null,
      },
      editOptions,
      // 高级搜索 展开/关闭
      advanced: false,
      // 搜索状态
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
    handleAdd() {
      // get menu data
      this.roleMenus = [];
      this.add.mdl = null;
      this.add.visible = true;
      this.modalConfig["title"] = "新增";
    },
    handleEdit(record) {
      // get menu data
      this.roleMenus = [];
      this.edit.visible = true;
      this.edit.mdl = { ...record };
      this.modalConfig["title"] = "编辑";
    },
    handleAddOk() {
      const form = this.$refs.addModal.form;
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
          console.log(values);
          // 新增
          addCycleCoin(values)
            .then((res) => {
              console.log(res);
              const { code, msg } = res;
              if (code === 0) {
                this.add.visible = false;
                this.confirmLoading = false;
                // 重置表单数据
                form.resetFields();
                // 刷新表格
                // this.$refs.table.refresh()
                this.getData();

                this.$message.success("新增成功");
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
    handleEditOk() {
      const form = this.$refs.editModal.form;
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
          console.log(values);
          if (values.autoid > 0) {
            // 修改 e.g.
            editCycleCoin(values)
              .then((res) => {
                console.log(res);
                const { code, msg } = res;
                if (code === 0) {
                  this.edit.visible = false;
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
          }
        } else {
          this.confirmLoading = false;
        }
      });
    },
    handleCancel() {
      this.add.visible = false;
      this.edit.visible = false;
      this.confirmLoading = false;
      const form = this.$refs.addModal.form;
      form.resetFields(); // 清理表单数据（可不做）
      const editform = this.$refs.editModal.form;
      editform.resetFields(); // 清理表单数据（可不做）
      this.roleMenus = [];
    },
    handleDel(record) {
      console.log("del", record);
      const ts = this;
      const delMod = Modal.confirm({
        centered: true,
        maskClosable: true,
        title: "提示信息",
        content: `确定删除【${record.autoid}】的记录？`,
        onOk: () => {
          delCycleCoin({
            id: record.autoid,
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

      const res = await getCycleCoinList(this.queryParam);
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
