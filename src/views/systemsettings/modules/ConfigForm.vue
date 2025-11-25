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
        <a-form-item v-if="model && model.autoid > 0" label="ID">
          <a-input v-decorator="['autoid', { initialValue: undefined }]" disabled />
        </a-form-item>
        <a-form-item label="标识">
          <a-input autocomplete="off" v-decorator="['code', { rules: [{ required: true, message: '请输入标识' }] }]" />
        </a-form-item>
        <a-form-item label="内容">
          <a-input autocomplete="off" v-decorator="['value', { rules: [{ required: true, message: '请输入内容' }] }]" />
        </a-form-item>
        <a-form-item label="备注">
          <a-input autocomplete="off" v-decorator="['title']" />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'

// 表单字段
const fields = ['autoid', 'code', 'value', 'title']

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
      form: this.$form.createForm(this)
    }
  },
  created() {
    console.log('custom modal created')

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
