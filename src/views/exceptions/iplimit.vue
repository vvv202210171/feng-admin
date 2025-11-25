<template>
  <div class="full-screen-background">
    <a-card :bordered="true" class="ip-card">
      <div class="inner">
        <h2 class="title">区域限制</h2>
        <div class="content">
          <p class="message"><strong>IP:</strong> {{ ip }}</p>
          <div class="message">
            <p><strong>尊敬的客户：</strong></p>
            <p class="content-detaill">您的IP地址禁止访问本网站。</p>
            <p class="content-detaill">不便之处，敬请见谅！</p>
            <p class="content-detaill href">{{ domain }}</p>
          </div>
          <div class="message">
            <p><strong>Dear Valued Customers:</strong></p>
            <p class="content-detaill">
              Viewing and using this website at your current IP Address is prohibited due to its website rules.
            </p>
            <p class="content-detaill">We regret any inconvenience.</p>
            <p class="content-detaill href">From {{ domain }}</p>
          </div>
        </div>
      </div>
    </a-card>
  </div>
</template>

<script>
import { checkIp } from '@/api/login'
export default {
  name: 'iplimit',
  data() {
    return {
      domain: null,
      ip: null
    }
  },
  methods: {
    async getIp() {
      const res = await checkIp()
      const { data } = res
      console.log('data', data)
      if (data.status === 'success') {
        this.$router.push({ path: '/home' })
      } else {
        this.ip = data.ip
      }
    }
  },
  created() {
    const hostname = window.location.hostname
    this.domain = hostname
    this.getIp()
  }
}
</script>

<style lang="less">
.full-screen-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, #14234e 20%, #0e193b 100%);
  display: flex;
  justify-content: center;
  align-items: center;
}

.ip-card {
  width: 550px;
  text-align: center;
  margin-top: -200px;
  border-radius: 6px;
  .ant-card-body {
    padding: 1px;
  }
  .inner {
    border: solid 2px #bce;
    background-color: #f5f5ff;
    border-radius: 6px;
  }
}

.title {
  font-size: 26px;
  color: red;
  margin-bottom: 20px;
  font-weight: bolder;
  line-height: 70px;
  border-bottom: 2px solid #000;
  margin: 0 10px 20px;
}

.content {
  text-align: left;
  .content-detaill {
    font-size: 12px;
    line-height: 20px;
    color: #333;
  }
  .href {
    color: blue;
    cursor: pointer;
  }
}

.message {
  margin: 20px;
  padding: 10px;
  border: 1px solid #ddd;
  background: white;
}

.message p {
  margin: 0;
}
</style>
