/**
 * 项目默认配置项
 * primaryColor - 默认主题色, 如果修改颜色不生效，请清理 localStorage
 * navTheme - sidebar theme ['dark', 'light'] 两种主题
 * colorWeak - 色盲模式
 * layout - 整体布局方式 ['sidemenu', 'topmenu'] 两种布局
 * fixedHeader - 固定 Header : boolean
 * fixSiderbar - 固定左侧菜单栏 ： boolean
 * contentWidth - 内容区布局： 流式 |  固定
 *
 * storageOptions: {} - Vue-ls 插件配置项 (localStorage/sessionStorage)
 *
 */

export default {
  version: '1.0', // 1.0 为旧版接口。打包时修改版本号就更新接口获取方法，2.0为新版接口
  navTheme: 'light', // theme for nav menu
  theme: 'light',
  colorWeak: false,
  menu: {
    locale: true
  },
  title: '交易所管理后台',
  pwa: false,
  iconfontUrl: '',
  production: process.env.NODE_ENV === 'production' && process.env.VUE_APP_PREVIEW !== 'true',
  layout: 'topmenu',
  contentWidth: 'Fluid',

  primaryColor: '#1890FF',
  fixedHeader: true,
  fixSiderbar: true,
  hideHintAlert: false,
  hideCopyButton: false
}
