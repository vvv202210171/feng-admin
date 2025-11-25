import request from '@/utils/request'

const api = {
  user: '/user',
  role: '/role',
  service: '/service',
  permission: '/permission',
  permissionNoPager: '/permission/no-pager',
  orgTree: '/org/tree',
  // 后台接口
  getMenu: '/cmsapi/getmenu',
  getMenu2: '/cmsapi/getmenu2',
  // newsList: '/webcms/json/newsList.json',
  getWithdrawalAndDeposit: '/cmsapi/statistics/deposit_withdrawal',
  getStatistics: '/cmsapi/statistics',
  getCpuInfo: '/cmsapi/getcpu_info',
  warningTrad: '/cmsapi/warning_trad',
  warningRobot: '/cmsapi/warning_robot',

  uploadImg: '/cmsapi/upload'
}

export default api
export function getUserList(parameter) {
  return request({
    url: api.user,
    method: 'get',
    params: parameter
  })
}

export function getRoleList(parameter) {
  return request({
    url: api.role,
    method: 'get',
    params: parameter
  })
}

export function getServiceList(parameter) {
  return request({
    url: api.service,
    method: 'get',
    params: parameter
  })
}

export function getPermissions(parameter) {
  return request({
    url: api.permissionNoPager,
    method: 'get',
    params: parameter
  })
}

export function getOrgTree(parameter) {
  return request({
    url: api.orgTree,
    method: 'get',
    params: parameter
  })
}

export function getWithdrawalAndDeposit(parameter) {
  return request({
    url: api.getWithdrawalAndDeposit,
    method: 'get',
    params: parameter
  })
}
// id == 0 add     post
// id != 0 update  put
export function saveService(parameter) {
  return request({
    url: api.service,
    method: parameter.id === 0 ? 'post' : 'put',
    data: parameter
  })
}

export function saveSub(sub) {
  return request({
    url: '/sub',
    method: sub.id === 0 ? 'post' : 'put',
    data: sub
  })
}

// // 配置接口
// export function getConfigList (parameter) {
//   return request({
//     url: api.configList,
//     method: 'get',
//     data: parameter
//   })
// }

// 后台路由
export function getMenus(parameter) {
  const params = `param=${JSON.stringify(parameter)}`
  return request({
    url: api.getMenu,
    method: 'post',
    data: params
  })
}
export function getMenus2(parameter) {
  const params = `param=${JSON.stringify(parameter)}`
  return request({
    url: api.getMenu2,
    method: 'post',
    data: params
  })
}
// statics
export function getStatistics() {
  return request({
    url: api.getStatistics,
    method: 'post'
  })
}
// cpu info
export function getCpuInfo() {
  return request({
    url: api.getCpuInfo,
    method: 'post'
  })
}
// warning trad
export function warningTrad() {
  return request({
    url: api.warningTrad,
    method: 'post'
  })
}
// warning robot
export function warningRobot() {
  return request({
    url: api.warningRobot,
    method: 'post'
  })
}
// uploading iamge
export function uploadingImg(formData) {
  return request({
    url: api.uploadImg,
    method: 'post',
    multipart: true,
    data: formData
  })
}
