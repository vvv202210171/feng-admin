import request from '@/utils/request'

const api = {
  // log
  getFiatCurrencyList: '/cmsapi/fiat/currency',
  delFiatCurrency: '/cmsapi/fiat/currency/del',
  addFiatCurrency: '/cmsapi/fiat/currency/add',
  editFiatCurrency: '/cmsapi/fiat/currency/edit',
  getFiatEnableCurrencyList: '/cmsapi/fiat/currency/enablelist',
  getFiatPaymentMethodList: '/cmsapi/fiat/payment',
  delFiatPaymentMethod: '/cmsapi/fiat/payment/del',
  addFiatPaymentMethod: '/cmsapi/fiat/payment/add',
  editFiatPaymentMethod: '/cmsapi/fiat/payment/edit'
}

export default api

export function getFiatCurrencyList(params) {
  return request({
    url: api.getFiatCurrencyList,
    method: 'get',
    params
  })
}

export function getFiatEnableCurrencyList() {
  return request({
    url: api.getFiatEnableCurrencyList,
    method: 'get'
  })
}
export function delFiatCurrency(params) {
  return request({
    url: api.delFiatCurrency,
    method: 'get',
    params
  })
}
export function addFiatCurrency(data) {
  return request({
    url: api.addFiatCurrency,
    method: 'post',
    data
  })
}
export function editFiatCurrency(data) {
  return request({
    url: api.editFiatCurrency,
    method: 'post',
    data
  })
}

export function getFiatPaymentMethodList(params) {
  return request({
    url: api.getFiatPaymentMethodList,
    method: 'get',
    params
  })
}

export function delFiatPaymentMethod(params) {
  return request({
    url: api.delFiatPaymentMethod,
    method: 'get',
    params
  })
}
export function addFiatPaymentMethod(data) {
  return request({
    url: api.addFiatPaymentMethod,
    method: 'post',
    data
  })
}
export function editFiatPaymentMethod(data) {
  return request({
    url: api.editFiatPaymentMethod,
    method: 'post',
    data
  })
}
