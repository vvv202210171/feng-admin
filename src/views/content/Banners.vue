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

        <a-form-item label="终端">
          <a-select style="width: 100px" v-model="queryParam.type">
            <a-select-option value=""> 请选择 </a-select-option>
            <a-select-option value="app"> 手机端 </a-select-option>
            <a-select-option value="wap"> PC端 </a-select-option>
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
            :disabled="!$verify('102012')"
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

        <span slot="banner" slot-scope="text, record">
          <img :src="imgUrl(record.banner)" width="200" />
        </span>

        <template slot="link" slot-scope="text, record">
          <a class="layui-blue" :href="record.link" target="_blank">{{ record.link }}</a>
          <!-- <span v-if="record.state === 'already'">已回复</span>
          <span v-if="record.state === 'sending'" style="color: #eb1345;">待回复</span> -->
        </template>

        <span slot="type" slot-scope="text, record">
          {{ record.type === "wap" ? "PC端" : "手机端" }}
        </span>

        <span slot="locale" slot-scope="text, record">
          {{ getLangs(record.locale) }}
        </span>

        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="handleEdit(record)" :disabled="!$verify('102013')">编辑</a>
            <a-divider type="vertical" />
            <a @click="handleDel(record)" :disabled="!$verify('102011')">删除</a>
          </template>
        </span>
      </a-table>

      <s-modal
        ref="createModal"
        :config="modalConfig"
        :visible="add.visible"
        :loading="confirmLoading"
        :options="modalOptions"
        :model="add.mdl"
        @cancel="handleCancel"
        @ok="handleOk"
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
  getBannerList,
  delBanner,
  addBanner,
  editBanner,
} from "@/api/contents";
import { Modal } from "ant-design-vue";

// import StepByStepModal from './modules/StepByStepModal'
// import CreateForm from './modules/BannersForm'

const columns = [
  {
    dataIndex: "autoid",
    title: "ID",
    width: 80,
  },
  {
    dataIndex: "banner",
    title: "图片",
    width: 220,
    scopedSlots: { customRender: "banner" },
  },
  {
    dataIndex: "link",
    title: "链接地址",
    width: 160,
    scopedSlots: { customRender: "link" },
  },
  {
    dataIndex: "sort",
    title: "排序号",
    width: 100,
  },
  {
    dataIndex: "type",
    title: "终端",
    width: 100,
    scopedSlots: { customRender: "type" },
  },
  {
    dataIndex: "locale",
    title: "语言",
    width: 100,
    scopedSlots: { customRender: "locale" },
  },
  {
    dataIndex: "writedate",
    title: "发布时间",
    width: 180,
  },
  {
    title: "操作",
    dataIndex: "action",
    width: 150,
    scopedSlots: { customRender: "action" },
  },
];

const modalOptions = [
  // { title: 'ID', field: 'autoid', type: 'input', decorator: {}, disabled: true },
  {
    title: "链接地址",
    field: "link",
    type: "input",
    placeholder: "请输入链接",
    decorator: { rules: [{ required: true, message: "请输入链接地址" }] },
  },
  {
    title: "排序编号",
    field: "sort",
    type: "number",
    placeholder: "请输入编号",
    decorator: { rules: [{ required: true, message: "请输入排序编号" }] },
  },
  {
    title: "终端",
    field: "type",
    type: "select",
    options: [
      { val: "app", title: "手机端" },
      { val: "wap", title: "PC" },
    ],
    decorator: {
      initialValue: "app",
      rules: [{ required: true, message: "请选择类型" }],
    },
  },
  {
    title: "语言版本",
    field: "locale",
    type: "select-langs",
    decorator: {
      initialValue: "cn",
      rules: [{ required: true, message: "请选择语言版本" }],
    },
  },
  {
    title: "图片",
    field: "imgsrc",
    type: "image",
    decorator: { rules: [{ required: true, message: "请上传图片" }] },
  },
];
const editOptions = [
  { title: "ID", field: "autoid", type: "input", decorator: {}, disabled: true },
  {
    title: "链接地址",
    field: "link",
    type: "input",
    placeholder: "请输入链接",
    decorator: { rules: [{ required: true, message: "请输入链接地址" }] },
  },
  {
    title: "排序编号",
    field: "sort",
    type: "number",
    placeholder: "请输入编号",
    decorator: { rules: [{ required: true, message: "请输入排序编号" }] },
  },
];

export default {
  name: "Banners",
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
      confirmLoading: false,
      roleMenus: [],
      modalConfig: {},
      // create model
      add: {
        visible: false,
        mdl: null,
      },
      modalOptions,
      // edit model
      edit: {
        visible: false,
        mdl: null,
      },
      editOptions,
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
    startChange(date, dateString) {
      this.queryParam.startdate = dateString;
    },
    endChange(date, dateString) {
      this.queryParam.enddate = dateString;
    },
    handleEdit(record) {
      // get menu data
      this.roleMenus = [];
      this.edit.visible = true;
      this.edit.mdl = { ...record };
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
            if (e === "imgsrc") {
              values["banner"] = values[e];
            }
          });
          console.log(values);
          if (!values.autoid) {
            addBanner(values)
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
          }
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
          // console.log(values)
          if (values.autoid > 0) {
            // 修改 e.g.
            editBanner(values)
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
      const form = this.$refs.createModal.form;
      form.resetFields(); // 清理表单数据（可不做）
      const editform = this.$refs.editModal.form;
      editform.resetFields(); // 清理表单数据（可不做）
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
          delBanner({
            autoid: record.autoid,
          }).then((res) => {
            ts.getData();
            delMod.destroy();
          });
        },
        onCancel() {},
      });
    },

    doSearch() {
      console.log(this.queryParam);
      this.getData();
    },
    async getData() {
      this.loading = true;

      const res = await getBannerList(this.queryParam);
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
