<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <!-- :model="queryParam" -->

      <a-form name="Search" layout="inline" autocomplete="off" style="margin-bottom: 14px" @submit="doSearch">
        <a-form-item label="搜索内容">
          <a-input style="width: 240px" v-model="queryParam.key" placeholder="请输入要搜索的内容">
          </a-input>
        </a-form-item>
        <a-form-item label="类型">
          <a-select style="width: 100px" v-model="queryParam.flagVirtual">
            <a-select-option value=""> 请选择 </a-select-option>
            <a-select-option value="0"> 正式会员 </a-select-option>
            <a-select-option value="1"> 虚拟会员 </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="实名状态">
          <a-select style="width: 100px" v-model="queryParam.idcardstate">
            <a-select-option value=""> 请选择 </a-select-option>
            <a-select-option value="no"> 未审核 </a-select-option>
            <a-select-option value="review"> 审核中 </a-select-option>
            <a-select-option value="completed"> 已完成 </a-select-option>
            <a-select-option value="reject"> 已驳回 </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="账户状态">
          <a-select style="width: 100px" v-model="queryParam.state">
            <a-select-option value=""> 请选择 </a-select-option>
            <a-select-option value="enable"> 启用 </a-select-option>
            <a-select-option value="disable"> 禁用 </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="时间">
          <a-date-picker v-model="queryParam.startdate" @change="startChange" />~<a-date-picker
            v-model="queryParam.enddate" @change="endChange" />
        </a-form-item>
        <a-form-item>
          <a-button htmlType="submit" :disabled="disabledSearch" type="primary" @click="doSearch">查询</a-button>
        </a-form-item>
        <a-button type="primary" icon="plus" @click="handleAdd" style="float: right">新增虚拟账户</a-button>
      </a-form>

      <a-table ref="table" size="default" row-key="autoid" :loading="loading" :scroll="{ x: 980 }" bordered
        :columns="filterColumn" :dataSource="loadData" :pagination="pagination" expandRowByClick>
        <template slot="state" slot-scope="text, record">
          <span v-if="record.state === 'enable'">启用</span>
          <span v-if="record.state === 'disable'" style="color: #eb1345">冻结</span>
        </template>

        <template slot="superuser" slot-scope="text, record">
          <span v-if="record.superuser === 'disable'">用户</span>
          <span v-if="record.superuser === 'enable'" style="color: #eb1345">代理</span>
        </template>

        <template slot="minerState" slot-scope="text, record">
          <span v-if="record.minerState === 'disable'">关</span>
          <span v-if="record.minerState === 'enable'" style="color: #00d20d">开</span>
        </template>

        <template slot="cycleState" slot-scope="text, record">
          <span v-if="record.cycleState === 'enable'">正常</span>
          <span v-else-if="record.cycleState === 'profit'" style="color: #00d20d">必赢</span>
          <span v-else-if="record.cycleState === 'loss'" style="color: #eb1345">必输</span>
        </template>
        <template slot="flagVirtual" slot-scope="text, record">
          <span v-if="record.flagVirtual === 0">正式会员</span>
          <span v-else-if="record.flagVirtual === 1" style="color: #00d20d">虚拟会员</span>
          <span v-else style="color: #eb1345">{{ record.flagVirtual }}</span>
        </template>
        <template slot="idcardstate" slot-scope="text, record">
          <span v-if="record.idcardstate === 'no'" style="color: #eb1345">未认证</span>
          <span v-else-if="record.idcardstate === 'review'" style="color: rgb(255 128 36)">待审核</span>
          <span v-else-if="record.idcardstate === 'completed'">已完成</span>
          <span v-else>已驳回</span>
        </template>
        <template slot="zm" slot-scope="text, record">
          <a :href="imgUrl(record.zm)" target="_blank" v-if="isImgShhow(record)">
            <img :src="imgUrl(record.zm)" width="100%" height="50%" />
          </a>
        </template>
        <template slot="fm" slot-scope="text, record">
          <a :href="imgUrl(record.fm)" target="_blank" v-if="isImgShhow(record)">
            <img :src="imgUrl(record.fm)" width="100%" height="50%" />
          </a>
        </template>

        <template slot="flagWithdraw" slot-scope="text, record">
          <a-switch checked-children="启用" un-checked-children="关闭" :checked="record.flagWithdraw == 1"
            @change="(value) => onChangeFlagWithdraw(value, record)" />
        </template>

        <template slot="flagOrder" slot-scope="text, record">
          <a-switch checked-children="启用" un-checked-children="关闭" :checked="record.flagOrder == 1"
            @change="(value) => onChangeFlagOrder(value, record)" />
        </template>
        <template slot="tel" slot-scope="text, record">
          <template v-if="record.tel && record.tel != '--'">
            <span style="color: #f97316">(+{{ record.areacode }}) </span> {{ record.tel }}
          </template>
          <template v-else>
            {{ record.tel }}
          </template>
        </template>

        <span slot="action" slot-scope="text, record">
          <div style="display: flex; flex-direction: column; align-items: center; gap: 4px">
            <a-button type="link" @click="updateAaasets(record)"> 资产详情 </a-button>
            <template v-if="record.autoid !== 1">
              <a-dropdown>
                <a class="ant-dropdown-link" @click.prevent>
                  更多 <a-icon type="down" />
                </a>
                <a-menu slot="overlay">
                  <a-menu-item v-if="record.autoid !== 1">
                    <a @click="handleEditParent(record)" :disabled="!$verify('101012')">领导人</a>
                  </a-menu-item>
                  <a-menu-item v-if="record.autoid !== 1">
                    <a @click="handleEdit(record)" :disabled="!$verify('101013')">编辑</a>
                  </a-menu-item>
                  <!-- <a-menu-item v-if="record.autoid !== 1">
                  <a @click="handleReset(record)" :disabled="!$verify('101013')">重置登录密码</a>
                </a-menu-item> -->
                  <a-menu-item v-if="record.autoid !== 1">
                    <a @click="handleEditLoginPwd(record)" :disabled="!$verify('101013')">修改登录密码</a>
                  </a-menu-item>
                  <a-menu-item v-if="record.autoid !== 1">
                    <a @click="handleEditTradPwd(record)" :disabled="!$verify('101013')">修改交易密码</a>
                  </a-menu-item>
                  <a-menu-item v-if="record.autoid !== 1">
                    <a @click="handleFreeze(record)" :disabled="record.state == 'disable'">冻结用户</a>
                  </a-menu-item>
                  <a-menu-item v-if="record.autoid !== 1">
                    <a @click="handleFreeze(record)" :disabled="record.state == 'enable'">启用用户</a>
                  </a-menu-item>
                  <a-menu-item v-if="record.autoid !== 1">
                    <a @click="handleResetRealName(record)" :disabled="record.idcardstate == 'no'">重置实名</a>
                  </a-menu-item>
                  <a-menu-item v-if="record.autoid !== 1">
                    <a @click="handleFreezeLine(record, 'disable')">冻结用户线</a>
                  </a-menu-item>
                  <a-menu-item v-if="record.autoid !== 1">
                    <a @click="handleFreezeLine(record, 'enable')">启用用户线</a>
                  </a-menu-item>
                  <a-menu-item v-if="record.autoid !== 1">
                    <a @click="updateAddress(record)">地址本</a>
                  </a-menu-item>
                  <a-menu-item>
                    <a @click="updateAaasets(record)">资产详情</a>
                  </a-menu-item>
                  <a-menu-item>
                    <a @click="showRechage(record)">手动充值</a>
                  </a-menu-item>
                  <a-menu-item>
                    <a @click="showWithdraw(record)">手动扣款</a>
                  </a-menu-item>
                </a-menu>
              </a-dropdown>
            </template>
          </div>
        </span>
        <p slot="expandedRowRender" slot-scope="record" style="margin: 0">
          <a-card title="用户详情">
            <a-card-grid style="width: 16.6666%; line-height: 10px" v-for="(key, index) in columns2" :key="index">
              <template v-if="key.dataIndex == 'state'">
                <span>{{ key.title }}</span>:
                <span v-if="record.state === 'enable'">启用</span>
                <span v-if="record.state === 'disable'" style="color: #eb1345">冻结</span>
              </template>
              <template v-else-if="key.dataIndex == 'superuser'">
                <span>{{ key.title }}</span>:
                <span v-if="record.superuser === 'disable'">用户</span>
                <span v-if="record.superuser === 'enable'" style="color: #eb1345">代理</span>
              </template>
              <template v-else-if="key.dataIndex == 'minerState'">
                <span>{{ key.title }}</span>:
                <span v-if="record.minerState === 'disable'">关</span>
                <span v-if="record.minerState === 'enable'" style="color: #00d20d">开</span>
              </template>
              <template v-else-if="key.dataIndex == 'cycleState'">
                <span>{{ key.title }}</span>:
                <span v-if="record.cycleState === 'enable'">正常</span>
                <span v-else-if="record.cycleState === 'profit'" style="color: #00d20d">必赢</span>
                <span v-else-if="record.cycleState === 'loss'" style="color: #eb1345">必输</span>
              </template>
              <template v-else-if="key.dataIndex == 'idcardstate'">
                <span>{{ key.title }}</span>:
                <span v-if="record.idcardstate === 'no'">未认证</span>
                <span v-else-if="record.idcardstate === 'review'" style="color: #eb1345">待审核</span>
                <span v-else-if="record.idcardstate === 'completed'">已完成</span>
                <span v-else>已驳回</span>
              </template>
              <template v-else-if="key.dataIndex == 'zm'">
                <div>
                  <span>正面：</span>
                  <a :href="imgUrl(record.zm)" target="_blank" v-if="isImgShhow(record)">
                    <img :src="imgUrl(record.zm)" width="85%" height="50%" />
                  </a>
                </div>
              </template>
              <template v-else-if="key.dataIndex == 'fm'">
                <div>
                  <span>反面：</span>
                  <a :href="imgUrl(record.fm)" target="_blank" v-if="isImgShhow(record)">
                    <img :src="imgUrl(record.fm)" width="85%" height="50%" />
                  </a>
                </div>
              </template>
              <template v-else-if="key.dataIndex == 'sc'">
                <div>
                  <span>手持：</span>
                  <a :href="imgUrl(record.sc)" target="_blank" v-if="isImgShhow(record)">
                    <img :src="imgUrl(record.sc)" width="85%" height="50%" />
                  </a>
                </div>
              </template>

              <template v-else>
                <span>{{ key.title }}</span>:<span>{{ record[key.dataIndex] }}</span>
              </template>
            </a-card-grid>
          </a-card>
        </p>
      </a-table>
      <create-form ref="createModal" :visible="visible" :loading="confirmLoading" :roles="roleMenus" :model="mdl"
        @cancel="handleCancel" @ok="handleOk" />
      <s-modal ref="memberParentModal" :config="{ title: '编辑领导人' }" :visible="parentVisible"
        :loading="parentConfirmLoading" :options="parentOptions" :model="parentMdl" @cancel="handleParentCancel"
        @ok="handleParentOk" />
      <s-modal ref="memberEditTradPwdModal" :config="{ title: '修改交易密码' }" :visible="editTradPwdMdlVisible"
        :loading="editTradPwdConfirmLoading" :options="editTradPwdOptions" :model="editTradPwdMdl"
        @cancel="handleTradEditPwdCancel" @ok="handleTradEditPwdOk" />
      <s-modal ref="memberEditLoginPwdModal" :config="{ title: '修改登录密码' }" :visible="editLoginPwdMdlVisible"
        :loading="editTradPwdConfirmLoading" :options="editLoginPwdOptions" :model="editLoginPwdMdl"
        @cancel="handleLoginEditPwdCancel" @ok="handleLoginEditPwdOk" />
      <s-modal ref="addVirtualModal" :config="{ title: '新增虚拟账户' }" :visible="addVirtualOptionsVisible"
        :options="addVirtualOptions" :model="addVirtualMdl" @cancel="handleVirtualCancel" @ok="handleVirtualOk" />
      <s-modal ref="rechargelModal" :config="{ title: '手动充值' }" :visible="rechargOptionsVisible"
        :options="recharglOptions" :model="rechargMdl" @cancel="handlRerechargCancel" @ok="handleRecharglOk" />
      <s-modal ref="withrawlModal" :config="{ title: '手动扣款' }" :visible="withdrawOptionsVisible"
        :options="withdrawlOptions" :model="withdrawMdl" @cancel="handlWithrawCancel" @ok="handleWithdrawOk" />
    </a-card>
    <member-to-address ref="memberAddressModal" :visible="addressVisible" :member="member" @ok="addressVisible = false"
      @cancel="addressVisible = false" />

  </page-header-wrapper>
</template>

<script>
import { STable, Ellipsis, SModal } from "@/components";
import {
  sendFlagWith,
  resetPwd,
  resetRealName,
  getMemberList,
  editMember,
  editMemberParent,
  resetState,
  resetStateLine,
  resetTradPwd,
  editLoginPwd,
  sendFlagOrder,
  addVirtual,
} from "@/api/members";
import { Modal } from "ant-design-vue";

// import StepByStepModal from './modules/StepByStepModal'
import CreateForm from "./modules/MemberListForm";
import MemberToAddress from "./modules/MemberToAddress";

const columns = [
  {
    dataIndex: "member",
    title: "账户",
    width: 80,
  },
  {
    dataIndex: "flagVirtual",
    title: "类型",
    width: 100,
    scopedSlots: { customRender: "flagVirtual" },
  },
  {
    dataIndex: "salesmanName",
    title: "所属业务员",
    width: 120,
  },
  {
    dataIndex: "idcardstate",
    title: "实名认证",
    width: 100,
    scopedSlots: { customRender: "idcardstate" },
  },
  {
    dataIndex: "parent",
    title: "代理",
    width: 80,
  },
  {
    dataIndex: "tel",
    title: "手机号码",
    width: 150,
    scopedSlots: { customRender: "tel" },
  },
  {
    dataIndex: "email",
    title: "电子邮箱",
    width: 150,
  },
  {
    dataIndex: "state",
    title: "账户状态",
    width: 100,
    scopedSlots: { customRender: "state" },
  },
  // {
  //   dataIndex: "minerState",
  //   title: "挖矿取消权限",
  //   width: 100,
  //   scopedSlots: { customRender: "minerState" },
  // },
  {
    dataIndex: "cycleState",
    title: "周期做单",
    width: 70,
    scopedSlots: { customRender: "cycleState" },
  },
  {
    dataIndex: "writedate",
    title: "注册时间",
    width: 130,
  },
  {
    dataIndex: "username",
    title: "真实姓名",
    width: 100,
  },
  {
    dataIndex: "idcard",
    title: "身份证号",
    width: 150,
  },

  {
    dataIndex: "zm",
    title: "正面",
    width: 100,
    scopedSlots: { customRender: "zm" },
  },
  {
    dataIndex: "fm",
    title: "反面",
    width: 100,
    scopedSlots: { customRender: "fm" },
  },
  {
    dataIndex: "flagWithdraw",
    title: "允许提款",
    width: 100,
    scopedSlots: { customRender: "flagWithdraw" },
  },
  {
    dataIndex: "flagOrder",
    title: "允许下单",
    width: 100,
    scopedSlots: { customRender: "flagOrder" },
  },

  {
    dataIndex: "remark",
    title: "备注",
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
    width: 80,
  },
  {
    dataIndex: "member",
    title: "账户",
    width: 120,
  },
  {
    dataIndex: "tel",
    title: "手机号码",
    width: 120,
  },
  {
    dataIndex: "areacode",
    title: "区号",
    width: 120,
  },
  {
    dataIndex: "email",
    title: "电子邮箱",
    width: 150,
  },
  {
    dataIndex: "salesmanName",
    title: "所属业务员",
    width: 150,
  },
  {
    dataIndex: "state",
    title: "账户状态",
    width: 100,
    scopedSlots: { customRender: "state" },
  },
  {
    dataIndex: "minerState",
    title: "挖矿取消权限",
    width: 100,
    scopedSlots: { customRender: "minerState" },
  },
  {
    dataIndex: "cycleState",
    title: "周期做单",
    width: 100,
    scopedSlots: { customRender: "cycleState" },
  },
  {
    dataIndex: "writedate",
    title: "注册时间",
    width: 200,
  },
  {
    dataIndex: "registerIp",
    title: "注册IP",
    width: 140,
  },
  {
    dataIndex: "userIp",
    title: "登录IP",
    width: 140,
  },
  {
    dataIndex: "nation",
    title: "国家",
    width: 120,
  },
  {
    dataIndex: "territorial",
    title: "属地",
    width: 100,
  },

  {
    dataIndex: "username",
    title: "真实姓名",
    width: 100,
  },
  {
    dataIndex: "idcard",
    title: "身份证号",
    width: 150,
  },

  {
    dataIndex: "superuser",
    title: "账户类型",
    width: 100,
    scopedSlots: { customRender: "superuser" },
  },
  {
    dataIndex: "recomcode",
    title: "邀请码",
    width: 100,
  },
  {
    dataIndex: "parent",
    title: "推荐人",
    width: 120,
  },
  {
    dataIndex: "directPeople",
    title: "直推人数",
    width: 100,
  },
  {
    dataIndex: "unDirectPeople",
    title: "有效直推人数",
    width: 100,
  },
  {
    dataIndex: "indirectPeople",
    title: "团队人数",
    width: 100,
  },
  {
    dataIndex: "unIndirectPeople",
    title: "有效团队人数",
    width: 100,
  },
  {
    dataIndex: "regLockCoinNum",
    title: "剩余注册赠送未返回数量",
    width: 100,
  },
  {
    dataIndex: "regLockDirectCoinNum",
    title: "剩余下级注册赠送未返回数量",
    width: 100,
  },
  {
    dataIndex: "regRealLockCoinNum",
    title: "剩余注册赠送未返回数量（实名）",
    width: 100,
  },
  {
    dataIndex: "regRealLockDirectCoinNum",
    title: "剩余下级注册赠送未返回数量(实名)",
    width: 100,
  },
  {
    dataIndex: "minlevel",
    title: "会员等级",
    width: 90,
  },
  {
    dataIndex: "reputation",
    title: "信誉分",
    width: 90,
  },
  {
    dataIndex: "disableinfo",
    title: "冻结原因",
    width: 140,
  },
  {
    dataIndex: "remark",
    title: "备注",
    width: 100,
  },
  {
    dataIndex: "idcardstate",
    title: "实名状态",
    width: 100,
    scopedSlots: { customRender: "idcardstate" },
  },
  {
    dataIndex: "idReason",
    title: "驳回原因（会员可见）",
    width: 100,
    scopedSlots: { customRender: "idReson" },
  },
  {
    dataIndex: "idReasonBo",
    title: "驳回原因（后台可见）",
    width: 100,
    scopedSlots: { customRender: "idReson" },
  },
  {
    dataIndex: "zm",
    title: "正面",
    width: 100,
    scopedSlots: { customRender: "zm" },
  },
  {
    dataIndex: "fm",
    title: "反面",
    width: 100,
    scopedSlots: { customRender: "fm" },
  },
  {
    dataIndex: "sc",
    title: "手持",
    width: 100,
    scopedSlots: { customRender: "sc" },
  },
];
const editTradPwdOptions = [
  { title: "编号", field: "autoid", type: "input", decorator: {}, disabled: true },
  { title: "账号", field: "member", type: "input", decorator: {}, disabled: true },
  {
    title: "新交易密码",
    field: "newTradPwd",
    type: "password",
    decorator: {
      rules: [
        { required: true, message: "请输入新密码" },
        { min: 6, message: "密码不能小于6位" },
      ],
    },
  },
  {
    title: "确认交易密码",
    field: "confirmTradPwd",
    type: "password",
    decorator: {
      rules: [
        { required: true, message: "请输入确认密码" },
        { min: 6, message: "密码不能小于6位" },
      ],
    },
  },
];
const addVirtualOptions = [
  {
    title: "默认币种",
    field: "coin",
    type: "select-currency",
    placeholder: "请选择默认币种",
    decorator: {
      initialValue: "USDT",
      rules: [{ required: true, message: "请选择交易币种" }],
    },
  },
  {
    title: "默认余额",
    field: "usable",
    type: "number",
    placeholder: "请选默认余额",
    decorator: {
      initialValue: 1000,
      rules: [{ required: true, message: "请选择交易币种" }],
    },
    disabled: true,
  },
  {
    title: "登录密码",
    field: "pwd",
    type: "password",
    decorator: {
      rules: [
        { required: true, message: "请输入登录密码" },
        { min: 6, message: "密码不能小于6位" },
      ],
    },
  },
];

const recharglOptions = [
  { title: "账号", field: "member", type: "input", decorator: {}, disabled: true },
  { title: "邮箱", field: "email", type: "input", decorator: {}, disabled: true },
  {
    title: "币种",
    field: "coin",
    type: "select-currency",
    placeholder: "请选择默认币种",
    decorator: {
      initialValue: "USDT",
      rules: [{ required: true, message: "请选择交易币种" }],
    },
  },
  {
    title: "充值金额",
    field: "number",
    type: "number",
    decorator: {
      rules: [{ required: true, message: "请输入充值金额" }],
    },
  },
  {
    title: "备注",
    field: "tag",
    type: "textarea",
    decorator: {
      rules: [{ required: false }],
    },
  },
];
const withdrawlOptions = [
  { title: "账号", field: "member", type: "input", decorator: {}, disabled: true },
  { title: "邮箱", field: "email", type: "input", decorator: {}, disabled: true },
  {
    title: "币种",
    field: "coin",
    type: "select-currency",
    placeholder: "请选择默认币种",
    decorator: {
      initialValue: "USDT",
      rules: [{ required: true, message: "请选择交易币种" }],
    },
  },
  {
    title: "扣款金额",
    field: "number",
    type: "number",
    decorator: {
      rules: [{ required: true, message: "请输入充值金额" }],
    },
  },
  {
    title: "备注",
    field: "tag",
    type: "textarea",
    decorator: {
      rules: [{ required: false }],
    },
  },
];
const editLoginPwdOptions = [
  { title: "编号", field: "autoid", type: "input", decorator: {}, disabled: true },
  { title: "账号", field: "member", type: "input", decorator: {}, disabled: true },
  {
    title: "新登录密码",
    field: "newLoginPwd",
    type: "password",
    decorator: {
      rules: [
        { required: true, message: "请输入新密码" },
        { min: 6, message: "密码不能小于6位" },
      ],
    },
  },
  {
    title: "确认登录密码",
    field: "confirmLoginPwd",
    type: "password",
    decorator: {
      rules: [
        { required: true, message: "请输入确认密码" },
        { min: 6, message: "密码不能小于6位" },
      ],
    },
  },
];
// parent modal
const parentOptions = [
  { title: "编号", field: "autoid", type: "input", decorator: {}, disabled: true },
  { title: "账号", field: "member", type: "input", decorator: {}, disabled: true },
  { title: "领导人", field: "agent", type: "input", decorator: {} },
];

export default {
  name: "MemberList",
  components: {
    STable,
    Ellipsis,
    CreateForm,
    MemberToAddress,
    SModal,
    MemberToAddress,
    // StepByStepModal
  },
  data() {
    // this.columns = columns
    return {
      loading: false,
      columns,
      columns2,
      // create model
      visible: false,
      confirmLoading: false,
      mdl: null,
      // parent model
      parentVisible: false,
      addressVisible: false,
      member: null,
      dataMem: null,
      parentConfirmLoading: false,
      editPwdConfirmLoading: false,
      editTradPwdConfirmLoading: false,
      editTradPwdOptions,
      editTradPwdMdl: null,
      editTradPwdMdlVisible: false,
      editLoginPwdOptions,
      editLoginPwdMdl: null,
      editLoginPwdMdlVisible: false,
      editLoginPwdConfirmLoading: false,
      parentMdl: null,
      parentOptions,
      addVirtualOptions,
      addVirtualOptionsVisible: false,
      addVirtualMdl: null,

      recharglOptions,
      rechargOptionsVisible: false,
      rechargMdl: null,

      withdrawlOptions,
      withdrawOptionsVisible: false,
      withdrawMdl: null,

      assetsVisible: false,
      roleMenus: [],
      // 高级搜索 展开/关闭
      advanced: false,
      // // 搜索状态
      // disabledSearch: false,
      // 查询参数
      queryParam: {
        key: "",
        parentVal: "",
        state: "",
        idcardstate: "",
        startdate: "",
        enddate: "",
        flagVirtual: "",
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
          this.getData();
          // console.log(page, pageSize)
        },
      },
      selectedRowKeys: [],
      selectedRows: [],
    };
  },

  created() {
    this.getData();
  },
  computed: {
    // 搜索状态
    disabledSearch() {
      return this.loading;
    },
    filterColumn() {
      return this.columns.filter((col) => {
        // 判断 dataIndex 是否为 'usdtIn' 或 'usdtOut' 并且 title 是否为 'ERA'
        if (
          (col.dataIndex === "usdtIn" || col.dataIndex === "usdtOut") &&
          this.title === "ERA"
        ) {
          return false; // 不显示此列
        }
        // 其他列正常显示
        return true;
      });
    },
  },
  methods: {
    handleAdd() {
      this.addVirtualMdl = null;
      this.addVirtualOptionsVisible = true;
    },
    isImgShhow(record) {
      return record.idcardstate !== "no" && record.flagVirtual === 0;
    },
    handleVirtualOk() {
      const form = this.$refs.addVirtualModal.form;
      this.editPwdConfirmLoading = true;
      const that = this;
      form.validateFields(async (errors, values) => {
        const { code, data, msg } = await addVirtual(values);
        if (code !== 0) {
          this.$message.error(msg);
          return;
        }
        this.handleVirtualCancel();
        this.$info({
          title: "成功新增虚拟账号",
          content: (h) => {
            const text = `UID: ${data.member}\nEmail: ${data.email}\n余额: ${data.usable}${data.coin}`;

            return h("div", [
              h("p", [`UID: ${data.member}`]),
              h("p", [`Email: ${data.email}`]),
              h("p", [`余额: ${data.usable}${data.coin}`]),
              h(
                "a-button",
                {
                  props: { type: "primary", size: "small" },
                  style: "margin-top: 10px;",
                  on: {
                    click: async () => {
                      try {
                        await navigator.clipboard.writeText(text);
                        this.$message.success("已复制到剪贴板");
                      } catch (e) {
                        this.$message.error("复制失败");
                      }
                    },
                  },
                },
                "复制"
              ),
            ]);
          },
          onOk() {
            that.getData();
          },
        });
      });
    },

    handleVirtualCancel() {
      this.addVirtualOptionsVisible = false;
      const form = this.$refs.addVirtualModal.form;
      form.resetFields(); // 清理表单数据（可不做）
    },
    handlRerechargCancel() {
      this.rechargOptionsVisible = false;
    },
    handleRecharglOk() {

    },
    showRechage(record) {
      this.rechargOptionsVisible = true;
      const form = this.$refs.rechargelModal.form;
      form.resetFields(); // 清理表单数据（可不做）
      this.rechargMdl = record;
    },
    handlRerechargCancel() {
      this.rechargOptionsVisible = false;
    },
    handleRecharglOk() {
      const form = this.$refs.rechargelModal.form;
      this.editPwdConfirmLoading = true;
      form.validateFields(async (errors, values) => {
        this.$message.success("充值成功");
      });
    },
    handleWithdrawOk() {
      const form = this.$refs.withrawlModal.form;
      this.editPwdConfirmLoading = true;
      form.validateFields(async (errors, values) => {
        values.cate = "benjin";
        values.type = "bank";
        values.account = "usable";
        this.$message.success("手动扣款成功");

      });
    },
    handlWithrawCancel() {
      this.withdrawOptionsVisible = false;
    },
    showWithdraw(record) {
      this.withdrawOptionsVisible = true;
      const form = this.$refs.withrawlModal.form;
      form.resetFields(); // 清理表单数据（可不做）
      this.withdrawMdl = record;
    },
    handleEditTradPwd(record) {
      this.editTradPwdMdlVisible = true;
      this.editTradPwdMdl = {
        ...record,
        title: "修改交易密码",
      };
    },
    handleEditLoginPwd(record) {
      this.editLoginPwdMdlVisible = true;
      this.editLoginPwdMdl = {
        ...record,
        title: "修改登录密码",
      };
    },
    async onChangeFlagWithdraw(flagWithdraw, record) {
      this.$set(record, "flagWithdraw", flagWithdraw ? 1 : 0);
      const ret = await sendFlagWith({
        autoid: record.autoid,
        flagWithdraw: record.flagWithdraw,
      });
      if (ret.code !== 0) {
        this.$message.error(ret.msg);
        this.doSearch();
      }
    },
    async onChangeFlagOrder(flagWithdraw, record) {
      this.$set(record, "flagOrder", flagWithdraw ? 1 : 0);
      const ret = await sendFlagOrder({
        autoid: record.autoid,
        flagOrder: record.flagOrder,
      });
      if (ret.code !== 0) {
        this.$message.error(ret.msg);
        this.doSearch();
      }
    },
    handleTradEditPwdCancel() {
      this.editTradPwdMdlVisible = false;
      this.editTradPwdConfirmLoading = false;
      const form = this.$refs.memberEditTradPwdModal.form;
      form.resetFields(); // 清理表单数据（可不做）
    },
    handleLoginEditPwdCancel() {
      this.editLoginPwdMdlVisible = false;
      this.editLoginPwdConfirmLoading = false;
      const form = this.$refs.memberEditLoginPwdModal.form;
      form.resetFields(); // 清理表单数据（可不做）
    },
    handleTradEditPwdOk() {
      const form = this.$refs.memberEditTradPwdModal.form;
      this.editPwdConfirmLoading = true;
      form.validateFields((errors, values) => {
        if (errors) {
          this.editPwdConfirmLoading = false;
          return;
        }
        // 添加username
        if (values.newTradPwd !== values.confirmTradPwd) {
          this.$message.error("密码不一致");
          this.editPwdConfirmLoading = false;
          return;
        }
        resetTradPwd({ id: values.autoid, tradpwd: values.newTradPwd })
          .then((res) => {
            const { code, msg } = res;
            if (code === 0) {
              this.editTradPwdMdlVisible = false;
              this.editTradPwdConfirmLoading = false;
              // 重置表单数据
              form.resetFields();
              // 刷新表格
              // this.$refs.table.refresh()
              this.getData();

              this.$message.success("修改成功");
            } else {
              // console.log(res)
              this.$message.error(msg);
              this.handleEditPwdCancel();
            }
          })
          .catch((e) => {
            this.handleEditPwdCancel();
          });
      });
    },
    handleLoginEditPwdOk() {
      const form = this.$refs.memberEditLoginPwdModal.form;
      this.editLoginPwdConfirmLoading = true;
      form.validateFields((errors, values) => {
        if (errors) {
          this.editPwdConfirmLoading = false;
          return;
        }
        // 添加username
        if (values.newLoginPwd !== values.confirmLoginPwd) {
          this.$message.error("密码不一致");
          this.editPwdConfirmLoading = false;
          return;
        }
        editLoginPwd({ id: values.autoid, loginPwd: values.newLoginPwd })
          .then((res) => {
            const { code, msg } = res;
            if (code === 0) {
              this.editLoginPwdMdlVisible = false;
              this.editLoginPwdConfirmLoading = false;
              // 重置表单数据
              form.resetFields();
              // 刷新表格
              // this.$refs.table.refresh()
              this.getData();

              this.$message.success("修改成功");
            } else {
              // console.log(res)
              this.$message.error(msg);
            }
          })
          .catch((e) => {
            this.handleEditPwdCancel();
          });
      });
    },
    startChange(date, dateString) {
      this.queryParam.startdate = dateString;
    },
    endChange(date, dateString) {
      this.queryParam.enddate = dateString;
    },
    handleEditParent(record) {
      console.log(record);
      this.roleMenus = [];
      this.parentVisible = true;
      this.parentMdl = {
        ...record,
        title: "编辑领导人",
        agent: record.parent,
      };
    },
    handleEdit(record) {
      // get menu data
      this.roleMenus = [];
      this.visible = true;
      this.mdl = {
        ...record,
        title: "编辑",
      };
    },
    handleReset(record) {
      console.log("del", record);
      const ts = this;
      const delMod = Modal.confirm({
        centered: true,
        maskClosable: true,
        title: "提示信息",
        content: `确定要重置【${record.member}】吗？重置后123456`,
        onOk: () => {
          resetPwd({
            id: record.autoid,
          }).then((res) => {
            console.log(res);
            ts.getData();
            delMod.destroy();
          });
        },
        onCancel() { },
      });
    },
    handleResetRealName(record) {
      const ts = this;
      const delMod = Modal.confirm({
        centered: true,
        maskClosable: true,
        title: "提示信息",
        content: `确定要重置【${record.member}】实名为未认证状态吗？`,
        onOk: () => {
          resetRealName({
            autoid: record.autoid,
          }).then((res) => {
            console.log(res);
            ts.getData();
            delMod.destroy();
          });
        },
        onCancel() { },
      });
    },
    handleFreezeLine(record, state) {
      const ts = this;
      const msg = `确定要${state === "enable" ? "启用" : "冻结"}：${record.member
        } 整条线吗？`;
      const delMod = Modal.confirm({
        centered: true,
        maskClosable: true,
        title: "提示信息",
        content: msg,
        onOk: () => {
          resetStateLine({
            autoid: record.autoid,
            state: state,
          }).then((res) => {
            console.log(res);
            ts.getData();
            delMod.destroy();
          });
        },
        onCancel() { },
      });
    },
    updateAddress(record) {
      this.addressVisible = true;
      this.member = record.member;
    },
    updateAaasets(record) {
      this.assetsVisible = true;
      this.dataMem = record;
    },

    handleFreeze(record) {
      const ts = this;
      const msg = `确定要${record.state === "enable" ? "冻结" : "启用"}： ${record.member
        }吗？`;
      const delMod = Modal.confirm({
        centered: true,
        maskClosable: true,
        title: "提示信息",
        content: msg,
        onOk: () => {
          resetState({
            autoid: record.autoid,
            state: record.state === "enable" ? "disable" : "enable",
          }).then((res) => {
            console.log(res);
            ts.getData();
            delMod.destroy();
          });
        },
        onCancel() { },
      });
    },
    handleOk() {
      const form = this.$refs.createModal.form;
      this.confirmLoading = true;
      form.validateFields((errors, values) => {
        if (!errors) {
          // 添加username
          values = {
            ...values,
          };
          Object.keys(values).map((e) => {
            if (values[e] === undefined) {
              delete values[e];
            }
          });
          console.log(values);
          if (values.autoid > 0) {
            // 修改 e.g.
            editMember(values)
              .then((res) => {
                console.log(res);
                const { code, data, msg } = res;
                this.confirmLoading = false;
                if (code === 0) {
                  // this.loadData = data
                  // this.pagination.total = count
                  this.visible = false;
                  // 重置表单数据
                  form.resetFields();
                  // 刷新表格
                  // this.$refs.table.refresh()
                  this.getData();

                  this.$message.success("修改成功");
                } else {
                  // console.log(res)
                  this.$message.error(msg);
                  //  this.handleCancel()
                }
                // this.visible = false
                // this.confirmLoading = false
                // // 重置表单数据
                // form.resetFields()
                // // 刷新表格
                // // this.$refs.table.refresh()
                // this.getData()

                // this.$message.success('修改成功')
              })
              .catch((e) => {
                this.handleCancel();
              });
          } else {
            // 新增
            // addMember(values)
            //   .then(res => {
            //     console.log(res)
            //     this.visible = false
            //     this.confirmLoading = false
            //     // 重置表单数据
            //     form.resetFields()
            //     // 刷新表格
            //     // this.$refs.table.refresh()
            //     this.getData()
            //     this.$message.success('新增成功')
            //   })
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
    handleParentOk() {
      const form = this.$refs.memberParentModal.form;
      const username = this.$store.getters.username;
      this.parentConfirmLoading = true;
      form.validateFields((errors, values) => {
        if (!errors) {
          // 添加username
          values = {
            ...values,
            username,
          };
          Object.keys(values).map((e) => {
            if (values[e] === undefined) {
              delete values[e];
            }
          });
          console.log(values);
          if (values.autoid > 0) {
            // 修改 e.g.
            editMemberParent(values)
              .then((res) => {
                const { code, data, msg } = res;
                if (code === 0) {
                  // this.loadData = data
                  // this.pagination.total = count
                  console.log(data);
                  this.parentVisible = false;
                  this.parentConfirmLoading = false;
                  // 重置表单数据
                  form.resetFields();
                  // 刷新表格
                  // this.$refs.table.refresh()
                  this.getData();

                  this.$message.success("修改成功");
                } else {
                  // console.log(res)
                  this.$message.error(msg);
                  this.handleParentCancel();
                }
              })
              .catch((e) => {
                this.handleParentCancel();
              });
          } else {
          }
        } else {
          this.parentConfirmLoading = false;
        }
      });
    },
    handleParentCancel() {
      this.parentVisible = false;
      this.confirmLoading = false;
      const form = this.$refs.memberParentModal.form;
      form.resetFields(); // 清理表单数据（可不做）
      this.roleMenus = [];
    },
    doSearch() {
      this.pagination.onChange(1, this.pagination.pageSize);
      this.getData();
    },
    async getData() {
      this.loading = true;
      const { current, pageSize } = this.pagination;
      this.queryParam.page = current;
      this.queryParam.limit = pageSize;
      const res = await getMemberList(this.queryParam);
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
