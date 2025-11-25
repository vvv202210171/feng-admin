<template>
  <a-modal
    :title="(config && config.title) || ''"
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
        <a-form-item
          v-for="(item, inx) in options"
          :key="inx + '-modal'"
          :label="item.title"
          :style="{ display: item.hidden ? 'none' : '' }"
        >
          <!-- input -->
          <a-input
            v-if="item.type === 'input'"
            autocomplete="off"
            v-decorator="[item.field, item.decorator]"
            :disabled="item.disabled"
            :placeholder="item.placeholder || ''"
          ></a-input>
          <!-- number -->
          <a-input-number
            v-if="item.type === 'number'"
            autocomplete="off"
            :min="item.min"
            :max="item.max"
            type="number"
            style="width: 180px"
            :placeholder="item.placeholder || ''"
            v-decorator="[item.field, item.decorator]"
          ></a-input-number>

          <!-- select -->
          <a-select
            v-if="item.type === 'select'"
            :show-search="item.search"
            @search="handleSearch"
            :placeholder="item.placeholder || ''"
            :disabled="item.disabled"
            v-decorator="[item.field, item.decorator]"
          >
            <a-select-option v-for="option in item.options" :key="option.val" :value="option.val">{{
              option.title
            }}</a-select-option>
          </a-select>
          <!-- currency select -->
          <a-select
            v-if="item.type === 'select-currency'"
            show-search
            @search="handleSearch"
            :disabled="item.disabled"
            :placeholder="item.placeholder || ''"
            v-decorator="[item.field, item.decorator]"
          >
            <a-select-option
              v-for="option in currencyOptions"
              :key="option.autoid + '-currency'"
              :value="option.coin"
              >{{ option.coin }}</a-select-option
            >
          </a-select>
        </a-form-item>
      </a-form>
      <div style="margin-left: 150px">
        <p style="color: red">说明:</p>
        <p>1.买多(盈利) 如果设置的最终平仓价格&gt;买入价格 盈利金额=仓位保证金+仓位保证金*收益率</p>
        <p>2.买多(亏损) 果设置的最终平仓价格&lt;买入价格 亏损金额=仓位保证金-仓位保证金*亏损率</p>
        <p>3.买少(盈利) 如果设置的最终平仓价格&lt;买入价格 盈利金额=仓位保证金+仓位保证金*收益率</p>
        <p>4.买少(亏损) 果设置的最终平仓价格&gt;买入价格 亏损金额=仓位保证金-仓位保证金*亏损率</p>
      </div>
    </a-spin>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'
import moment from 'moment'
import 'moment/locale/zh-cn'

export default {
  components: {},
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
    config: {
      type: Object,
      default: () => {}
    },
    options: {
      type: Array,
      required: true
    }
  },
  computed: {},
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
    const currencyOptions = this.$store.getters.currencylist
    return {
      moment,
      form: this.$form.createForm(this),
      startValue: null,
      endValue: null,
      timerRules: [], // 时间比较等规则
      endOpen: false,
      // hasImg: false, // 图片字段
      // previewVisible: false,
      // previewImage: '',
      imageConfig: {},
      uploading: false,
      fileList: {},
      fileList2: [], // 最终结果存入fileList2
      currencyOptions
    }
  },
  created() {
    const fields = this.options.map((e) => {
      // // 有图片上传，则存入字段名
      // if (e.type === 'image') {
      //   this.hasImg = e.field
      // }
      if (e.type === 'image') {
        this.fileList[e.field] = []
      }
      return e.field
    })
    // console.log(this.fileList)
    // 防止表单未注册
    fields.forEach((v) => this.form.getFieldDecorator(v))
    // 获取权限数据

    // 当 model 发生改变时，为表单设置值
    this.$watch('model', () => {
      this.model && this.form.setFieldsValue(pick(this.model, fields))
    })
  },
  watch: {
    fileList(val) {
      console.log(val)
    }
  },
  methods: {
    beforeUpload(file) {
      // this.fileList2 = [...this.fileList2, file]
      // console.log(this.fileList2)
      // console.log(this.fileList, file)
      // return false
      // this.uploading = true
    },
    // select
    handleSearch(value) {
      // console.log(value)
      // fetch(value, data => (this.data = data));
    },
    // timer
    disabledDate(cur) {
      // 获取当前时间
      const now = moment().format('YYYY-MM-DD') + ' 00:00:00'
      const dateT = moment(now).valueOf()
      // 置灰日期小于当前时间
      return cur < dateT
    },
    handleChange(data, dataString) {
      console.log(data, dataString)
      // const ss = this.$form.createForm(this).getFieldValue('name')
      // console.log(ss)
      // console.log(this.form.getFieldsValue())
    },
    disabledStartDate(startValue) {
      const endValue = this.endValue
      if (!startValue || !endValue) {
        return false
      }
      return startValue.valueOf() > endValue.valueOf()
    },
    disabledEndDate(endValue) {
      const startValue = this.startValue
      if (!endValue || !startValue) {
        return false
      }
      return startValue.valueOf() >= endValue.valueOf()
    },
    handleStartOpenChange(open) {
      console.log(open)
      // if (!open) {
      //   this.endOpen = true
      // }
    },
    handleEndOpenChange(open) {
      this.endOpen = open
    },
    onClick(item) {
      // console.log(item)
      this.imageConfig = item
      return false
    },
    handleUploadChange(info) {
      // console.log(info)
      // console.log(this.imageConfig.field)
      // console.log(this.$refs.uploadImg[0].$attrs.id)
      // if (this.uploading) {
      //   return false
      // }
      const { field } = this.imageConfig
      let fileList = [...info.fileList]
      // let fileList = this.fileList[this.field]
      // fileList = [ ...info.fileList ]
      this.fileList[field] = fileList
      // console.log(fileList)
      const formInput = {}
      // 这一行用来决定上传文件的限制个数，-1就表示1个，-2就是2个依次类推...
      fileList = fileList.slice(-1)
      const { status, response, name } = info.file
      // 这里判断文件是否上传成功
      if (status === 'done') {
        if (response.code === '0') {
          // 判断是否正确链接上传地址
          // this.fileList2 = []
          // // 上传成功会把接口返回的下载链接存入fileList2
          // fileList.forEach((item) => {
          //   if (item.url) {
          //     this.fileList2.push(item.url)
          //   } else if (item.response) {
          //     this.fileList2.push(item.response.data)
          //   }
          // })
          this.$message.success(`${name} 上传成功!`)
          formInput[field] = response.data.src.replace(this.baseImg, '')
          this.form.setFieldsValue(formInput)
        } else {
          this.$message.error(response.msg)
        }

        this.uploading = false
      } else if (status === 'removed') {
        // 如果是移除文件也会重新填入fileList2
        // this.fileList2 = []
        // fileList.forEach((item) => {
        //   if (item.url) {
        //     this.fileList2.push(item.url)
        //   } else if (item.response) {
        //     this.fileList2.push(item.response.data)
        //   }
        // })
        formInput[field] = ''
        this.form.setFieldsValue(formInput)
        this.uploading = false
      } else if (status === 'uploading') {
        this.uploading = true
      }
      // this.fileList = [ ...fileList ] // 重点
      // console.log(this.fileList)
    }
    // handleCancel() {
    //   this.previewVisible = false
    // },
    // handlePreview(file) {
    //   // this.previewImage = file.url || file.preview
    //   console.log(file)
    //   const { status, response, thumbUrl } = file
    //   if (status === 'done' && response.code === '0') {
    //     // this.previewImage = thumbUrl
    //     this.previewImage = response.data.src || thumbUrl
    //   } else {
    //     this.previewImage = thumbUrl
    //   }
    //   this.previewVisible = true
    // }
  }
}
</script>
