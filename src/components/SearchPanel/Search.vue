<template lang="">
  <a-form
    name="Search"
    layout="inline"
    autocomplete="off"
    style="margin-bottom: 14px;"
    @submit="doSearch"
  >
    <a-form-item label="搜索内容">
      <a-input style="width: 240px;" v-model="queryParam.key" placeholder="请输入要搜索的内容">
      </a-input>
    </a-form-item>
    <a-form-item>
      <a-button
        htmlType="submit"
        :disabled="disabledSearch"
        type="primary"
        @click="doSearch"
      >查询</a-button>
    </a-form-item>
  </a-form>
</template>

<script>
export default {
  name: 'SearchPanel',
  data () {
    return {
      loading: false,
      queryParam: {}
    }
  },
  computed: {
    // 搜索状态
    disabledSearch () {
      return this.loading
    }
  },
  created() {

  },
  methods: {
    doSearch () {
      console.log(this.queryParam)
      // this.getData()
    }
  }
}
</script>

<style lang="">

</style>
