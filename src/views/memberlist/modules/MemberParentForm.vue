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
        <a-form-item v-for="(item, inx) in fieldsModal" :key="inx + '-modal'" :label="item.title">
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
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'

// 表单字段
const fields = ['autoid', 'member', 'agent']
const fieldsModal = [
  { title: '编号', field: 'autoid', type: 'input', decorator: {}, disabled: true },
  { title: '账号', field: 'member', type: 'input', decorator: {}, disabled: true },
  { title: '领导人', field: 'agent', type: 'input', decorator: {} }
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
      this.model && this.form.setFieldsValue(pick(this.model, fields))
    })
  }
}
</script>
