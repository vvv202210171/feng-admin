import request from '@/utils/request'

const api = {
  // realy name
  realynamelist: '/cmsapi/realyname_list',
  // realynameadd: '/cmsapi/addrealyname',
  realynameedit: '/cmsapi/editrealyname',
  editRealyNameV2: '/cmsapi/editrealyname_v2',
  recharge:"cmsapi/recharge_audit_list",
  rechageAudit:"cmsapi/recharge_audit"

}

export default api
// realy name
export function getRealyNameList(parameter) {
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
    url: api.realynamelist + params,
    method: 'get'
    // data: parameter
  })
}
export function editRealyName(parameter) {
  const params = `param=${JSON.stringify(parameter)}`
  return request({
    url: api.realynameedit,
    method: 'post',
    data: params
  })
}
export function editRealyNameV2(data) {
  return request({
    url: api.editRealyNameV2,
    method: 'post',
    data
  })
}

export function rechargAuditList(params){
  return request({
    url: api.recharge,
    method: 'get',
    params
  })
}


export function rechageAudit(data){
  return request({
    url: api.rechageAudit,
    method: 'post',
    data
  })
}
