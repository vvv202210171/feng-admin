<template>
  <a-modal
    :title="model && model.title ? model.title : '新增'"
    :width="720"
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
        <!-- 检查是否有 id 并且大于0，大于0是修改。其他是新增，新增不显示主键ID -->
        <a-form-item v-show="model && model.autoid > 0" label="ID">
          <a-input v-decorator="['autoid', { initialValue: 0 }]" disabled />
        </a-form-item>
        <a-form-item label="用户名">
          <a-input
            autocomplete="off"
            v-decorator="['username', { rules: [{ required: true, min: 2, message: '请输入至少两个字' }] }]"
          />
        </a-form-item>
        <a-form-item label="登录密码">
          <a-input
            autocomplete="off"
            type="password"
            v-decorator="['password', { rules: [{ required: true, message: '请输入登录密码' }] }]"
          />
        </a-form-item>
        <a-form-item label="手机号码">
          <a-input
            autocomplete="off"
            v-decorator="['tel', { rules: [{ required: true, message: '请输入手机号码' }] }]"
          />
        </a-form-item>
        <a-form-item label="邮箱">
          <a-input autocomplete="off" v-decorator="['email', { rules: [{ required: true, message: '请输入邮箱' }] }]" />
        </a-form-item>
        <a-form-item label="账号备注">
          <a-input autocomplete="off" v-decorator="['remarks']" />
        </a-form-item>
        <a-form-item label="授权菜单">
          <!-- root -->
          <!-- <a-input autocomplete="off" v-decorator="['tel', {rules: [{required: true, message: '请输入至少两个字'}]}]" /> -->
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'

// 表单字段
const fields = ['autoid', 'username', 'tel', 'password', 'email', 'remarks', 'menu']

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
      type: Array
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
      form: this.$form.createForm(this)
    }
  },
  created() {
    // console.log('custom modal created')

    // 防止表单未注册
    fields.forEach((v) => this.form.getFieldDecorator(v))
    // 获取权限数据

    // 当 model 发生改变时，为表单设置值
    this.$watch('model', () => {
      this.model && this.form.setFieldsValue(pick(this.model, fields))
    })
  }
}
</script>
