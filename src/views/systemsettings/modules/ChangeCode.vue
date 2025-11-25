<template>
  <a-modal
    :title="changePwdModel && changePwdModel.title ? changePwdModel.title : '修改密码'"
    :width="920"
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
        <a-form-item v-bind="formLayout" label="新密码" has-feedback>
          <a-input-password
            v-decorator="[
              'pwd',
              { rules: [{ required: true, message: '请输入你的新密码' }, { validator: validateToNextPassword }] }
            ]"
            type="password"
          />
        </a-form-item>
        <a-form-item v-bind="formLayout" label="确认密码" has-feedback>
          <a-input
            v-decorator="[
              'confirm',
              { rules: [{ required: true, message: '请确认你的新密码' }, { validator: compareToFirstPassword }] }
            ]"
            type="password"
            @blur="handleConfirmBlur"
          />
        </a-form-item>
        <a-form-item label="谷歌验证码" v-if="enableGoogleCode">
          <a-input
            autocomplete="off"
            type="password"
            v-decorator="['gcode', { rules: [{ required: true, message: '请输入谷歌验证码' }] }]"
          />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'
// import {
//   // getAdminMenu
//   // getAdminNotMenu
// } from '@/api/systemsetting'
import config from '@/config/defaultSettings'
// 表单字段
const fields = ['pwd', 'confirm', 'gcode']

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
    changePwdModel: {
      type: Object,
      default: () => null
    },
    roles: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    this.formLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      }
    }
    return {
      version: config.version, // 接口版本
      formData: {},
      form: this.$form.createForm(this),
      confirmDirty: false
    }
  },
  created() {
    // console.log('custom modal created')
    // 防止表单未注册
    fields.forEach((v) => this.form.getFieldDecorator(v))
    // 获取权限数据
    // this.getMock()

    // 当 model 发生改变时，为表单设置值
    this.$watch('changePwdModel', () => {
      this.changePwdModel && this.form.setFieldsValue(pick(this.changePwdModel, fields))
      this.formData = this.model
      console.log(this.visible, this.changePwdModel, this.roles)
      if (this.roles && this.roles.targetsArr) {
        const arr = []
        if (this.version === '1.0') {
          this.roles.targetsArr.forEach((e) => {
            arr.push(JSON.parse(e))
          })
        } else {
          // 树形数据，区分全选和半选
          try {
            this.roles.targetsArr.checked.forEach((e) => {
              arr.push(JSON.parse(e))
            })
            this.roles.targetsArr.halfChecked.forEach((e) => {
              arr.push(JSON.parse(e))
            })
          } catch (e) {
            console.log(e)
          }
        }
      }
    })
  },
  methods: {
    handleConfirmBlur(e) {
      const value = e.target.value
      this.confirmDirty = this.confirmDirty || !!value
    },
    compareToFirstPassword(rule, value, callback) {
      const form = this.form
      if (value && value !== form.getFieldValue('pwd')) {
        callback(new Error('两次输入的密码不一致'))
      } else {
        callback()
      }
    },
    validateToNextPassword(rule, value, callback) {
      const form = this.form
      if (value && this.confirmDirty) {
        form.validateFields(['confirm'], { force: true })
      }
      callback()
    }
  }
}
</script>
