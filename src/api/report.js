export default api
import request from '@/utils/request'

const api = {
  // miner
  getAsstesStatic: 'cmsapi/report/coinassets',
  getTradStatic: 'cmsapi/report/statistics_trad',
  getContractStatic: 'cmsapi/report/statistics_contract',
  getCycleStatic: 'cmsapi/report/statistics_cycle'
}

export function getAsstesStatic() {
  return request({
    url: api.getAsstesStatic,
    method: 'get'
  })
}
export function getTradStatic(params) {
  return request({
    url: api.getTradStatic,
    method: 'get',
    params
  })
}
export function getContractStatic(params) {
  return request({
    url: api.getContractStatic,
    method: 'get',
    params
  })
}
export function getCycleStatic(params) {
  return request({
    url: api.getCycleStatic,
    method: 'get',
    params
  })
}
