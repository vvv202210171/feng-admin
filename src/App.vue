<template>
  <a-config-provider :locale="locale">

    <div id="app" class="colorWeak flex" style="background-color: white;">
      <chat></chat>

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
    locale() {
      // 只是为了切换语言时，更新标题
      const { title } = this.$route.meta
      setDocumentTitle(title ? `${this.title}- ${i18nRender(title)} - ${domTitle}` : `${this.title}`)
      return this.$i18n.getLocaleMessage(this.$store.getters.lang).antLocale
    }
  }
}
</script>
