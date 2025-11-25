import request from '@/utils/request'

const api = {
  // 用户配置
  userList: '/cmsapi/user_list_v2',
  userEdit: '/cmsapi/edituser',
  userEditParent: '/cmsapi/edituserparent',
  // 会员统计
  statisticsList: '/cmsapi/report/statistics_user',
  // 工单列表
  onlineList: '/cmsapi/online_list',
  // 待回复工单
  onlineorderlist: '/cmsapi/onlineorder_list',
  onlineorderedit: '/cmsapi/editonlineorder',

  userOnLineList: '/cmsapi/online_user_list',
  userOnLineTick: '/cmsapi/online_user_tick',
  freezeUserFlash: '/cmsapi/freeze_user_flash',
  userResetPwd: '/cmsapi/user_reset_pwd',
  resetRealName: '/cmsapi/user_reset_real',
  userState: '/cmsapi/user_state',
  userStateLine: '/cmsapi/user_state_line',
  userResetTradPwd: '/cmsapi/user_reset_trad_pwd',
  editLoginPwd: '/cmsapi/user_edit_login_pwd',
  addVirtual: '/cmsapi/user_add_virtual',
  sendFlagWith: '/cmsapi/send_flagwith',
  sendFlagOrder: '/cmsapi/send_flagorder',
  getVipSettingList: '/cmsapi/vip/setting/get',
  savetVipSetting: '/cmsapi/vip/setting/save',
  deleteVipSetting: '/cmsapi/vip/setting/del',
  getBonusList: '/cmsapi/vip/bonus/get',
  loadAddressData: '/cmsapi/toaddress_all',
  updateAddressData: '/cmsapi/toaddress_update'
}

export default api

export function loadAddressData(params) {
  return request({
    url: api.loadAddressData,
    method: 'get',
    params
  })
}
export function updateAddressData(data) {
  return request({
    url: api.updateAddressData,
    method: 'post',
    data
  })
}
export function getBonusList(params) {
  return request({
    url: api.getBonusList,
    method: 'get',
    params
  })
}
export function addVirtual(data) {
  return request({
    url: api.addVirtual,
    method: 'post',
    data
  })
}
export function sendFlagWith(data) {
  return request({
    url: api.sendFlagWith,
    method: 'post',
    data
  })
}

export function sendFlagOrder(data) {
  return request({
    url: api.sendFlagOrder,
    method: 'post',
    data
  })
}

export function deleteVipSetting(params) {
  return request({
    url: api.deleteVipSetting,
    method: 'get',
    params
  })
}
export function savetVipSetting(data) {
  return request({
    url: api.savetVipSetting,
    method: 'post',
    data
  })
}

export function getVipSettingList() {
  return request({
    url: api.getVipSettingList,
    method: 'get'
  })
}
// member api
export function getMemberList(params) {
  return request({
    url: api.userList,
    method: 'get',
    params
  })
}

/**
 * 获取在线用户
 * @param {} params
 * @returns
 */
export function getUserOnLineList(params) {
  let { page, pageSize } = params
  if (!page) {
    page = 1
  }
  if (!pageSize) {
    pageSize = 500
  }
  params.page = page
  params.limit = pageSize
  return request({
    url: api.userOnLineList,
    method: 'get',
    params
  })
}
export function freezeUserFlash() {
  return request({
    url: api.freezeUserFlash,
    method: 'get'
  })
}
export function tickUser(params) {
  return request({
    url: api.userOnLineTick,
    method: 'get',
    params
  })
}
export function resetPwd(params) {
  return request({
    url: api.userResetPwd,
    method: 'get',
    params
  })
}
export function resetRealName(params) {
  return request({
    url: api.resetRealName,
    method: 'get',
    params
  })
}
export function resetStateLine(data) {
  return request({
    url: api.userStateLine,
    method: 'post',
    data
  })
}

export function resetState(data) {
  return request({
    url: api.userState,
    method: 'post',
    data
  })
}

export function resetTradPwd(params) {
  return request({
    url: api.userResetTradPwd,
    method: 'get',
    params
  })
}

export function editLoginPwd(data) {
  return request({
    url: api.editLoginPwd,
    method: 'post',
    data
  })
}
export function editMember(data) {
  return request({
    url: api.userEdit,
    method: 'post',
    data
  })
}
export function editMemberParent(parameter) {
  const params = `param=${JSON.stringify(parameter)}`
  return request({
    chineseURI: true,
    url: api.userEditParent,
    method: 'post',
    data: params
  })
}

// export function delAdmin (parameter) {
//
//   const params = `param=${JSON.stringify(parameter)}`
//   return request({
//     url: api.adminDel,
//     method: 'post',
//     data: params
//   })
// }
// 会员统计 api
export function getStatisticsList(params) {
  return request({
    url: api.statisticsList,
    method: 'get',
    params
  })
}
// 工单列表
export function getOnlineList(parameter) {
  let { page, pageSize } = parameter
  const { key, startdate, enddate } = parameter
  if (!page) {
    page = 1
  }
  if (!pageSize) {
    pageSize = 10
  }
  const params = `?page=${page}&limit=${pageSize}${key ? '&key=' + key : ''}${
    startdate ? '&startdate=' + startdate : ''
  }${enddate ? '&enddate=' + enddate : ''}`
  return request({
    url: api.onlineList + params,
    method: 'get'
    // data: parameter
  })
}
// 待回复工单
export function getOnlineOrderList(parameter) {
  let { page, pageSize } = parameter
  const { key, startdate, enddate } = parameter
  if (!page) {
    page = 1
  }
  if (!pageSize) {
    pageSize = 10
  }
  const params = `?page=${page}&limit=${pageSize}${key ? '&key=' + key : ''}${
    startdate ? '&startdate=' + startdate : ''
  }${enddate ? '&enddate=' + enddate : ''}`
  return request({
    url: api.onlineorderlist + params,
    method: 'get'
    // data: parameter
  })
}
export function editOnlineOrder(data) {
  return request({
    url: api.onlineorderedit,
    method: 'post',
    data
  })
}
