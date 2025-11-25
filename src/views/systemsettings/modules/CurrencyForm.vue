<template>
  <a-modal
    title="编辑币种简介多语言设置"
    :width="1200"
    :visible="visible"
    :confirmLoading="loading"
    @ok="saveLang"
    @cancel="
      () => {
        $emit('cancel')
      }
    "
  >
    <a-spin :spinning="loading">
      <!-- 检查是否有 id 并且大于0，大于0是修改。其他是新增，新增不显示主键ID -->
      <a-tabs default-active-key="en">
        <a-tab-pane :key="langObj.lang" :tab="langObj.chineseNote" v-for="langObj in formData">
          <a-textarea v-model="langObj.content" :rows="20" placeholder="不设置默认为英文" />
        </a-tab-pane>
      </a-tabs>
    </a-spin>
  </a-modal>
</template>

<script>
// 表单字段
const fields = ['autoid', 'code', 'url', 'type', 'info']

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
    langData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      formData: []
    }
  },
  created() {
    console.log('custom modal created' + this.langData)

    // 防止表单未注册

    // 当 model 发生改变时，为表单设置值
    this.$watch('langData', () => {
      if (this.langData) {
        this.formData = this.langData
      }
    })
  },
  methods: {
    saveLang() {
      this.$emit('ok', this.formData)
    }
  }
}
</script>
