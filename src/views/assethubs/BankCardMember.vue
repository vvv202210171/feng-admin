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
        <span slot="action" slot-scope="text, record">
          <template>
            <a-button type="link" @click="handleEdit(record)"> 编辑 </a-button>
          </template>
        </span>
        <span slot="ext1" slot-scope="text, record">
          {{ record.fiatCode === "JPY" ? "支店名:" + record.ext1 : record.ext1 }}
        </span>
        <span slot="ext2" slot-scope="text, record">
          {{ record.fiatCode === "JPY" ? "支店番号:" + record.ext2 : record.ext2 }}
        </span>
        <template slot="state" slot-scope="text, record">
          <a-switch
            default-checked
            :checked="record.state === 'enable'"
            style="margin-bottom: 5px"
            checked-children="启用"
            un-checked-children="禁用"
            @change="changeState(record)"
          />
        </template>
      </a-table>

      <create-form
        ref="createModal"
        :visible="visible"
        :loading="confirmLoading"
        :roles="roleMenus"
        :model="mdl"
        @cancel="handleCancel"
        @ok="handleOk"
      />
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { STable, Ellipsis } from "@/components";
import CreateForm from "./modules/BankCardForm";
import { getBankCardInfo, updateBankState, updateBankById } from "@/api/assethub";

const columns = [
  {
    title: "ID",
    dataIndex: "autoid",
    width: 80,
  },
  {
    title: "账户",
    dataIndex: "member",
    width: 80,
  },
  {
    title: "银行账户",
    dataIndex: "bankAccount",
    width: 140,
  },
  {
    title: "银行名称",
    dataIndex: "bankName",
    width: 120,
  },
  {
    title: "持卡人",
    dataIndex: "holderName",
    width: 80,
  },
  {
    title: "区域号",
    dataIndex: "areaCode",
    width: 80,
  },
  {
    title: "手机号",
    dataIndex: "phone",
    width: 100,
  },
  {
    title: "法币编码",
    dataIndex: "fiatCode",
    width: 80,
  },
  {
    title: "扩展1",
    dataIndex: "ext1",
    width: 100,
    scopedSlots: { customRender: "ext1" },
  },
  {
    title: "扩展2",
    dataIndex: "ext2",
    scopedSlots: { customRender: "ext2" },
    width: 100,
  },
  {
    title: "状态",
    dataIndex: "state",
    width: 80,
    scopedSlots: { customRender: "state" },
  },
  {
    title: "更新次数",
    dataIndex: "updateCount",
    width: 60,
  },
  {
    title: "操作",
    dataIndex: "action",
    width: 150,
    scopedSlots: { customRender: "action" },
  },
];

export default {
  name: "ToaddressList",
  components: {
    STable,
    Ellipsis,
    CreateForm,
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
      this.mdl = null;
      this.visible = true;
    },
    async changeState(record) {
      console.log("rec", record);
      const res = await updateBankState({
        state: record.state == "enable" ? "disable" : "enable",
        autoid: record.autoid,
      });
      this.getData();
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
            updateBankById(values).then((res) => {
              this.visible = false;
              this.confirmLoading = false;
              // 重置表单数据
              form.resetFields();
              // 刷新表格
              // this.$refs.table.refresh()
              this.getData();

              this.$message.success("修改成功");
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

      const res = await getBankCardInfo(this.queryParam);
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
