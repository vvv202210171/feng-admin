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
          <a-select style="width: 100px" v-model="queryParam.type">
            <a-select-option value=""> 请选择 </a-select-option>
            <a-select-option value="notice"> 最新公告 </a-select-option>
            <a-select-option value="help"> 帮助中心 </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="语言">
          <a-select style="width: 150px" v-model="queryParam.locale">
            <a-select-option value=""> 请选择 </a-select-option>l
            <a-select-option v-for="k in Object.keys(langs)" :key="k" :value="k">
              {{ langs[k] }}
            </a-select-option>
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
        <a-form-item>
          <a-button
            class="ml6"
            type="primary"
            icon="plus"
            @click="handleAdd"
            :disabled="!$verify('102023')"
            >添加</a-button
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
        <!-- :rowSelection="rowSelection" -->

        <span slot="type" slot-scope="text, record">
          {{
            record.type === "notice"
              ? "最新公告"
              : record.type === "help"
              ? "帮助中心"
              : record.type
          }}
        </span>

        <span slot="state" slot-scope="text, record">
          {{ record.state === "enable" ? "启用" : "禁用" }}
        </span>

        <span slot="locale" slot-scope="text, record">
          {{ getLangs(record.locale) }}
        </span>

        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="handleEdit(record)" :disabled="!$verify('102024')">编辑</a>
            <a-divider type="vertical" />
            <a @click="handleDel(record)" :disabled="!$verify('102022')">删除</a>
          </template>
        </span>
      </a-table>

      <s-modal
        ref="createModal"
        :config="modalConfig"
        :visible="visible"
        :loading="confirmLoading"
        :width="1200"
        :options="modalOptions"
        :model="mdl"
        @cancel="handleCancel"
        @ok="handleOk"
      />
    </a-card>
  </page-header-wrapper>
</template>

<script>
import moment from "moment";
import "moment/locale/zh-cn";
import { STable, Ellipsis, SModal } from "@/components";
import {
  // getRoleList,
  getQuestList,
  delQuest,
  addQuest,
  editQuest,
} from "@/api/contents";
import { Modal } from "ant-design-vue";

// import StepByStepModal from './modules/StepByStepModal'
// import CreateForm from './modules/ArticlesForm'

const columns = [
  {
    dataIndex: "autoid",
    title: "ID",
    width: 100,
  },
  {
    dataIndex: "title",
    title: "标题",
    width: 200,
  },
  {
    dataIndex: "state",
    title: "状态",
    width: 100,
    scopedSlots: { customRender: "state" },
  },
  {
    dataIndex: "locale",
    title: "语言",
    width: 100,
    scopedSlots: { customRender: "locale" },
  },
  {
    dataIndex: "type",
    title: "类型",
    width: 150,
    scopedSlots: { customRender: "type" },
  },
  {
    dataIndex: "readnum",
    title: "阅读量",
    width: 100,
  },
  {
    dataIndex: "wrong",
    title: "否定",
    width: 100,
  },
  {
    dataIndex: "rights",
    title: "点赞",
    width: 100,
  },
  {
    dataIndex: "writedate",
    title: "发布时间",
    width: 200,
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
    title: "标题",
    field: "title",
    type: "input",
    placeholder: "请输入标题",
    decorator: { rules: [{ required: true, message: "请输入标题" }] },
  },
  {
    title: "阅读人数",
    field: "readnum",
    type: "number",
    placeholder: "请输入",
    decorator: { rules: [{ required: true, message: "请输入人数" }] },
  },
  {
    title: "发布时间",
    field: "writedate",
    type: "timer",
    placeholder: "yyyy-MM-dd HH:mm:ss",
    decorator: { rules: [{ required: true, message: "发布时间不能为空" }] },
  }, // HH:mm:ss
  {
    title: "类型",
    field: "type",
    type: "select",
    options: [
      { val: "notice", title: "最新公告" },
      { val: "help", title: "帮助中心" },
    ],
    decorator: { rules: [{ required: true, message: "请选择类型" }] },
  },
  {
    title: "状态",
    field: "state",
    type: "select",
    options: [
      { val: "enable", title: "启用" },
      { val: "disable", title: "禁用" },
    ],
    decorator: { rules: [{ required: true, message: "请选择状态" }] },
  },
  {
    title: "语言",
    field: "locale",
    type: "select-langs",
    decorator: { rules: [{ required: true, message: "请选择语言版本" }] },
  },
  {
    title: "公告内容",
    field: "reply",
    type: "richEditor",
    span: 24,
    placeholder: "请输入内容",
    decorator: { initialValue: "", rules: [{ required: true, message: "请输入内容" }] },
  },
];

export default {
  name: "Articles",
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
      moment,
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
  filters: {},
  created() {
    this.doSearch();
  },
  computed: {
    // 搜索状态
    disabledSearch() {
      return this.loading;
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
      const mdl = { ...record };
      mdl.writedate = moment(record.writedate, "YYYY-MM-DD HH:mm");
      this.mdl = mdl;
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
          // 时间数据重新赋值
          values["writedate"] = values["writedate"].format("YYYY-MM-DD HH:mm:ss");
          console.log(values);
          if (values.autoid > 0) {
            // 修改 e.g.
            editQuest(values)
              .then((res) => {
                console.log(res);
                const { code, msg } = res;
                if (code == 0) {
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
            addQuest(values)
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
          delQuest({
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
      this.pagination.onChange(1, this.pagination.pageSize);
    },
    async getData() {
      this.loading = true;

      const res = await getQuestList(this.queryParam);
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
