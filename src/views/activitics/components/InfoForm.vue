<template>
  <a-modal
    :title="computedTitle"
    :width="1200"
    :visible="visible"
    :confirmLoading="loading"
    @ok="saveLang"
    @cancel="
      () => {
        $emit('cancel');
      }
    "
  >
    <a-spin :spinning="loading" v-if="visible">
      <!-- 检查是否有 id 并且大于0，大于0是修改。其他是新增，新增不显示主键ID -->
      <a-tabs default-active-key="en">
        <a-tab-pane
          :key="langObj.lang"
          :tab="langObj.chineseNote"
          v-for="langObj in formData"
        >
          <a-textarea
            v-if="type == 'title'"
            v-model="langObj.content"
            :rows="20"
            placeholder="不设置默认为英文"
          />
          <QuillEditor
            v-decorator="['content']"
            v-model="langObj.content"
            @change="handleEditorChange($event, langObj)"
          />
          <!-- <rich-tiny v-else v-model="langObj.content"></rich-tiny> -->
        </a-tab-pane>
      </a-tabs>
    </a-spin>
  </a-modal>
</template>

<script>
import QuillEditor from "@/components/Editor/QuillEditor";
// import RichTiny from "@/components/RichTiny";
// 表单字段
export default {
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    loading: {
      type: Boolean,
      default: () => false,
    },
    type: {
      type: String,
      required: true,
    },
    langData: {
      type: Array,
      default: () => [],
    },
  },
  components: { QuillEditor },
  data() {
    return {
      formData: [],
    };
  },
  created() {
    console.log("custom modal created" + this.langData);

    // 防止表单未注册

    // 当 model 发生改变时，为表单设置值
    // this.$watch("langData", () => {
    //   if (this.langData) {
    //     this.formData = this.langData;
    //   }
    // });

    // 深度监听 langData，确保实时更新 formData
    this.$watch(
      "langData",
      (newVal) => {
        if (newVal) {
          this.formData = [...newVal]; // 创建一个副本来避免直接修改 props
        }
      },
      { immediate: true }
    ); // immediate: true 确保组件加载时也立即同步一次数据
  },

  computed: {
    computedTitle() {
      if (this.type === "title") return "设置标题多语言";
      if (this.type === "remarks") return "设置描述多语言";
      return this.type;
    },
  },
  methods: {
    saveLang() {
      this.$emit("ok", this.formData);
    },
    handleEditorChange(value, langObj) {
      // 在此处处理编辑器内容的变化
      console.log("Editor changed:", value);
      // 你可以在这里将编辑器内容更新到 langObj
      langObj.content = value;
    },
  },
};
</script>
