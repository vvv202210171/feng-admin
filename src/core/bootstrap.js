import store from '@/store'
import storage from 'store'
import { fetchGlobalData, fetchGlobalEnumsData, setTheme } from '@/utils/proto'
import '@/core/lazy_use' // use lazy load components
import '@/permission' // permission control
import '@/utils/filter' // global filter
import '@/global.less' // global style
import { PermissionVerify, loadMyPermissionlist } from '@/utils/util'
import Vue from 'vue'
import defaultSettings from '@/config/defaultSettings'
import {
  ACCESS_TOKEN,
  APP_LANGUAGE,
  TOGGLE_CONTENT_WIDTH,
  TOGGLE_FIXED_HEADER,
  TOGGLE_FIXED_SIDEBAR,
  TOGGLE_HIDE_HEADER,
  TOGGLE_LAYOUT,
  TOGGLE_NAV_THEME,
  TOGGLE_WEAK,
  TOGGLE_COLOR,
  TOGGLE_MULTI_TAB
} from '@/store/mutation-types'

loadMyPermissionlist()
Vue.prototype.$verify = PermissionVerify

export default function Initializer() {
  fetchGlobalData()
  fetchGlobalEnumsData()
  setTheme()
  store.commit(TOGGLE_LAYOUT, storage.get(TOGGLE_LAYOUT, defaultSettings.layout))
  store.commit(TOGGLE_FIXED_HEADER, storage.get(TOGGLE_FIXED_HEADER, defaultSettings.fixedHeader))
  store.commit(TOGGLE_FIXED_SIDEBAR, storage.get(TOGGLE_FIXED_SIDEBAR, defaultSettings.fixSiderbar))
  store.commit(TOGGLE_CONTENT_WIDTH, storage.get(TOGGLE_CONTENT_WIDTH, defaultSettings.contentWidth))
  store.commit(TOGGLE_HIDE_HEADER, storage.get(TOGGLE_HIDE_HEADER, defaultSettings.autoHideHeader))
  store.commit(TOGGLE_NAV_THEME, storage.get(TOGGLE_NAV_THEME, defaultSettings.navTheme))
  store.commit(TOGGLE_WEAK, storage.get(TOGGLE_WEAK, defaultSettings.colorWeak))
  store.commit(TOGGLE_COLOR, storage.get(TOGGLE_COLOR, defaultSettings.primaryColor))
  store.commit(TOGGLE_MULTI_TAB, storage.get(TOGGLE_MULTI_TAB, defaultSettings.multiTab))
  store.commit('SET_TOKEN', storage.get(ACCESS_TOKEN))
  store.dispatch('setLang', storage.get(APP_LANGUAGE, 'zh-CN'))
  // last step
}
