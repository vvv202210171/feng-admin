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
        <span slot="state" slot-scope="text, record">
          {{ record.state === "enable" ? "启用" : "禁用" }}
        </span>

        <span slot="lang" slot-scope="text, record">
          {{ getLangs(record.lang) }}
        </span>
        <span slot="imgUrl" slot-scope="text, record">
          <img :src="imgUrl(record.imgUrl)" width="200" />
        </span>

        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="handleEdit(record)" :disabled="!$verify('102024')">编辑</a>
            <a-divider type="vertical" />
            <a @click="handleDel(record)" :disabled="!$verify('102022')">删除</a>
          </template>
        </span>
      </a-table>

      <NewsForm
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
import moment from "moment";
import "moment/locale/zh-cn";
import { STable, Ellipsis } from "@/components";
import {
  // getRoleList,
  getNewsList,
  delNews,
  addNews,
  editNews,
} from "@/api/contents";
import NewsForm from "./modules/NewsForm.vue";

import { Modal } from "ant-design-vue";

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
    dataIndex: "subTitle",
    title: "子标题",
    width: 200,
  },
  {
    dataIndex: "state",
    title: "状态",
    width: 100,
    scopedSlots: { customRender: "state" },
  },
  {
    dataIndex: "lang",
    title: "语言",
    width: 100,
    scopedSlots: { customRender: "lang" },
  },
  {
    dataIndex: "imgUrl",
    title: "图片",
    width: 100,
    scopedSlots: { customRender: "imgUrl" },
  },
  {
    dataIndex: "author",
    title: "作者",
    width: 100,
  },

  {
    dataIndex: "writedate",
    title: "创建时间",
    width: 200,
  },
  {
    dataIndex: "publishDate",
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
    span: 24,
    placeholder: "请输入标题",
    decorator: { rules: [{ required: true, message: "请输入标题" }] },
  },
  {
    title: "子标题",
    field: "subTitle",
    type: "input",
    span: 8,
    placeholder: "请输入标题",
    decorator: { rules: [{ required: true, message: "请输入标题" }] },
  },
  {
    title: "作者",
    field: "author",
    type: "input",
    span: 8,
    placeholder: "请输入",
  },
  {
    title: "语言",
    field: "lang",
    span: 8,
    type: "select-langs",
    decorator: {
      initialValue: "cn",
      rules: [{ required: true, message: "请选择语言版本" }],
    },
  },

  {
    title: "发布时间",
    field: "publishDate",
    type: "timer",
    span: 8,
    placeholder: "yyyy-MM-dd HH:mm:ss",
    decorator: { rules: [{ required: true, message: "发布时间不能为空" }] },
  }, // HH:mm:ss

  {
    title: "状态",
    field: "state",
    type: "select",
    span: 8,
    options: [
      { val: "enable", title: "启用" },
      { val: "disable", title: "禁用" },
    ],
    decorator: { rules: [{ required: true, message: "请选择状态" }] },
  },
  {
    title: "图片",
    field: "imgUrl",
    type: "image",
    span: 8,
    decorator: { rules: [{ required: true, message: "请选择图片" }] },
  },
  {
    title: "公告内容",
    field: "detail",
    type: "richEditor",
    span: 24,
    placeholder: "请输入内容",
    decorator: { initialValue: "", rules: [{ required: true, message: "请输入内容" }] },
  },
  // { title: '图片', field: 'imgsrc', type: 'image', decorator: { rules: [{ required: true, message: '请上传图片' }] } }
];

export default {
  name: "Articles",
  components: {
    STable,
    Ellipsis,
    NewsForm,
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
        page: 1,
        limit: 10,
      },
      // 加载数据方法 必须为 Promise 对象
      loadData: [],
      pagination: {
        total: 30,
        current: 1,
        pageSize: 10,
        onChange: (page, pageSize) => {
          this.pagination.current = page;
          this.pagination.pageSize = pageSize;
          this.queryParam.page = page;
          this.queryParam.limit = pageSize;
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
          if (values.autoid > 0) {
            // 修改 e.g.
            editNews(values)
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
            addNews(values)
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
          delNews({
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
      // const reNewsParameters = Object.assign({}, parameter, this.queryParam)
      const res = await getNewsList(this.queryParam);
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
