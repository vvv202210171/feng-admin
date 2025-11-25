import request from '@/utils/request'

const api = {
  // act list
  actlist: '/cmsapi/act_list_v2',
  actadd: '/cmsapi/act/actadd',
  actedit: '/cmsapi/act/actedit',
  actdel: '/cmsapi/act/remove',
  // act order
  actorderlist: '/cmsapi/act_order_list_v2'
}

export default api
// act coin
export function getActList(params) {
  return request({
    url: api.actlist,
    method: 'get',
    params
  })
}
export function editAct(data) {
  // const { username, autoid } = parameter
  return request({
    url: api.actedit,
    method: 'post',
    data
  })
}
export function addAct(data) {
  // const { username, autoid } = parameter
  return request({
    url: api.actadd,
    method: 'post',
    data
  })
}
export function delAct(params) {
  // const { username, autoid } = parameter
  return request({
    url: api.actdel,
    method: 'get',
    params
  })
}
// act order
export function getActOrderList(parameter) {
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
    url: api.actorderlist + params,
    method: 'get'
  })
}
