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
        <a-form-item label="状态">
          <a-select style="width: 100px" v-model="queryParam.state">
            <a-select-option value=""> 全部 </a-select-option>
            <a-select-option value="enable"> 启用 </a-select-option>
            <a-select-option value="disable"> 关闭 </a-select-option>
          </a-select>
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
            :disabled="!$verify('111011')"
            >新建</a-button
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
        <template slot="imgUrl" slot-scope="text, record">
          <img :src="imgUrl(record.imgUrl)" alt="" width="64" height="64" />
        </template>
        <template slot="state" slot-scope="text, record">
          <span v-if="record.state === 'enable'">启用</span>
          <span v-else-if="record.state === 'disable'" style="color: #eb1345">关闭</span>
        </template>
        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="handleEdit(record)" :disabled="!$verify('111012')">编辑</a>
            <a-divider type="vertical" />
            <a @click="handleDel(record)">删除</a>
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
  getMinerList,
  delMiner,
  addMiner,
  editMiner,
} from "@/api/miner";
import { Modal } from "ant-design-vue";

// import StepByStepModal from './modules/StepByStepModal'
// import CreateForm from './modules/MinerForm'
const columns = [
  {
    dataIndex: "id",
    title: "ID",
    width: 80,
  },
  {
    dataIndex: "sort",
    title: "排序",
    width: 80,
  },
  {
    dataIndex: "name",
    title: "型号",
    width: 200,
  },
  {
    dataIndex: "imgUrl",
    title: "矿机图",
    width: 200,
    scopedSlots: { customRender: "imgUrl" },
  },
  {
    dataIndex: "price",
    title: "价格",
    width: 100,
  },
  {
    dataIndex: "payCoin",
    title: "支付币种",
    width: 80,
  },
  {
    dataIndex: "minNumber",
    title: "单笔最低投入",
    width: 120,
  },
  {
    dataIndex: "maxNumber",
    title: "单笔最高投入",
    width: 120,
  },
  {
    dataIndex: "minGas",
    title: "每日最低收益率",
    width: 140,
  },
  {
    dataIndex: "maxGas",
    title: "每日最高收益率",
    width: 140,
  },

  {
    dataIndex: "returnGas",
    title: "提前赎回扣除比例",
    width: 140,
  },
  {
    dataIndex: "cycle",
    title: "周期",
    width: 100,
  },
  {
    dataIndex: "projectProgress",
    title: "项目进度（百分比）",
    width: 100,
  },
  {
    dataIndex: "state",
    title: "状态",
    width: 80,
    scopedSlots: { customRender: "state" },
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
    field: "id",
    type: "input",
    decorator: {},
    disabled: true,
    hidden: true,
    span: 12,
  },
  {
    title: "支付币种",
    field: "payCoin",
    type: "select-currency",
    placeholder: "请选择币种",
    span: 12,
    decorator: { rules: [{ required: true, message: "请选择币种" }] },
  },
  {
    title: "型号",
    field: "name",
    type: "input",
    span: 12,
    placeholder: "请输入名称",
    decorator: { rules: [{ required: true, message: "请输入名称" }] },
  },
  {
    title: "价格",
    field: "price",
    type: "number",
    span: 12,
    placeholder: "请输入",
    decorator: { rules: [{ required: true, message: "请输入价格" }] },
  },
  {
    title: "单笔最低投入",
    field: "minNumber",
    type: "number",
    span: 12,
    placeholder: "请输入",
    decorator: { rules: [{ required: true, message: "请输入单笔最低投入" }] },
  },
  {
    title: "单笔最高投入",
    field: "maxNumber",
    type: "number",
    span: 12,
    placeholder: "请输入",
    decorator: { rules: [{ required: true, message: "请输入单笔最高投入" }] },
  },
  {
    title: "每日最低收益率",
    field: "minGas",
    type: "number",
    span: 12,
    placeholder: "请输入",
    decorator: {
      rules: [
        {
          validator: (rule, value) => {
            if (value == null || value === "") {
              return Promise.reject("请输入每日最低收益率");
            }
            if (Number(value) > 1) {
              return Promise.reject("每日最低收益率不能大于1");
            }
            return Promise.resolve();
          },
        },
      ],
    },
  },
  {
    title: "每日最高收益率",
    field: "maxGas",
    type: "number",
    span: 12,
    placeholder: "请输入",
    decorator: {
      rules: [
        {
          validator: (rule, value) => {
            if (value == null || value === "") {
              return Promise.reject("请输入每日最高收益率");
            }
            if (Number(value) > 1) {
              return Promise.reject("每日最高收益率不能大于1");
            }
            return Promise.resolve();
          },
        },
      ],
    },
  },

  {
    title: "提前赎回扣除比例",
    field: "returnGas",
    type: "number",
    span: 12,
    placeholder: "请输入",
    decorator: { rules: [{ required: true, message: "请输入提前赎回扣除比例" }] },
  },
  {
    title: "周期",
    field: "cycle",
    type: "number",
    span: 12,
    placeholder: "请输入",
    decorator: { rules: [{ required: true, message: "请输入周期" }] },
  },
  {
    title: "排序",
    field: "sort",
    type: "number",
    span: 12,
    placeholder: "请输入",
    decorator: { rules: [{ required: true, message: "请输入排序" }] },
  },
  {
    title: "项目进度百分比",
    field: "projectProgress",
    type: "number",
    placeholder: "请输入",
    span: 12,
    initialValue: 0,
    decorator: {
      rules: [
        {
          validator: (rule, value) => {
            if (value == null || value === "") {
              return Promise.reject("请输入项目进度百分比");
            }
            if (Number(value) > 100) {
              return Promise.reject("最高项目进度百分比不能大于100");
            }
            return Promise.resolve();
          },
        },
      ],
    },
  },
  {
    title: "状态",
    field: "state",
    span: 12,
    type: "select",
    placeholder: "请选择",
    options: [
      { val: "enable", title: "启用" },
      { val: "disable", title: "关闭" },
    ],
    decorator: { rules: [{ required: true, message: "请选择状态" }] },
  },
  {
    title: "图片",
    field: "imgUrl",
    span: 12,
    type: "image",
    placeholder: "请选择",
    decorator: { rules: [{ required: true, message: "请选择图片" }] },
  },
];

export default {
  name: "MinerList",
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
      modalConfig: {},
      modalOptions,
      roleMenus: [],
      // 高级搜索 展开/关闭
      advanced: false,
      // // 搜索状态
      // disabledSearch: false,
      // 查询参数
      queryParam: {
        key: "",
        state: "enable",
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
            if (e === "payCoin") {
              values["coin"] = values[e];
            }
          });
          console.log(values);
          if (values.id > 0) {
            // 修改 e.g.
            editMiner(values)
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
            addMiner(values)
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
      const ts = this;
      const delMod = Modal.confirm({
        centered: true,
        maskClosable: true,
        title: "提示信息",
        content: `确定删除【${record.id}】的记录？`,
        onOk: () => {
          // return new Promise((resolve, reject) => {
          //   setTimeout(Math.random() > 0.5 ? resolve : reject, 1500)
          // }).catch(() => console.log('Oops errors!'))
          // return this.$store.dispatch('Logout').then(() => {
          //   this.$router.push({ name: 'login' })
          // })
          delMiner({
            id: record.id,
          }).then((res) => {
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

      const res = await getMinerList(this.queryParam);
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
