<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <!-- :model="queryParam" -->
      <a-form
        name="adminSearch"
        layout="inline"
        autocomplete="off"
        style="margin-bottom: 14px"
        @submit="doSearch"
      >
        <a-form-item label="">
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
            :disabled="!$verify('107022')"
            >新建管理员</a-button
          >
        </a-form-item>
      </a-form>

      <div class="table-operator">
        <!-- <a-dropdown v-action:edit v-if="selectedRowKeys.length > 0">
          <a-menu slot="overlay">
            <a-menu-item key="1"><a-icon type="delete" />删除用户</a-menu-item>
            <a-menu-item key="2"><a-icon type="lock" />锁定用户</a-menu-item>
          </a-menu>
          <a-button style="margin-left: 8px">
            批量操作 <a-icon type="down" />
          </a-button>
        </a-dropdown> -->
      </div>

      <!-- <s-table
        ref="table"
        size="default"
        rowKey="key"
        :columns="columns"
        :data="loadData"
        :alert="true"
        :rowSelection="rowSelection"
        showPagination="auto"
      >
        <span slot="serial" slot-scope="text, record, index">
          {{ index + 1 }}
        </span>

        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="handleEdit(record)">编辑</a>
            <a-divider type="vertical" />
            <a @click="handleDel(record)">删除</a>
          </template>
        </span>
      </s-table> -->
      <a-table
        ref="table"
        size="default"
        row-key="autoid"
        :scroll="{ x: 980 }"
        bordered
        :loading="loading"
        :columns="columns"
        :dataSource="loadData"
        :pagination="pagination"
      >
        <!-- <span slot="range" slot-scope="text, record">
          <trend :flag="record.status === 0 ? 'up' : 'down'">
            {{ text }}%
          </trend>
        </span> -->

        <span slot="issuper" slot-scope="text, record">
          {{ record.issuper ? "Super" : "管理员" }}
        </span>
        <span slot="action" slot-scope="text, record">
          <template>
            <!-- v-if="username === 'admin'"  v-if="username === 'admin' && record.username !== 'admin'" -->
            <a @click="handleEdit(record)" :disabled="!$verify('107023')">编辑</a>
            <a-divider type="vertical" />
            <!-- <a @click="handleDel(record)" :disabled="!$verify('107021')">删除</a> -->
            <!-- <a-divider type="vertical" /> -->
            <a @click="handleCode(record)" :disabled="!$verify('107023')">修改密码</a>
          </template>
        </span>
      </a-table>

      <CreateForm
        ref="createModal"
        :visible="visible"
        :loading="confirmLoading"
        :roles="roleMenus"
        :model="mdl"
        :issuper1="issuper1"
        @cancel="handleCancel"
        @ok="handleOk"
        @transferChange="transferChange"
      />
      <ChangeCode
        ref="chagneCode"
        :visible="visibleChangeCode"
        :roles="roleMenus"
        :model="changePwdModel"
        @cancel="handleChangePwdModelCancel"
        @ok="handleCodeOk"
        @transferChange="transferChange"
      />
      <!-- <step-by-step-modal ref="modal" @ok="handleOk"/> -->
    </a-card>
  </page-header-wrapper>
</template>

<script>
import moment from "moment";
import { STable, Ellipsis } from "@/components";
import {
  // getRoleList,
  getAdminList,
  delAdmin,
  addAdmin,
  editAdmin,
  getAdminMenu,
  getAdminNotMenu,
  getAdminNotMenu2,
  editAdminPwd,
} from "@/api/systemsetting";
import config from "@/config/defaultSettings";
import { Modal } from "ant-design-vue";

// import StepByStepModal from './modules/StepByStepModal'
import CreateForm from "./modules/AdminForm";
import ChangeCode from "./modules/ChangeCode";

const columns = [
  {
    title: "ID",
    dataIndex: "autoid",
    width: 80,
  },
  {
    title: "账号",
    dataIndex: "username",
    width: 200,
  },
  {
    title: "类型",
    dataIndex: "issuper",
    width: 200,
    scopedSlots: { customRender: "issuper" },
  },
  {
    title: "电话号码",
    dataIndex: "tel",
    width: 150,
  },
  {
    title: "邮箱",
    dataIndex: "email",
    width: 200,
  },
  {
    title: "备注",
    dataIndex: "remarks",
    width: 250,
  },
  {
    title: "添加时间",
    dataIndex: "writedate",
    width: 200,
  },
  {
    title: "操作",
    dataIndex: "action",
    width: 150,
    scopedSlots: { customRender: "action" },
  },
];

// const statusMap = {
//   0: {
//     status: 'default',
//     text: '关闭'
//   },
//   1: {
//     status: 'processing',
//     text: '运行中'
//   },
//   2: {
//     status: 'success',
//     text: '已上线'
//   },
//   3: {
//     status: 'error',
//     text: '异常'
//   }
// }

export default {
  name: "AdminList",
  components: {
    STable,
    Ellipsis,
    CreateForm,
    ChangeCode,
    // StepByStepModal
  },
  data() {
    // this.columns = columns
    return {
      version: config.version, // 接口版本
      username: null,
      loading: false,
      issuper1: false,
      columns,
      rolesArr: [],
      targetsArr: [],
      // create model
      visible: false,
      confirmLoading: false,
      visibleChangeCode: false,
      mdl: null,
      changePwdModel: null,
      roleMenus: {},
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
      // loadData: parameter => {
      //   const requestParameters = Object.assign({}, parameter, this.queryParam)
      //   console.log('loadData request parameters:', requestParameters)
      //   return getAdminList(requestParameters)
      //     .then(res => {
      //       console.log(res)
      //       if (res.code === '0') {
      //         return res.data
      //       } else {
      //         return []
      //       }
      //     })
      // },,
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
    this.username = this.$store.getters.username;
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
    async handleAdd() {
      // get menu data
      this.loading = true;
      await this.getRoles();
      this.roleMenus = {
        rolesArr: this.rolesArr,
        targetsArr: this.targetsArr,
      };
      // console.log(this.roleMenus)
      this.mdl = null;
      this.visible = true;
      // this.actions = 'add'
      setTimeout(() => {
        this.loading = false;
      }, 300);
    },
    async handleEdit(record) {
      // get menu data
      this.loading = true;
      await this.getRoles(record);
      this.roleMenus = {
        rolesArr: this.rolesArr,
        targetsArr: this.targetsArr,
      };
      // console.log(this.roleMenus)
      this.visible = true;
      this.mdl = {
        ...record,
        user: record.username,
        title: "编辑",
      };
      // this.actions = 'edit'
      setTimeout(() => {
        this.loading = false;
      }, 300);
    },
    async handleCode(record) {
      // get menu data
      this.loading = true;
      await this.getRoles(record);
      this.roleMenus = {
        rolesArr: this.rolesArr,
        targetsArr: this.targetsArr,
      };
      // console.log(this.roleMenus)
      this.visibleChangeCode = true;
      this.changePwdModel = {
        ...record,
        title: "修改密码",
      };
      // this.actions = 'edit'
      setTimeout(() => {
        this.loading = false;
      }, 300);
    },
    // 获取权限
    async getRoles(record) {
      // const targetsArr = []
      this.targetsArr = [];
      this.rolesArr = [];
      this.roleMenus = {};
      // for (let i = 0; i < 20; i++) {
      //   const data = {
      //     key: i.toString(),
      //     title: `content${i + 1}`,
      //     description: `description of content${i + 1}`,
      //     chosen: Math.random() * 2 > 1
      //   }
      //   if (data.chosen) {
      //     targetKeys.push(data.key)
      //   }
      //   mockData.push(data)
      // }
      if (this.version === "1.0") {
        await this.getMenus(record);
      } else {
        await this.getMenus2(record);
      }
    },
    async getMenus(record) {
      // 1.0 使用
      const rolesArr = [];
      if (!record) {
        const res = await getAdminMenu({});
        if (res.code !== 0) {
          this.$message.error(res.msg);
          return;
        }
        const data = res.data;
        for (let item in data) {
          console.log(item);
          rolesArr.push({
            key: JSON.stringify({ value: item.value }), // { value: item.value, title: item.title },
            title: item.title,
            description: item.title,
            chosen: false,
          });
        }

        this.rolesArr = rolesArr;
      } else {
        const res = await getAdminNotMenu({ user: record.username });
        const { list, list2 } = res;
        const tarArr = [];
        // this.rolesArr = rolesArr
        for (let i = 0; i < list.length; i++) {
          const item = list[i];
          rolesArr.push({
            key: JSON.stringify({ value: item.value }), // { value: item.value, title: item.title },
            title: item.title,
            description: item.title,
            chosen: false,
          });
        }

        for (let i = 0; i < list2.length; i++) {
          const item = list2[i];
          tarArr.push(JSON.stringify({ value: item.value }));
        }
        this.rolesArr = rolesArr;
        this.targetsArr = tarArr;
      }
    },
    async getMenus2(record) {
      // 新版使用
      const rolesArr = [];
      const tarArr = { checked: [], halfChecked: [] };
      let param = {};
      if (record && record.username) {
        param = { user: record.username };
      }
      const res = await getAdminNotMenu2(param);
      // console.log(res)
      const { code, data, msg } = res;
      if (code === "0") {
        // console.log(data)
        data.map((item) => {
          const { name, children, menuid, isselect } = item; // 暂只有一层
          let childLen = 0;
          const per = {
            title: name,
            key: JSON.stringify({ value: menuid }),
            children: children.map((e) => {
              if (e.isselect) {
                childLen++;
                tarArr.checked.push(JSON.stringify({ value: e.menuid }));
              }
              return {
                title: e.name,
                key: JSON.stringify({ value: e.menuid }),
              };
            }),
          };
          if (isselect) {
            // 判断全选还是半选
            if (childLen === children.length) {
              tarArr.checked.push(JSON.stringify({ value: menuid }));
            } else {
              tarArr.halfChecked.push(JSON.stringify({ value: menuid }));
            }
          }
          rolesArr.push(per);
        });
      } else {
        this.$message.error(msg);
        this.handleCancel();
      }
      // console.log(rolesArr)
      this.rolesArr = rolesArr;
      this.targetsArr = tarArr;
      // this.roleMenus.rolesArr = rolesArr
    },
    transferChange(targetKeys) {
      this.targetsArr = targetKeys;
      this.roleMenus.targetsArr = targetKeys;
    },
    treesChange(checkedKeys) {
      this.targetsArr = checkedKeys;
      this.roleMenus.targetsArr = checkedKeys;
    },
    handleOk() {
      const form = this.$refs.createModal.form;
      this.confirmLoading = true;
      form.validateFields((errors, values) => {
        if (!errors) {
          console.log("values", values);
          values["user"] = values["username"];
          // 添加 admin username
          values["username"] = this.username;
          Object.keys(values).map((e) => {
            if (values[e] === undefined) {
              values[e] = "";
            }
            // 转换一下
            if (e === "root") {
              values[e] = JSON.parse(values[e]);
            }
          });
          // console.log(values)
          if (values.autoid > 0) {
            // 修改 e.g.
            editAdmin(values)
              .then((res) => {
                // console.log(res)
                const { code, msg } = res;
                if (code === "0") {
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
              .catch((res) => {
                this.$message.error(res.msg);
              });
          } else {
            // 新增
            addAdmin(values)
              .then((res) => {
                // console.log(res)
                const { code, msg } = res;
                if (code === "0") {
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
    handleCodeOk() {
      const form = this.$refs.chagneCode.form;
      this.confirmLoading = true;
      const model = this.changePwdModel;
      form.validateFields((errors, values) => {
        if (!errors) {
          // 修改 e.g.
          editAdminPwd({ ...values, username: this.username, autoid: model.autoid })
            .then((res) => {
              if (res.code === 0) {
                this.visibleChangeCode = false;
                this.confirmLoading = false;
                // 重置表单数据
                form.resetFields();
                // 刷新表格
                // this.$refs.table.refresh()
                this.getData();
                this.$message.success("修改成功");
              } else {
                this.$message.error(res);
                this.handleChangePwdModelCancel();
              }
            })
            .catch((res) => {
              this.$message.error(res.msg);
            });
        }
      });
    },
    handleCancel() {
      this.visible = false;
      this.confirmLoading = false;
      const form = this.$refs.createModal.form;
      form.resetFields(); // 清理表单数据（可不做）
      this.roleMenus = {
        rolesArr: [],
        targetsArr: [],
      };
    },
    handleChangePwdModelCancel() {
      this.visibleChangeCode = false;
      this.confirmLoading = false;
      const form = this.$refs.chagneCode.form;
      form.resetFields(); // 清理表单数据（可不做）
      this.roleMenus = {
        rolesArr: [],
        targetsArr: [],
      };
    },
    handleDel(record) {
      console.log("del", record);
      const ts = this;
      const delMod = Modal.confirm({
        centered: true,
        maskClosable: true,
        title: "提示信息",
        content: `确定删除【${record.username}】的记录？`,
        onOk: () => {
          delAdmin({
            username: this.username,
            autoid: record.username,
          }).then((res) => {
            console.log(res);
            ts.getData();
            delMod.destroy();
          });
        },
        onCancel() {},
      });
    },
    // handleSub (record) {
    //   if (record.status !== 0) {
    //     this.$message.success(`${record.no} 订阅成功`)
    //   } else {
    //     this.$message.error(`${record.no} 订阅失败，规则已关闭`)
    //   }
    // },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys;
      this.selectedRows = selectedRows;
    },
    // toggleAdvanced () {
    //   this.advanced = !this.advanced
    // },
    doSearch() {
      this.queryParam.page = 1;
      this.getData();
    },
    async getData() {
      this.loading = true;

      //   console.log('loadData request parameters:', requestParameters)
      //   return
      const res = await getAdminList(this.queryParam);
      const { code, data } = res;
      if (code == "0") {
        this.loadData = data.records;
        this.pagination.total = data.total;
        this.issuper1 = data.searchCount;
      } else {
        console.log(res);
      }
      setTimeout(() => {
        this.loading = false;
      }, 800);
    },
    resetSearchForm() {
      this.queryParam = {
        date: moment(new Date()),
      };
    },
  },
};
</script>
