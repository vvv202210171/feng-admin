<template>
  <div>
    <editor
      v-model="content"
      :init="editorSettings"
      api-key="mozh783yhzr3jcvt86qfem3qwhkse7w6333q2u1qajn64wgf"
    />
  </div>
</template>

<script>
import Editor from "@tinymce/tinymce-vue";

export default {
  components: {
    editor: Editor,
  },
  props: {
    value: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      content: "", // 初始化为传入的值
      editorSettings: {
        height: 600,
        menubar: false,
        plugins: "lists link image code table",
        toolbar:
          "undo redo | bold italic | alignleft aligncenter alignright | code | table ",
        language: "zh_CN",
        language_url: "/tinymce/zh_CN.js",
        table_default_attributes: {
          border: "1",
        },
      },
    };
  },
  watch: {
    value(newVal) {
      this.content = newVal;
    },
    content(newContent) {
      console.log("content", newContent);
      this.$emit("change", newContent); // 将内容更新到父组件
    },
  },
  created() {
    // 在组件创建时将 content 初始化为传入的 value
    this.content = this.value;
  },
};
</script>
