<template>
  <a-modal
    :title="(config && config.title) || ''"
    :width="1280"
    :visible="visible"
    :confirm-loading="loading"
    @ok="ok"
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
            :span="item.span || 8"
            v-for="(item, inx) in options"
            :key="inx + '-modal'"
            :style="{ display: item.hidden ? 'none' : '' }"
          >
            <a-form-item
              :label="item.title"
              v-if="item.field == 'title'"
              :labelCol="{ span: 2, offset: 0 }"
              :wrapperCol="{ span: 22, offset: 0 }"
            >
              <!-- input -->
              <a-input
                v-if="item.type === 'input'"
                v-decorator="[item.field, item.decorator]"
                autocomplete="off"
                :disabled="item.disabled"
                :placeholder="item.placeholder || ''"
                style="width: 100%"
              />
            </a-form-item>
            <a-form-item
              :label="item.title"
              v-else-if="item.field == 'detail'"
              :labelCol="{ span: 2, offset: 0 }"
              :wrapperCol="{ span: 22, offset: 0 }"
            >
              <!-- ieditor 待完成，富文本 -->
              <div v-if="item.type === 'richEditor'">
                <QuillEditor ref="richRef" v-decorator="[item.field, item.decorator]" />

                <!-- <QuillEditor v-decorator="[item.field, item.decorator]"></QuillEditor> -->
              </div>
            </a-form-item>
            <a-form-item :label="item.title" v-else>
              <!-- input -->
              <a-input
                v-if="item.type === 'input'"
                v-decorator="[item.field, item.decorator]"
                autocomplete="off"
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
                    accept=".png,.jpg,.jpeg"
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
              >
                <a-select-option
                  v-for="option in item.options"
                  :key="option.val"
                  :value="option.val"
                >
                  {{ option.title }}
                </a-select-option>
              </a-select>
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

              <a-date-picker
                v-if="item.type === 'timer'"
                v-decorator="[item.field, item.decorator]"
                show-time
                valueFormat="YYYY-MM-DD HH:mm:ss"
                :placeholder="item.placeholder || ''"
              />

              <!-- image show -->
              <div v-if="item.type === 'image-show'">
                <img
                  :src="imgUrl(model[item.field])"
                  style="width: 200px; height: auto; min-height: 80px"
                />
              </div>
              <!-- label -->
              <div v-if="item.type === 'label'">
                <p>{{ model && item.field ? model[item.field] : "" }}</p>
              </div>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import pick from "lodash.pick";
import moment from "moment";
import "moment/locale/zh-cn";
import QuillEditor from "@/components/Editor/QuillEditor";
//import RichTiny from "@/components/RichTiny";

import { uploadingImg } from "@/api/manage";
export default {
  components: {
    QuillEditor,
  },
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
      fileList: {},
      imgFileList: [],
      timerRules: [], // 时间比较等规则
      endOpen: false,
      imageConfig: {},
      uploading: false,
      fileList: {},
      fileList2: [], // 最终结果存入fileList2
      currencyOptions,
    };
  },
  computed: {},
  created() {
    const fields = this.options.map((e) => {
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
    this.$watch(
      "model",
      () => {
        console.log();
        this.model && this.form.setFieldsValue(pick(this.model, fields));
      },
      { immediate: true }
    );
  },

  methods: {
    ok() {
      this.$emit("ok");
    },
    // timer
    disabledDate(cur) {
      // 获取当前时间
      const now = moment().format("YYYY-MM-DD") + " 00:00:00";
      const dateT = moment(now).valueOf();
      // 置灰日期小于当前时间
      return cur < dateT;
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
    handleEndOpenChange(open) {
      this.endOpen = open;
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
    onClick(item) {
      // console.log(item)
      this.imageConfig = item;
      return false;
    },
  },
};
</script>
