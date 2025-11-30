import request from '@/utils/request'

export function payIn(params) {
  return request({
    url: "cmsapi/payway/in",
    method: 'get',
    params
  })
}
export function payOut(params) {
  return request({
    url: "cmsapi/payway/out",
    method: 'get',
    params
  })
}
export function editPay(data) {
  return request({
    url: "cmsapi/payway/in_edit",
    method: 'post',
    data
  })
}
export function editPayOut(data) {
  return request({
    url: "cmsapi/payway/out_edit",
    method: 'post',
    data
  })
}
export function loadBankData() {
  return request({
    url: "cmsapi/payway/bank_receipt",
      method: 'get',
  })
}

export function updateBankData(data) {
  return request({
    url: "cmsapi/payway/bank_receipt_save",
    method: 'post',
    data
  })
}