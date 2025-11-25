import request from '@/utils/request'

const userApi = {
  // Login: '/auth/login',
  Login: '/cmsapi/login_v2',
  GetIp: '/cmsapi/getip',
  checkIp: '/cmsapi/checkip',

  Logout: '/cmsapi/logout',
  // del
  // ForgePassword: '/auth/forge-password',
  // Register: '/auth/register',
  twoStepCode: '/auth/2step-code',
  // SendSms: '/account/sms',
  // SendSmsErr: '/account/sms_err',
  // // get my info
  UserInfo: '/user/info',
  title: '/cmsapi/title',
  langs: '/cmsapi/langs',
  enums: '/cmsapi/enums'
  // UserMenu: '/user/nav'
}

/**
 * login func
 * parameter: {
 *     username: '',
 *     password: '',
 *     remember_me: true,
 *     captcha: '12345'
 * }
 * @param parameter
 * @returns {*}
 */
export function getip() {
  return request({
    url: userApi.GetIp,
    method: 'post'
  })
}
export function getTitle() {
  return request({
    url: userApi.title,
    method: 'get'
  })
}
export function getLangs() {
  return request({
    url: userApi.langs,
    method: 'get'
  })
}
export function getEnums() {
  return request({
    url: userApi.enums,
    method: 'get'
  })
}
export function checkIp() {
  return request({
    url: userApi.checkIp,
    method: 'get'
  })
}
export function login(parameter) {
  // form data
  // const formData = new FormData()
  // Object.keys(parameter).forEach(e => {
  //   formData.append(e, parameter[e])
  // })
  const params = `param=${JSON.stringify(parameter)}`
  return request({
    url: userApi.Login,
    method: 'post',
    data: params
    // body: formData
  })
}

export function getSmsCaptcha(parameter) {
  return request({
    url: userApi.SendSms,
    method: 'post',
    data: parameter
  })
}

export function getInfo() {
  return request({
    url: userApi.UserInfo,
    method: 'get',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function getCurrentUserNav() {
  return request({
    url: userApi.UserMenu,
    method: 'get'
  })
}

export function logout() {
  return request({
    url: userApi.Logout,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * get user 2step code open?
 * @param parameter {*}
 */
export function get2step(parameter) {
  return request({
    url: userApi.twoStepCode,
    method: 'post',
    data: parameter
  })
}
