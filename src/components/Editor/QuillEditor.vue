<template>
  <div :class="prefixCls">
    <quill-editor
      v-model="content"
      ref="myQuillEditor"
      :options="editorOption"
      @blur="onEditorBlur($event)"
      @focus="onEditorFocus($event)"
      @ready="onEditorReady($event)"
      @change="onEditorChange($event)"
    >
    </quill-editor>
  </div>
</template>

<script>
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

import { quillEditor, Quill } from "vue-quill-editor";

import imageResize from "quill-image-resize-module";
Quill.register("modules/imageResize", imageResize);
import { ImageDrop } from "quill-image-drop-module";
import { uploadingImg } from "@/api/manage";
Quill.register("modules/imageDrop", ImageDrop);

// 自定义图片上传模块
function imageHandler() {
  const fileInput = document.createElement("input");
  fileInput.setAttribute("type", "file");
  fileInput.setAttribute("accept", "image/*");
  fileInput.click();

  fileInput.onchange = async () => {
    const file = fileInput.files[0];
    if (!file) return;

    // 上传图片到服务器
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await uploadingImg(formData);

      if (response.code === 0) {
        const imageUrl = response.data; // 假设返回的是图片的 URL
        const range = this.quill.getSelection(); // 确保在这里获取 Quill 实例
        if (range) {
          this.quill.insertEmbed(range.index, "image", imageUrl);
        } else {
          console.error("未能获取光标位置");
        }
      } else {
        console.error("图片上传失败");
      }
    } catch (error) {
      console.error("上传失败", error);
    }
  };
}

export default {
  name: "QuillEditor",
  components: {
    quillEditor,
  },
  props: {
    prefixCls: {
      type: String,
      default: "ant-editor-quill",
    },
    value: {
      type: String,
    },
  },
  data() {
    return {
      content: null,
      editorOption: {
        modules: {
          toolbar: [
            ["bold", "italic", "underline", "strike"],
            ["blockquote", "code-block"],
            [{ header: 1 }, { header: 2 }],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ script: "sub" }, { script: "super" }],
            [{ indent: "-1" }, { indent: "+1" }],
            [{ direction: "rtl" }],
            [{ size: ["small", false, "large", "huge"] }],
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            [{ color: [] }, { background: [] }],
            [{ font: [] }],
            [{ align: [] }],
            ["clean"],
            ["image", "video"],
          ],
          imageDrop: true,
          imageResize: {
            displayStyles: {
              backgroundColor: "black",
              border: "none",
              color: "white",
            },
            modules: ["Resize", "DisplaySize", "Toolbar"],
          },
        },
      },
    };
  },
  methods: {
    onEditorBlur(quill) {
      console.log("editor blur!", quill);
    },
    onEditorFocus(quill) {
      console.log("editor focus!", quill);
    },
    onEditorReady(quill) {
      console.log("editor ready!", quill);
    },
    onEditorChange({ quill, html, text }) {
      this.$emit("change", html);
    },
  },
  mounted() {
    this.content = this.value || ""; // 初始化时设置 content

    // 获取 Quill 实例并重写图片上传逻辑
    this.quill = this.$refs.myQuillEditor.quill; // 保证 Quill 实例已正确获取
    const toolbar = this.quill.getModule("toolbar");

    // 添加图片上传处理
    toolbar.addHandler("image", imageHandler.bind(this));
  },
  watch: {
    value(val) {
      console.log("value", val);
      this.content = val;
    },
  },
};
</script>

<style lang="less" scoped>
@import url("../index.less");

/* 覆盖 quill 默认边框圆角为 ant 默认圆角，用于统一 ant 组件风格 */
.ant-editor-quill {
  line-height: initial;
  :deep(.ql-toolbar.ql-snow) {
    border-radius: @border-radius-base @border-radius-base 0 0;
  }
  :deep(.ql-container.ql-snow) {
    border-radius: 0 0 @border-radius-base @border-radius-base;
  }
}
.editor-container .ql-container {
  height: 300px; /* 设置编辑区域的高度 */
}
/* Add resize functionality for images */
/* Add resize functionality for images */
:deep(.ql-editor img) {
  max-width: 100%;
  height: auto;
  resize: both;
  overflow: hidden;
  object-fit: contain;
}
</style>
