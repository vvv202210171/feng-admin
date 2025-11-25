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
            v-model="queryParam.value"
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
            :disabled="!$verify('113011') || disabledSearch"
            type="primary"
            @click="handleAdd"
            >派送电子币</a-button
          >
        </a-form-item>
      </a-form>

      <a-table
        ref="table"
        size="default"
        :loading="loading"
        :scroll="{ x: 980 }"
        bordered
        :columns="columns"
        :dataSource="loadData"
        :pagination="pagination"
      >
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
  getMainCoins,
  addUsaccount,
  getUsaccountList,
} from "@/api/assethub";
// import { Modal } from 'ant-design-vue'

// import StepByStepModal from './modules/StepByStepModal'
// import CreateForm from './modules/UsaccountForm'

const columns = [
  {
    title: "ID",
    dataIndex: "autoid",
    width: 80,
  },
  {
    title: "账户",
    dataIndex: "member",
    width: 90,
  },
  {
    title: "手机",
    dataIndex: "tel",
  },
  {
    title: "邮箱",
    dataIndex: "email",
  },
  {
    title: "币种",
    dataIndex: "coin",
    width: 80,
  },
  {
    dataIndex: "usable",
    title: "币币账户可用余额",
  },
  {
    dataIndex: "disable",
    title: "币币账户冻结余额",
    color: "#eb1345",
  },
  {
    dataIndex: "other",
    title: "币币账户其他",
  },
  {
    dataIndex: "contractUsable",
    title: "合约账户可用余额",
  },
  {
    dataIndex: "contractDisable",
    title: "合约账户冻结余额",
    color: "#eb1345",
  },
  {
    dataIndex: "contractOther",
    title: "合约账户其他",
    width: 160,
  },
  {
    dataIndex: "allUsable",
    title: "可用总额",
  },
  {
    dataIndex: "allDisable",
    title: "冻结总额",
    color: "#eb1345",
  },
  {
    dataIndex: "allOther",
    title: "其他总额",
  },
];
const modalOptions = [
  // { title: 'ID', field: 'autoid', type: 'input', decorator: {}, disabled: true, hidden: true },
  {
    title: "币种名称",
    field: "coin",
    type: "select-currency",
    klineType: "Crypto",
    placeholder: "请选择账号",
    search: true,
    options: [],
    decorator: { rules: [{ required: true, message: "请选择主币种" }] },
  },
  {
    title: "会员账号",
    field: "member",
    type: "input",
    placeholder: "请输入账号",
    decorator: { rules: [{ required: true, message: "请输入账号" }] },
  },
  {
    title: "增加还是减少",
    field: "type",
    type: "select",
    placeholder: "请选择类型",
    options: [
      { val: "add", title: "增加" },
      { val: "bank", title: "减少" },
    ],
    decorator: { rules: [{ required: true, message: "请选择类型" }] },
  },
  {
    title: "派送类型",
    field: "cate",
    type: "select",
    placeholder: "请选择类型",
    options: [
      { val: "benjin", title: "本金" },
      { val: "youhui", title: "优惠" },
    ],
    decorator: { rules: [{ required: true, message: "请选择类型" }] },
  },
  {
    title: "资产类型",
    field: "account",
    type: "select",
    placeholder: "请选择资产类型",
    options: [
      { val: "usable", title: "可用资产" },
      { val: "disable", title: "冻结资产" },
      { val: "other", title: "锁仓资产" },
    ],
    decorator: { rules: [{ required: true, message: "请选择资产类型" }] },
  },

  {
    title: "派送数量",
    field: "number",
    type: "number",
    placeholder: "请输入派送数量",
    decorator: { rules: [{ required: true, message: "请输入派送数量" }] },
  },
  {
    title: "哈希值或备注",
    field: "tag",
    type: "textarea",
    placeholder: "请输入哈希值或备注",
    decorator: { rules: [{ required: true, message: "请输入哈希值或备注" }] },
  },
];

export default {
  name: "UsaccountList",
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
        value: "",
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
      // 币种列表
      coinsData: [],
      coinOptions: [],
    };
  },

  created() {
    // getRoleList({ t: new Date() })
    getMainCoins().then((res) => {
      const { code, data, msg } = res;
      if (code === 0) {
        const coins = data;
        console.log("coins", coins);
        const opt = {};
        this.coinsData = coins;
        coins.forEach((el) => {
          if (!opt[el.coin]) {
            opt[el.coin] = 1;
          } else {
            opt[el.coin]++;
          }
        });
        this.coinOptions = Object.keys(opt).map((el) => {
          return { val: el, title: el };
        });
        this.modalOptions.find((el) => el.field === "coin").options = this.coinOptions;
      } else {
        this.$message.error(msg);
      }
    });
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
      this.mdl = null;
      this.visible = true;
      this.modalConfig["title"] = "派送电子币";
    },
    handleEdit(record) {
      // get menu data
      this.roleMenus = [];
      this.visible = true;
      this.mdl = { ...record };
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
          // console.log(values)
          addUsaccount(values)
            .then((res) => {
              // console.log(res)
              const { code, msg } = res;
              if (code === 0) {
                this.visible = false;
                this.confirmLoading = false;
                // 重置表单数据
                form.resetFields();
                // 刷新表格
                // this.$refs.table.refresh()
                this.getData();

                this.$message.success("添加成功");
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

      const res = await getUsaccountList(this.queryParam);
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
