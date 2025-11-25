<template>
  <a-modal
    :title="(config && config.title) || ''"
    :width="width"
    :visible="visible"
    :confirm-loading="loading"
    @ok="
      () => {
        $emit('ok');
      }
    "
    @cancel="
      () => {
        $emit('cancel');
      }
    "
  >
    <a-spin :spinning="loading">
      <a-form :form="form" v-bind="formLayout">
        <a-row>
          <a-col
            v-for="(item, inx) in options"
            :key="inx + '-modal'"
            :span="item.span || 24"
          >
            <a-form-item :label="item.title">
              <!-- input -->
              <a-input
                v-if="item.type === 'input'"
                v-decorator="[item.field, item.decorator]"
                autocomplete="off"
                :disabled="item.disabled"
                :placeholder="item.placeholder || ''"
              />
              <!-- input -->
              <a-input
                v-if="item.type === 'password'"
                v-decorator="[item.field, item.decorator]"
                autocomplete="off"
                type="password"
                :disabled="item.disabled"
                :placeholder="item.placeholder || ''"
              />
              <!-- number -->
              <a-input-number
                v-if="item.type === 'number'"
                v-decorator="[item.field, item.decorator]"
                autocomplete="off"
                :min="item.min"
                :max="item.max"
                type="number"
                style="width: 180px"
                :placeholder="item.placeholder || ''"
              />
              <!-- image -->
              <template v-if="item.type === 'image'">
                <div style="display: flex">
                  <a-input
                    :ref="'uploadImg-' + item.field"
                    v-decorator="[item.field, item.decorator]"
                    style="display: none"
                    autocomplete="off"
                    disabled
                    :placeholder="item.placeholder || ''"
                  />
                  <a-upload
                    list-type="text"
                    :file-list="imgFileList"
                    accept=".png,.jpg,.jpeg,.xyz,.gif,.com"
                    :custom-request="(options) => customRequest(options, item)"
                  >
                    <a-button> 上传 </a-button>
                  </a-upload>
                  <div
                    v-if="model && item.field && model[item.field]"
                    style="margin-left: 10px"
                  >
                    <img
                      :src="imgUrl(model[item.field])"
                      style="width: 200px; height: auto; min-height: 80px"
                    />
                  </div>
                </div>
              </template>
              <!-- image show -->
              <template v-if="item.type === 'image-show'">
                <div
                  v-if="model && item.field && model[item.field]"
                  style="margin-left: 10px"
                >
                  <img
                    :src="imgUrl(model[item.field])"
                    style="width: 200px; height: auto; min-height: 80px"
                  />
                </div>
              </template>
              <!-- textarea -->
              <a-textarea
                v-if="item.type === 'textarea'"
                v-decorator="[item.field, item.decorator]"
                :rows="item.rows || 4"
                :placeholder="item.placeholder || ''"
              />
              <!-- select -->
              <a-select
                v-if="item.type === 'select'"
                v-decorator="[item.field, item.decorator]"
                :show-search="item.search"
                :placeholder="item.placeholder || ''"
                :disabled="item.disabled"
                @search="handleSearch"
              >
                <a-select-option
                  v-for="option in item.options"
                  :key="option.val"
                  :value="option.val"
                >
                  {{ option.title }}
                </a-select-option>
              </a-select>
              <!-- currency select -->
              <a-select
                v-if="item.type === 'select-currency'"
                v-decorator="[item.field, item.decorator]"
                show-search
                :disabled="item.disabled"
                :placeholder="item.placeholder || ''"
                @search="handleSearch"
              >
                <a-select-option
                  v-for="option in currencyOptions"
                  v-if="!item.klineType || option.klineType === item.klineType"
                  :key="option.autoid + '-currency'"
                  :value="option.coin"
                >
                  {{ option.coin }}
                </a-select-option>
              </a-select>
              <!-- currency langs -->
              <a-select
                v-if="item.type === 'select-langs'"
                v-decorator="[item.field, item.decorator]"
                show-search
                :disabled="item.disabled"
                :placeholder="item.placeholder || ''"
              >
                <a-select-option v-for="k in Object.keys(langs)" :key="k" :value="k">
                  {{ langs[k] }}
                </a-select-option>
              </a-select>
              <!-- timer -->
              <!--
            :disabled-date="disabledStartDate"
            @openChange="handleStartOpenChange"
          -->
              <a-date-picker
                v-if="item.type === 'timer'"
                v-decorator="[item.field, item.decorator]"
                show-time
                format="YYYY-MM-DD HH:mm:ss"
                :placeholder="item.placeholder || ''"
                :disabled-date="disabledDate"
                @change="handleChange"
              />
              <!-- HH:mm:ss -->

              <!-- label -->
              <div v-if="item.type === 'label'">
                <p>{{ model && item.field ? model[item.field] : "" }}</p>
              </div>
              <!-- ieditor 待完成，富文本 -->
              <div v-if="item.type === 'richEditor'">
                <QuillEditor v-decorator="[item.field, item.decorator]"></QuillEditor>
              </div>
              <!-- ieditor 待完成，富文本 -->
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { uploadingImg } from "@/api/manage";
import pick from "lodash.pick";
import moment from "moment";
import QuillEditor from "@/components/Editor/QuillEditor";
import "moment/locale/zh-cn";
export default {
  components: { QuillEditor },
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    loading: {
      type: Boolean,
      default: () => false,
    },
    model: {
      type: Object,
      default: () => null,
    },
    config: {
      type: Object,
      default: () => {},
    },
    width: {
      type: Number,
      default: 920,
    },
    options: {
      type: Array,
      required: true,
    },
  },
  data() {
    this.formLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const currencyOptions = this.$store.getters.currencylist;
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
      imgFileList: [],
      currencyOptions,
    };
  },
  created() {
    const fields = this.options.map((e) => {
      // // 有图片上传，则存入字段名
      // if (e.type === 'image') {
      //   this.hasImg = e.field
      // }
      if (e.type === "image") {
        this.fileList[e.field] = [];
      }
      return e.field;
    });
    // console.log(this.fileList)
    // 防止表单未注册
    fields.forEach((v) => this.form.getFieldDecorator(v));
    // 获取权限数据

    // 当 model 发生改变时，为表单设置值
    this.$watch("model", () => {
      this.model && this.form.setFieldsValue(pick(this.model, fields));
    });
  },
  methods: {
    beforeUpload(file) {
      return true;
    },
    // 自定义上传逻辑
    async customRequest({ file, onSuccess, onError }, item) {
      console.log("item", item);
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await uploadingImg(formData);
        if (response.code === 0) {
          this.$message.success("上传成功");
          this.handleUploadChange(response, item);
        } else {
          this.$message.error("上传失败");
          onError(new Error("上传失败"));
        }
      } catch (error) {
        console.log(error);
        this.$message.error("上传出错");
        onError(error);
      }
    },
    // select
    handleSearch(value) {
      // console.log(value)
      // fetch(value, data => (this.data = data));
    },
    // timer
    disabledDate(cur) {
      // 获取当前时间
      const now = moment().format("YYYY-MM-DD") + " 00:00:00";
      const dateT = moment(now).valueOf();
      // 置灰日期小于当前时间
      return cur < dateT;
    },
    handleChange(data, dataString) {
      console.log(data, dataString);
      // const ss = this.$form.createForm(this).getFieldValue('name')
      // console.log(ss)
      // console.log(this.form.getFieldsValue())
    },
    disabledStartDate(startValue) {
      const endValue = this.endValue;
      if (!startValue || !endValue) {
        return false;
      }
      return startValue.valueOf() > endValue.valueOf();
    },
    disabledEndDate(endValue) {
      const startValue = this.startValue;
      if (!endValue || !startValue) {
        return false;
      }
      return startValue.valueOf() >= endValue.valueOf();
    },
    handleStartOpenChange(open) {
      console.log(open);
      // if (!open) {
      //   this.endOpen = true
      // }
    },
    handleEndOpenChange(open) {
      this.endOpen = open;
    },
    onClick(item) {
      // console.log(item)
      this.imageConfig = item;
      return false;
    },
    handleUploadChange(info, item) {
      if (info.code !== 0) {
        return;
      }
      const { field } = item;

      const formInput = {};

      formInput[field] = info.data.replace(this.baseImg, "");

      this.form.setFieldsValue(formInput);
      if (this.model == null) {
        this.model = {};
      }
      this.model[field] = formInput[field];

      this.imgFileList = [];
    },
  },
};
</script>
