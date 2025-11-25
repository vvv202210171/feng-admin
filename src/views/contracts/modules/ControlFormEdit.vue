<template>
  <a-modal
    :title="model && model.title ? model.title : '修改行情'"
    :width="800"
    :visible="visible"
    :confirm-loading="loading"
    @ok="() => { $emit('ok') }"
    @cancel="() => { $emit('cancel') }"
  >
    <a-spin :spinning="loading">
      <a-form
        :form="form"
        v-bind="formLayout"
      >
        <a-form-item
          v-if="model && model.autoid > 0"
          label="ID"
        >
          <a-input
            v-decorator="['autoid', { initialValue: undefined }]"
            disabled
          />
        </a-form-item>
        <a-form-item
          v-if="model && model.sourceId > 0"
          label="交易对ID"
        >
          <a-input
            v-decorator="['sourceId', { initialValue: undefined }]"
            disabled
          />
        </a-form-item>

        <a-form-item label="主币">
          <a-input
            v-decorator="['maincoin', { rules: [{ required: true, message: '请输入主币' }] }]"
            autocomplete="off"
            disabled
          />
        </a-form-item>
        <a-form-item label="交易币">
          <a-input
            v-decorator="['tradcoin', { rules: [{ required: true, message: '请输入交易币' }] }]"
            autocomplete="off"
            disabled
          />
        </a-form-item>
        <a-form-item label="时间">
          <a-date-picker
            v-decorator="['xdate', { rules: [{ required: true, message: '请输入开始时间' }] }]"
            style="width: 100%"
            show-time
          />
        </a-form-item>
        <a-form-item
          label="行情"
          style="margin-bottom:0;"
        >
          <a-input-number
            id="inputNumber"
            v-decorator="['yprice', { rules: [{ required: true, message: '请输入最小值' }] }]"
            :min="0"
            style="width: 100%;"
          />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'

// 表单字段
const fields = ['autoid','sourceId', 'maincoin', 'tradcoin', 'xdate',"yprice"]

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
    fields.forEach(v => this.form.getFieldDecorator(v))
    // 获取权限数据

    // 当 model 发生改变时，为表单设置值
    this.$watch('model', () => {
      this.model && this.form.setFieldsValue(pick(this.model, fields))
    })
  }
}
</script>
