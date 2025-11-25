import request from '@/utils/request'

const api = {
  // log
  loglist: '/cmsapi/logsms_list',
  // log admin
  logadminloginlist: '/cmsapi/logadminlogin_list',
  logadminsettinglist: '/cmsapi/logadminsetting_list',
  // log user
  loguserloginlist: '/cmsapi/loguserlogin_list',
  logusersettinglist: '/cmsapi/logusersetting_list',
  logEx: '/cmsapi/log_ex',
  logAccountList: '/cmsapi/loguseraccount_list',
  logContractList: '/cmsapi/logcontractaccount_list',
  logNotify: '/cmsapi/lognotiify_list',
}

export default api
// log
export function getLogContractAccountList(params) {
  return request({
    url: api.logContractList,
    method: 'get',
    params
  })
}
export function getLogUserAccountList(params) {
  return request({
    url: api.logAccountList,
    method: 'get',
    params
  })
}
export function getLogList(params) {
  return request({
    url: api.loglist,
    method: 'get',
    params
  })
}

export function getLogAdminLogin(params) {
  return request({
    url: api.logadminloginlist,
    method: 'get',
    params
  })
}
export function getLogAdminSettingList(params) {
  return request({
    url: api.logadminsettinglist,
    method: 'get',
    params
  })
}
export function getLogUserLogin(params) {
  return request({
    url: api.loguserloginlist,
    method: 'get',
    params
  })
}
export function getLogUserSettingList(params) {
  return request({
    url: api.logusersettinglist,
    method: 'get',
    params
  })
}

export function getExLogList(params) {
  return request({
    url: api.logEx,
    method: 'get',
    params
  })
}

export function getNotifyLogList(params) {
  return request({
    url: api.logNotify,
    method: 'get',
    params
  })
}
