import Vue from 'vue'
import { getTitle, getLangs, getEnums } from '@/api/login'
import defaultSettings from '@/config/defaultSettings'
// 异步获取全局数据
export async function fetchGlobalData() {
  const res = await getLangs()
  if (res.code === 0) {
    Vue.prototype.langs = res.data
    Vue.prototype.getLangs = function (code) {
      if (!code) {
        return ''
      }
      return res.data[code.toLocaleLowerCase()]
    }
  }
}

export async function fetchGlobalEnumsData() {
  const res = await getEnums()
  if (res.code === 0) {
    Vue.prototype.enums = res.data
    Vue.prototype.getDesc = function (enumName, code) {
      if (!code) {
        return ''
      }

      let obj = this.enums[enumName]
      if (!obj) {
        return code
      }
      obj = obj.find((v) => v.code === code)
      return obj ? obj.desc : code
    }
  }
}
export async function setTheme() {
  let obj = {
    title: 'UAT',
    theme: defaultSettings.theme
  }
  const res = await getTitle()
  if (res.code === 0) {
    obj = res.data
  }

  Vue.prototype.title = obj.title
  Vue.prototype.enableGoogleCode = obj.enableGoogleCode === 'enable'
  const baseImg = '/api/res/preview/'
  Vue.prototype.baseImg = baseImg
  Vue.prototype.imgUrl = function (id) {
    return baseImg + id
  }

  setIsDark(getThemeDark(obj))
}
// 获取是否暗黑模式
export function getThemeDark(obj = null) {
  const isDark = localStorage.getItem('isDark')
  if (isDark !== null) {
    return isDark === 'true'
  }
  return obj ? obj.theme === 'dark' : false
}

// 设置暗黑模式
export function setIsDark(themeDark) {
  localStorage.setItem('isDark', themeDark ? 'true' : 'false')
  const root = document.documentElement
  if (themeDark) {
    root.style.setProperty('--colorWeak', 'invert(90%)')
    root.style.setProperty('--img-colorWeak', 'invert(100%)')
  } else {
    root.style.setProperty('--colorWeak', 'invert(0%)')
  }
}
