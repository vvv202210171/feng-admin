import Cookies from 'js-cookie'
const TokenKey = 'token'
// const UserName = 'username'

// 获取token的方法
export function getToken () {
  return Cookies.get(TokenKey)
}
// 设置token
export function setToken (token) {
  return Cookies.set(TokenKey, token)
}
// 删除cookies里的token
export function removeToken () {
  return Cookies.remove(TokenKey)
}

// get value
export function getCookies (key) {
  return Cookies.get(key)
}
export function setCookies (key, value) {
  return Cookies.set(key, value)
}
export function removeCookies (key) {
  return Cookies.remove(key)
}
