<template>
  <div :class="wrpCls">
    <a-space :size="8">
      <span>{{ offsetCurrentTime }}</span>
      <a-switch checked-children="白天" un-checked-children="黑夜" v-model="isDark" @change="themeChange" />
      <a-button type="link" block @click="topage('/examine/recharge')" class="btn-pad"> 存款:{{ inCount }} </a-button>
      <a-button type="link" @click="topage('/examine/withdraw')" block class="btn-pad">
        取款:{{ outCount }}</a-button>
      <a-button type="link" @click="topage('/examine/realyname')" class="btn-pad">待审核:{{ reviewCount }}</a-button>
    </a-space>
    <span @click="toggleMute">
      <img :src="isMuted ? require('/src/assets/icon_nosound.png') : require('/src/assets/icon_sound.png')"
        alt="Speaker" style="height: 12px; margin-left: 10px; cursor: pointer; filter: invert(0%)" />
    </span>
    <avatar-dropdown :menu="showMenu" :current-user="currentUser" :class="prefixCls" />
    <!-- <select-lang :class="prefixCls" />-->
  </div>
</template>

<script>
import AvatarDropdown from './AvatarDropdown'
import SelectLang from '@/components/SelectLang'
import { getWithdrawalAndDeposit } from '@/api/manage'
import { setIsDark, getThemeDark } from '@/utils/proto'

export default {
  name: 'RightContent',
  components: {
    AvatarDropdown,
    SelectLang
  },
  props: {
    prefixCls: {
      type: String,
      default: 'ant-pro-global-header-index-action'
    },
    isMobile: {
      type: Boolean,
      default: () => false
    },
    topMenu: {
      type: Boolean,
      required: true
    },
    theme: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      showMenu: true,
      currentUser: {},
      offsetCurrentTime: "",

      inCount: 0,
      outCount: 0,
      isDark: false,
      reviewCount: 0,
      isMuted: true,
      timer: null
    }
  },
  created() {
    this.isDark = getThemeDark()
    setIsDark(this.isDark) // 确保首次挂载时设置 data-theme
    setInterval(() => {
      const timeZone = parseInt(sessionStorage.getItem("timeZone")) || -4;
      this.formatDateByOffset(timeZone);
    }, 1000);
  },
  methods: {
    formatDateByOffset(offset) {
      const now = new Date();
      // 当前时间的 UTC 毫秒数
      const utc = now.getTime() + now.getTimezoneOffset() * 60000;

      // 加上偏移量（offset 单位：小时）
      const targetDate = new Date(utc + 3600000 * offset);

      // 格式化 YYYY-MM-DD HH:mm:ss
      const yyyy = targetDate.getFullYear();
      const mm = String(targetDate.getMonth() + 1).padStart(2, "0");
      const dd = String(targetDate.getDate()).padStart(2, "0");
      const hh = String(targetDate.getHours()).padStart(2, "0");
      const min = String(targetDate.getMinutes()).padStart(2, "0");
      const ss = String(targetDate.getSeconds()).padStart(2, "0");
      this.offsetCurrentTime = `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss} (UTC${offset > 0 ? "+" : ""
        }${offset})`;
    },

    themeChange() {
      setIsDark(this.isDark)
      location.reload()
    },
    hasPermission(permission) {
      return this.permissionList.includes(permission)
    },
    topage(url) {
      this.$router.push({ path: url })
    },
    getDataFromBackend() {
      getWithdrawalAndDeposit()
        .then((res) => {
          const inCount = res.data.inCount
          const outCount = res.data.outCount
          // 更新数据
          this.$set(this, 'inCount', inCount)
          this.$set(this, 'outCount', outCount)
          this.$set(this, 'reviewCount', res.data.reviewCount)
          if (this.isMuted) {
            return // 如果静音，则直接返回，不播放音频
          }

          if (inCount !== 0) {
            const audio = new Audio('/audio/deposit_default.mp3')
            audio.play()
          }

          if (outCount !== 0) {
            const audio = new Audio('/audio/member_withdrawal_default.mp3')
            audio.play()
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    toggleMute() {
      this.isMuted = !this.isMuted
    }
  },
  computed: {
    wrpCls() {
      return {
        'ant-pro-global-header-index-right': true,
        [`ant-pro-global-header-index-${this.isMobile || !this.topMenu ? 'light' : this.theme}`]: true
      }
    },
    permissionList() {
      return this.$store.getters.roles.permissionList
    }
  },
  mounted() {
    this.getDataFromBackend() // 初次加载数据
    this.timer = setInterval(() => {
      this.getDataFromBackend()
    }, 12000)

    const username = this.$store.getters.username
    setTimeout(() => {
      this.currentUser = {
        name: username // 'Serati Ma'
      }
    }, 1500)
  },
  beforeDestroy() {
    clearInterval(this.timer)
  }
}
</script>
<style lang="less">
.btn-pad {
  padding: 0 5px;
}
</style>