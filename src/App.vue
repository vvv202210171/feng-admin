<template>
  <a-config-provider :locale="locale">

    <div id="app" class="colorWeak flex" style="background-color: white;">
      <chat v-if="isShowChat"></chat>

      <router-view />
    </div>
  </a-config-provider>
</template>

<script>
import { domTitle, setDocumentTitle } from '@/utils/domUtil'
import { i18nRender } from '@/locales'
import chat from '@/views/chat'


export default {
  components: { chat },
  created() { },
  computed: {
    isShowChat() {
      const allowList = ['login', 'register', 'registerResult', 'iplimit']; // no redirect allowList
      return !allowList.includes(this.$route.name);  // 使用 $route.name 来获取当前路由名称
    },
    locale() {
      // 只是为了切换语言时，更新标题
      const { title } = this.$route.meta
      setDocumentTitle(title ? `${this.title}- ${i18nRender(title)} - ${domTitle}` : `${this.title}`)
      return this.$i18n.getLocaleMessage(this.$store.getters.lang).antLocale
    }
  }
}
</script>
