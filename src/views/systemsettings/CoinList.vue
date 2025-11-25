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
        <a-form-item>
          <a-button
            type="primary"
            icon="plus"
            @click="handleAdd"
            :disabled="!$verify('107026')"
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
      >
        <template slot="logo" slot-scope="text, record">
          <img :src="imgUrl(record.logo)" alt="" width="64" height="64" />
        </template>

        <span slot="isin" slot-scope="text, record">
          {{ record.isin | statusMappingFormat }}
        </span>

        <span slot="isout" slot-scope="text, record">
          {{ record.isout | statusMappingFormat }}
        </span>

        <span slot="istag" slot-scope="text, record">
          {{ record.istag | statusMappingFormat }}
        </span>

        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="handleEdit(record)" :disabled="!$verify('107027')">编辑</a>
            <a-divider type="vertical" />
            <a @click="handleDel(record)" :disabled="!$verify('107025')">删除</a>
          </template>
        </span>
      </a-table>

      <s-modal
        ref="createModal"
        :config="modalConfig"
        :visible="visible"
        :loading="confirmLoading"
        :options="modalOptions"
        :model="mdl"
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
  getCoinList,
  delCoin,
  addCoin,
  editCoin,
} from "@/api/systemsetting";
import { Modal } from "ant-design-vue";

// import StepByStepModal from './modules/StepByStepModal'
// import CreateForm from './modules/CoinForm'

const columns = [
  {
    title: "ID",
    dataIndex: "autoid",
    width: 80,
  },
  {
    dataIndex: "logo",
    title: "图片",
    width: 100,
    scopedSlots: { customRender: "logo" },
    // , templet: function (d) {
    //       return '<a href="' + d.logo + '" target="_blank"><img src="' + d.logo + '" height="64" width="64" /></a>';
    //   }
  },
  {
    dataIndex: "coin",
    title: "名称",
    width: 100,
  },
  {
    dataIndex: "symbol",
    title: "公链名称",
    width: 100,
  },
  {
    dataIndex: "blockname",
    title: "公链币种",
    width: 100,
  },
  {
    dataIndex: "outgas",
    title: "最低提币费用",
    width: 120,
  },
  {
    dataIndex: "feeRate",
    title: "提币到地址手续费比例",
    width: 200,
  },
  {
    dataIndex: "bankFeeRate",
    title: "提币到银行卡手续费比例",
    width: 200,
  },
  {
    dataIndex: "isin",
    title: "充币",
    width: 100,
    scopedSlots: { customRender: "isin" },
    //  templet: function (d) {
    //       if (d.isin == "enable") {
    //           return "启用";
    //       } else if (d.isin == "disable") {
    //           return "禁用";
    //       }
    //   }
  },
  {
    dataIndex: "isout",
    title: "提币",
    width: 100,
    scopedSlots: { customRender: "isout" },
    // , templet: function (d) {
    //       if (d.isout == "enable") {
    //           return "启用";
    //       } else if (d.isout == "disable") {
    //           return "禁用";
    //       }
    //   }
  },
  {
    dataIndex: "oneoutlow",
    title: "提币单次最低限额",
  },
  {
    dataIndex: "oneinlow",
    title: "充值单次最低限额",
  },
  {
    dataIndex: "oneoutheight",
    title: "提币单次最高限额",
  },
  {
    dataIndex: "dayoutheight",
    title: "提币单天最高限额",
  },
  {
    dataIndex: "istag",
    title: "标签",
    width: 150,
    scopedSlots: { customRender: "istag" },
    // , templet: function (d) {
    //       if (d.istag == "enable") {
    //           return "启用";
    //       } else if (d.istag == "disable") {
    //           return "禁用";
    //       }
    //   }
  },
  {
    title: "操作",
    dataIndex: "action",
    width: 150,

    scopedSlots: { customRender: "action" },
  },
];
const modalOptions = [
  {
    title: "ID",
    field: "autoid",
    type: "input",
    decorator: {},
    disabled: true,
    hidden: true,
  },
  {
    title: "币种名称1",
    field: "coin",
    type: "select-currency",
    placeholder: "请选择",
    decorator: { rules: [{ required: true, message: "请选择币种" }] },
  },

  {
    title: "所属公链",
    field: "blockname",
    type: "input",
    placeholder: "请输入",
    decorator: { rules: [{ required: true, message: "所属公链不能为空" }] },
  },

  {
    title: "币种全称",
    field: "symbol",
    type: "input",
    placeholder: "请输入",
    decorator: { rules: [{ required: true, message: "币种全称不能为空" }] },
  },
  {
    title: "提币到地址手续费",
    field: "feeRate",
    type: "number",
    placeholder: "请输入",
    decorator: { rules: [{ required: true, message: "提币到地址不能为空" }] },
  },
  {
    title: "提币到银行卡手续费",
    field: "bankFeeRate",
    type: "number",
    placeholder: "请输入",
    decorator: { rules: [{ required: true, message: "提币到地址不能为空" }] },
  },
  {
    title: "单次最低充值限额",
    field: "oneinlow",
    type: "number",
    span: 12,
    placeholder: "请输入",
    decorator: { rules: [{ required: true, message: "单次最低充值限额不能为空" }] },
  },
  {
    title: "单次最低提币限额",
    field: "oneoutlow",
    type: "number",
    span: 12,
    placeholder: "请输入",
    decorator: { rules: [{ required: true, message: "单次最低提币限额不能为空" }] },
  },
  {
    title: "单次最高提币限额",
    field: "oneoutheight",
    type: "number",
    span: 12,
    placeholder: "请输入",
    decorator: { rules: [{ required: true, message: "单次最高提币限额不能为空" }] },
  },
  {
    title: "单日最高提币限额",
    field: "dayoutheight",
    span: 12,
    type: "number",
    placeholder: "请输入",
    decorator: { rules: [{ required: true, message: "单日最高提币限额不能为空" }] },
  },

  {
    title: "充值",
    field: "isin",
    type: "select",
    span: 12,
    options: [
      { val: "enable", title: "启用" },
      { val: "disable", title: "禁用" },
    ],
    decorator: { rules: [{ required: true, message: "请选择充值" }] },
  },
  {
    title: "提币",
    field: "isout",
    type: "select",
    span: 12,
    options: [
      { val: "enable", title: "启用" },
      { val: "disable", title: "禁用" },
    ],
    decorator: { rules: [{ required: true, message: "请选择提币" }] },
  },
  {
    title: "标签",
    field: "istag",
    type: "select",
    span: 12,
    options: [
      { val: "enable", title: "启用" },
      { val: "disable", title: "禁用" },
    ],
    decorator: { rules: [{ required: true, message: "请选择标签" }] },
  },
  {
    title: "最低提币费",
    field: "outgas",
    type: "number",
    span: 12,
    placeholder: "请输入",
    decorator: { rules: [{ required: true, message: "最低提币费不能为空" }] },
  },
];

export default {
  name: "CoinList",
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
      // create model
      visible: false,
      confirmLoading: false,
      mdl: null,
      modalOptions,
      roleMenus: [],
      modalConfig: {},
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
      this.modalConfig["title"] = "新增";
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
      this.modalConfig["title"] = "编辑";
    },
    handleOk() {
      const form = this.$refs.createModal.form;
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
            editCoin(values)
              .then((res) => {
                console.log(res);
                const { code, msg } = res;
                if (code === 0) {
                  this.visible = false;
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
            // 新增
            addCoin(values)
              .then((res) => {
                console.log(res);
                const { code, msg } = res;
                if (code === 0) {
                  this.visible = false;
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
          }
        } else {
          this.confirmLoading = false;
        }
      });
    },
    handleCancel() {
      this.visible = false;
      this.confirmLoading = false;
      const form = this.$refs.createModal.form;
      form.resetFields(); // 清理表单数据（可不做）
      this.roleMenus = [];
    },
    handleDel(record) {
      console.log("del", record);
      const username = this.$store.getters.username;
      const ts = this;
      const delMod = Modal.confirm({
        centered: true,
        maskClosable: true,
        title: "提示信息",
        content: `确定删除【${record.autoid}】的记录？`,
        onOk: () => {
          delCoin({
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

      const res = await getCoinList(this.queryParam);
      const { code, data, count } = res;
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
