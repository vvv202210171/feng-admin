import router, { resetRouter } from './router' // , { resetRouter }
import store from './store'
import storage from 'store'
import NProgress from 'nprogress' // progress bar
import '@/components/NProgress/nprogress.less' // progress bar custom style
import notification from 'ant-design-vue/es/notification'
import { setDocumentTitle, domTitle } from '@/utils/domUtil'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { i18nRender } from '@/locales'
import { checkIp } from '@/api/login'

NProgress.configure({ showSpinner: false }) // NProgress Configuration
const iplimit = 'iplimit'
const allowList = ['login', 'register', 'registerResult', iplimit] // no redirect allowList
const loginRoutePath = '/user/login'
const defaultRoutePath = '/home' // '/dashboard/workplace'

router.beforeEach((to, from, next) => {
  NProgress.start() // start progress bar
  to.meta && typeof to.meta.title !== 'undefined' && setDocumentTitle(`${i18nRender(to.meta.title)} - ${domTitle}`)
  /* has token */
  const token = storage.get(ACCESS_TOKEN)
  if (token) {
    if (to.path === loginRoutePath) {
      next({ path: defaultRoutePath })
      NProgress.done()
    } else {
      // console.log(store.getters.currencylist)
      if (store.getters.currencylist.length === 0) {
        // 获取全币种，保存在store里
        store.dispatch('GetCurrency')
      }
      // check login user.roles is null
      if (store.getters.roles.length === 0) {
        // request login userInfo
        store
          .dispatch('GetInfo')
          .then((res) => {
            // 根据用户权限信息生成可访问的路由表
            store.dispatch('GenerateRoutes', { token, ...res }).then(() => {
              // 动态添加可访问路由表
              // VueRouter@3.5.0+ New API
              resetRouter() // 重置路由 防止退出重新登录或者 token 过期后页面未刷新，导致的路由重复添加
              store.getters.addRouters.forEach((r) => {
                router.addRoute(r)
              })
              // 请求带有 redirect 重定向时，登录自动重定向到该地址
              const redirect = decodeURIComponent(from.query.redirect || to.path)
              if (to.path === redirect) {
                // set the replace: true so the navigation will not leave a history record
                next({ ...to, replace: true })
              } else {
                // 跳转到目的路由
                next({ path: redirect })
              }
            })
          })
          .catch((e) => {
            console.log(e)
            notification.error({
              message: '错误',
              description: '请求用户信息失败，请重试'
            })
            // 失败时，获取用户信息失败时，调用登出，来清空历史保留信息
            store.dispatch('Logout').then(() => {
              next({ path: loginRoutePath, query: { redirect: to.fullPath } })
            })
          })
      } else {
        next()
      }
    }
  } else {
    if (to.name == iplimit) {
      next()
    } else {
      handlerLimit(next, to)
    }
  }
})

function handlerLimit(next, to) {
  checkIp().then((r) => {
    // 在免登录名单，直接进入
    const { data } = r
    if (data.status === 'success') {
      if (allowList.includes(to.name)) {
        next()
      } else {
        next({ path: loginRoutePath, query: { redirect: to.fullPath } })
        NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
      }
    } else {
      next({ path: iplimit, query: { redirect: to.fullPath } })
    }
  })
}
router.afterEach(() => {
  NProgress.done() // finish progress bar
})
