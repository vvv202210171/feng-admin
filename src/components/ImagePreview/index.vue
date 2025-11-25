<template>
    <div>
      <img
        :src="imageUrl"
        alt="示例图片"
        style="width: 150px; cursor: pointer;"
        @click="handlePreview(imageUrl)"
      />
      <a-modal v-model="isModalVisible" footer={null} @cancel="handleCancel" :title="title">
        <img :src="previewImage" alt="预览图片" style="width: 100%;" />
      </a-modal>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        isModalVisible: false,
        previewImage: '',
      };
    },
    props: {
      imageUrl: {
        type: String,
        required: true,
      },
      title: {
        type: String,
        default:"图片预览"
      },
    },
    methods: {
      handlePreview(imageSrc) {
        this.previewImage = imageSrc;
        this.isModalVisible = true;
      },
      handleCancel() {
        this.isModalVisible = false;
      },
    },
  };
  </script>
  
  <style scoped>
  /* 添加你的样式 */
  </style>
  