<template>
  <a-modal
    :title="model && model.title ? model.title : '新增'"
    :width="960"
    :visible="visible"
    :confirmLoading="loading"
    @ok="
      () => {
        $emit('ok')
      }
    "
    @cancel="
      () => {
        $emit('cancel')
      }
    "
  >
    <a-spin :spinning="loading">
      <a-form :form="form" v-bind="formLayout">
        <a-row>
          <a-col v-for="(item, inx) in fieldsModal" :key="inx + '-modal'" :span="12">
            <a-form-item :label="item.title">
              <a-input
                v-if="item.type === 'input'"
                autocomplete="off"
                v-decorator="[item.field, item.decorator]"
                :disabled="item.disabled"
              ></a-input>
              <a-input-number
                v-if="item.type === 'number'"
                :min="item.min"
                :max="item.max"
                v-decorator="[item.field, item.decorator]"
              ></a-input-number>
              <a-select v-if="item.type === 'select'" v-decorator="[item.field, item.decorator]">
                <a-select-option v-for="option in item.options" :key="option.val" :value="option.val">{{
                  option.title
                }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'

// 表单字段
const fields = [
  'autoid',
  'reputation',
  'member',

  'tel',
  'email',
  'state',
  'username',
  'idcard',
  'minerState',
  'cycleState',
  'superuserGas',
  'disableinfo',
  'salesmanName',
  'remark'
]
const fieldsModal = [
  { title: '编号', field: 'autoid', type: 'input', decorator: {}, disabled: true },
  { title: '账号', field: 'member', type: 'input', decorator: {}, disabled: true },
  { title: '真实姓名', field: 'username', type: 'input', decorator: {} },
  { title: '身份证', field: 'idcard', type: 'input', decorator: {} },
  { title: '电话', field: 'tel', type: 'input', decorator: {} },
  { title: '邮箱', field: 'email', type: 'input', decorator: {} },
  {
    title: '信誉分',
    field: 'reputation',
    type: 'number',
    min: 0,
    max: 100,
    decorator: { rules: [{ required: true, message: '请输入信誉分' }] }
  },

  {
    title: '账户状态',
    field: 'state',
    type: 'select',
    options: [
      { val: 'disable', title: '冻结' },
      { val: 'enable', title: '启用' }
    ],
    decorator: { rules: [{ required: true, message: '请选择账户状态' }] }
  },
  // {
  //   title: '账号类型',
  //   field: 'superuser',
  //   type: 'select',
  //   options: [
  //     { val: 'disable', title: '用户' },
  //     { val: 'enable', title: '代理' },
  //     { val: 'test', title: '模拟' }
  //   ],
  //   decorator: { rules: [{ required: true, message: '请选择账户类型' }] }
  // },
  {
    title: '挖矿取消权限',
    field: 'minerState',
    type: 'select',
    options: [
      { val: 'disable', title: '关' },
      { val: 'enable', title: '开' }
    ],
    decorator: { rules: [{ required: true, message: '请选择权限' }] }
  },
  {
    title: '周期做单',
    field: 'cycleState',
    type: 'select',
    options: [
      { val: 'profit', title: '必赢' },
      { val: 'enable', title: '正常' },
      { val: 'loss', title: '必输' }
    ],
    decorator: { rules: [{ required: true, message: '请选择周期' }] }
  },
  // {
  //   title: '代理佣金比例*100%',
  //   field: 'superuserGas',
  //   type: 'input',
  //   decorator: { rules: [{ required: true, message: '请输入代理佣金' }] }
  // },
  {
    title: '冻结原因',
    field: 'disableinfo',
    type: 'input',
    decorator: { rules: [{ required: true, message: '请输入冻结原因' }] }
  },
  {
    title: '所属业务员',
    field: 'salesmanName',
    type: 'input',
    decorator: { rules: [{ required: false, message: '请输入所属业务员' }] }
  },
  {
    title: '备注',
    field: 'remark',
    type: 'input',
    decorator: { rules: [{ required: false, message: '请输入remark' }] }
  }
]

export default {
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    loading: {
      type: Boolean,
      default: () => false
    },
    model: {
      type: Object,
      default: () => null
    },
    roles: {
      type: Array,
      default: () => []
    }
  },
  data() {
    this.formLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 }
      }
    }
    return {
      form: this.$form.createForm(this),
      fieldsModal
    }
  },
  created() {
    // 防止表单未注册
    fields.forEach((v) => this.form.getFieldDecorator(v))
    // 获取权限数据

    // 当 model 发生改变时，为表单设置值
    this.$watch('model', () => {
      console.log(this.model)
      this.model && this.form.setFieldsValue(pick(this.model, fields))
    })
  }
}
</script>
