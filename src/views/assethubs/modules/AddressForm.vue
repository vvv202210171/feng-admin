<template>
  <a-modal
    :title="model && model.title ? model.title : '新增'"
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
        <a-form-item label="币种">
          <!-- <a-input autocomplete="off" v-decorator="['code', {rules: [{required: true, message: '请输入币种'}]}]" /> -->
          <a-select
            v-decorator="['pcoin', { rules: [{ required: true, message: '请选择币种' }] }]"
            @change="handleProvinceChange"
          >
            <a-select-option v-for="(option, inx) in coinOptions" :key="inx" :value="option">{{
              option
            }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="协议">
          <!-- coinfilter -->
          <a-select
            v-decorator="['symbol', { rules: [{ required: true, message: '请选择协议' }] }]"
            @change="handleSymbolChange"
          >
            <a-select-option v-for="(option, inx) in symbolOptions" :key="inx" :value="option">{{
              option
            }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="当前所属链">
          <!-- blockname -->
          <a-input
            autocomplete="off"
            disabled
            v-decorator="['blockname', { rules: [{ required: true, message: '请输入内容' }] }]"
          />
        </a-form-item>
        <a-form-item label="充值地址">
          <a-input
            autocomplete="off"
            v-decorator="['address', { rules: [{ required: true, message: '请输入地址' }] }]"
          />
        </a-form-item>
        <a-form-item label="谷歌验证码" v-if="enableGoogleCode">
          <a-input
            autocomplete="off"
            v-decorator="['googleCode', { rules: [{ required: true, message: '请输入谷歌验证码' }] }]"
          />
        </a-form-item>
        <a-form-item label="描述">
          <a-textarea :rows="6" v-decorator="['tag']"></a-textarea>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'
import {
  // getRoleList,
  getMainCoins
} from '@/api/assethub'

// 表单字段
const fields = ['autoid', 'pcoin', 'symbol', 'blockname', 'address', 'googleCode', 'tag']

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
      symbolOptions: [],
      coinsData: []
    }
  },
  created() {
    console.log('custom modal created')

    // 防止表单未注册
    fields.forEach((v) => this.form.getFieldDecorator(v))
    // 获取数据
    getMainCoins().then((res) => {
      // console.log(res)
      const { code, data, msg } = res
      if (code === 0) {
        const coins = data
        const opt = {}
        this.coinsData = coins
        coins.forEach((e) => {
          // this.coinOptions.push({ coin })
          if (!opt[e.coin]) {
            opt[e.coin] = 1
          } else {
            opt[e.coin]++
          }
        })
        this.coinOptions = Object.keys(opt)
      } else {
        this.$message.error(msg)
      }
    })

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
      // this.symbolOptions = []
      this.form.setFieldsValue({ symbol: '', blockname: '' })
      this.coinsData.forEach((e) => {
        // console.log(e)
        if (e.coin === value) {
          opt[e.symbol] = 1
        }
      })

      this.symbolOptions = Object.keys(opt)
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
