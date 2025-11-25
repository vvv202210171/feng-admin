import request from '@/utils/request'

const api = {
  // log
  getGiftRecord: '/cmsapi/daily/gift',
  getDailyFee: '/cmsapi/daily/daily_fee',
  getFeeReturnRecord: '/cmsapi/daily/fee_record',

}

export default api
// log
export function getGiftRecord(params) {
  return request({
    url: api.getGiftRecord,
    method: 'get',
    params
  })
}
export function getDailyFee(params) {
  return request({
    url: api.getDailyFee,
    method: 'get',
    params
  })
}

export function getFeeReturnRecord(params) {
      return request({
    url: api.getFeeReturnRecord,
    method: 'get',
    params
  })
}