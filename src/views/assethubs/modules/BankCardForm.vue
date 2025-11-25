<template>
  <a-modal
    :title="model && model.title ? model.title : '编辑'"
    :width="720"
    :visible="visible"
    :confirmLoading="loading"
    @ok="handleOK"
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
        <a-form-item label="会员编号">
          <!-- blockname -->
          <a-input
            autocomplete="off"
            disabled
            v-decorator="['member', { rules: [{ required: true, message: '请输入会员编号' }] }]"
          />
        </a-form-item>
        <a-form-item label="银行账户">
          <!-- blockname -->
          <a-input
            autocomplete="off"
            v-decorator="['bankAccount', { rules: [{ required: true, message: '请输入银行账户' }] }]"
          />
        </a-form-item>
        <a-form-item label="银行名称">
          <!-- blockname -->
          <a-input
            autocomplete="off"
            v-decorator="['bankName', { rules: [{ required: true, message: '请输入银行账户' }] }]"
          />
        </a-form-item>
        <a-form-item label="持卡人">
          <!-- blockname -->
          <a-input
            autocomplete="off"
            v-decorator="['holderName', { rules: [{ required: true, message: '请输入持卡人' }] }]"
          />
        </a-form-item>
        <a-form-item label="区域号">
          <!-- blockname -->
          <a-input
            autocomplete="off"
            v-decorator="['areaCode', { rules: [{ required: true, message: '请输入区域号' }] }]"
          />
        </a-form-item>
        <a-form-item label="手机号">
          <!-- blockname -->
          <a-input
            autocomplete="off"
            v-decorator="['phone', { rules: [{ required: true, message: '请输入手机号' }] }]"
          />
        </a-form-item>
        <a-form-item label="状态">
          <!-- coinfilter -->
          <a-select
            v-decorator="['state', { rules: [{ required: true, message: '状态不能为空' }] }]"
            @change="handleSymbolChange"
          >
            <a-select-option v-for="(option, inx) in states" :key="inx" :value="option.val">{{
              option.key
            }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="法定币种">
          <!-- coinfilter -->
          <a-select
            v-decorator="['fiatCode', { rules: [{ required: true, message: '法定币种不能为空' }] }]"
            @change="handleSymbolChange"
          >
            <a-select-option v-for="(option, inx) in fiatCodes" :key="inx" :value="option.code">{{
              option.name
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
const fields = ['autoid', 'member', 'bankAccount', 'bankName', 'holderName', 'areaCode', 'phone', 'state', 'fiatCode']
import { getFiatEnableCurrencyList } from '@/api/fiat'
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
    },
    config: {
      type: Object,
      default: () => {}
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
      coinOptions: [],
      fiatCodes: [],
      states: [
        { key: '启用', val: 'enable' },
        { key: '禁用', val: 'disable' }
      ],
      coinsData: []
    }
  },
  created() {
    // 防止表单未注册
    fields.forEach((v) => this.form.getFieldDecorator(v))
    getFiatEnableCurrencyList().then((res) => (this.fiatCodes = res.data))

    // 当 model 发生改变时，为表单设置值
    this.$watch('model', () => {
      this.model && this.form.setFieldsValue(pick(this.model, fields))
    })
  },
  methods: {
    handleOK() {
      this.$emit('ok')
    },
    handleProvinceChange(value) {
      // console.log(value)
      const opt = {}
      // this.states = []
      this.form.setFieldsValue({ symbol: '', blockname: '' })
      this.coinsData.forEach((e) => {
        // console.log(e)
        if (e.coin === value) {
          opt[e.symbol] = 1
        }
      })

      this.states = Object.keys(opt)
      // this.cities = cityData[value];
      // this.secondCity = cityData[value][0];
    },
    handleSymbolChange(symbol) {
      console.log(symbol)
      const pcion = this.form.getFieldValue('pcoin')
      this.coinsData.forEach((e) => {
        if (e.coin === pcion && e.symbol === symbol) {
          this.form.setFieldsValue({
            blockname: e.blockname
          })
        }
      })
    }
  }
}
</script>
