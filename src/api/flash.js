import request from '@/utils/request'

const api = {
  // log
  flashOrder: '/cmsapi/flash/order',
  getFlashCoinList: '/cmsapi/flash/coin',
  delFlashCoin: '/cmsapi/flash/remove',
  addFlashCoin: '/cmsapi/flash/coinadd',
  editFlashCoin: '/cmsapi/flash/coinedit'
}

export default api
// log
export function flashOrder(params) {
  return request({
    url: api.flashOrder,
    method: 'get',
    params
  })
}

export function getFlashCoinList(params) {
  return request({
    url: api.getFlashCoinList,
    method: 'get',
    params
  })
}

export function delFlashCoin(params) {
  return request({
    url: api.delFlashCoin,
    method: 'get',
    params
  })
}
export function addFlashCoin(data) {
  return request({
    url: api.addFlashCoin,
    method: 'post',
    data
  })
}
export function editFlashCoin(data) {
  return request({
    url: api.editFlashCoin,
    method: 'post',
    data
  })
}
