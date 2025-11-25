import request from '@/utils/request'

const api = {
  // tradcoin
  tradcoinlist: '/cmsapi/tradcoin_list',
  tradadd: '/cmsapi/addtradcoin',
  tradedit: '/cmsapi/edittradcoin',
  traddel: '/cmsapi/removetradcoin',
  // tradentrust
  tradentrustlist: '/cmsapi/tradentrust_list',
  directtrad: '/cmsapi/directTrad',
  cancelentrust: '/cmsapi/cancelEntrust',
  // tradorder
  tradorderlist: '/cmsapi/tradorder_list'
}

export default api
// tradcoin
export function getTradCoinList(parameter) {
  let { page, pageSize } = parameter
  const { key } = parameter
  if (!page) {
    page = 1
  }
  if (!pageSize) {
    pageSize = 20
  }
  const params = `?page=${page}&limit=${pageSize}${key ? '&key=' + key : ''}`
  return request({
    url: api.tradcoinlist + params,
    method: 'get'
    // data: parameter
  })
}
export function editTradCoin(parameter) {
  return request({
    url: api.tradedit,
    method: 'post',
    data: parameter
  })
}
export function addTradCoin(parameter) {
  return request({
    url: api.tradadd,
    method: 'post',
    data: parameter
  })
}
export function delTradCoin(parameter) {
  return request({
    url: api.traddel,
    method: 'post',
    data: parameter
  })
}
// tradentrust api
export function getTradEntrustList(params) {
  return request({
    url: api.tradentrustlist,
    method: 'get',
    params
  })
}
export function directTrad(parameter) {
  const params = `params=${JSON.stringify(parameter)}`
  return request({
    url: api.directtrad,
    method: 'post',
    data: params
  })
}
export function cancelEntrust(parameter) {
  const params = `params=${JSON.stringify(parameter)}`
  return request({
    url: api.cancelentrust,
    method: 'post',
    data: params
  })
}
// tradorder
export function getTradOrderList(parameter) {
  return request({
    url: api.tradorderlist,
    method: 'get',
    params: parameter
  })
}
