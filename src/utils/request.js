import axios from 'axios'
import store from '@/store'
import storage from 'store'
import notification from 'ant-design-vue/es/notification'
import { VueAxios } from './axios'
import { ACCESS_TOKEN } from '@/store/mutation-types'

axios.defaults.withCredentials = true // 让ajax携带cookie

// 创建 axios 实例
const request = axios.create({
  // API 请求的默认前缀
  baseURL: process.env.VUE_APP_API_BASE_URL,
  timeout: 6000 * 10 // 请求超时时间
})

// 异常拦截处理器
const errorHandler = (error) => {
  if (error.response) {
    const data = error.response.data
    console.log(data)
    // 从 localstorage 获取 token
    const token = storage.get(ACCESS_TOKEN)
    if (error.response.status === 403) {
      notification.error({
        message: 'Forbidden',
        description: data.message
      })
    }
    if (error.response.status === 401 && !(data.result && data.result.isLogin)) {
      notification.error({
        message: 'Unauthorized',
        description: 'Authorization verification failed'
      })
      if (token) {
        store.dispatch('Logout').then(() => {
          setTimeout(() => {
            window.location.reload()
          }, 1500)
        })
      }
    }
  }
  return Promise.reject(error)
}

// request interceptor
request.interceptors.request.use((config) => {
  const token = storage.get(ACCESS_TOKEN)
  // const username = storage.get(USER_NAME)
  // 如果 token 存在
  // 让每个请求携带自定义 token 请根据实际情况自行修改
  if (token) {
    config.headers[ACCESS_TOKEN] = token
    config.headers['adminToken'] = token
    // config.headers['Cookie'] = `username=${username}; token=${token}`
    // document.cookie = `username=${username}; token=${token}`
    // console.log(`username=${username}; token=${token}`)
  }
  // 中文乱码，请求头类型改变
  if (config.chineseURI) {
    config.headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
  }
  if (config.multipart) {
    delete config.headers['Content-Type']
  }
  return config
}, errorHandler)

// response interceptor
request.interceptors.response.use((response) => {
  if (response.data && response.data.code === '1') {
    notification.error({
      message: 'Forbidden',
      description: response.data.msg
    })
  }
  // ip禁止访问
  if (response.data && response.data.code === 405) {
    location.href = '/iplimit'
    return Promise.reject(response.data)
  }
  if (response.data && response.data.code === 406) {
    location.href = '/login'
    return Promise.reject(response.data)
  }
  return response.data
}, errorHandler)

const installer = {
  vm: {},
  install(Vue) {
    Vue.use(VueAxios, request)
  }
}

export default request

export { installer as VueAxios, request as axios }
