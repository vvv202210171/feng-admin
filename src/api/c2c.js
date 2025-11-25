import request from '@/utils/request'

const api = {
  // c2c coin
  c2cCoinList: '/cmsapi/c2c_coin_list',
  c2cCoinadd: '/cmsapi/c2c_add_coin',
  c2cCoinedit: '/cmsapi/c2c_edit_coin',
  c2cCoindel: '/cmsapi/c2c_remove_coin',
  getC2cAccountList: '/cmsapi/c2c_account_list',
  getC2cMerchantList: '/cmsapi/c2c_merchant_list',
  c2cAuditMerchant: '/cmsapi/c2c_merchant_audit'
}
// 获取商户列表
export function auditMerchant(data) {
  return request({
    url: api.c2cAuditMerchant,
    method: 'post',
    data
  })
}

export function getC2cMerchantList(params) {
  params.page = params.page ? params.page : 1
  params.limit = params.limit ? params.limit : 10
  return request({
    url: api.getC2cMerchantList,
    method: 'get',
    params
  })
}

// c2c coin
export function getC2cCoinList(parameter) {
  let { page, pageSize } = parameter
  const { key } = parameter
  if (!page) {
    page = 1
  }
  if (!pageSize) {
    pageSize = 10
  }
  const params = `?page=${page}&limit=${pageSize}${key ? '&key=' + key : ''}`
  return request({
    url: api.c2cCoinList + params,
    method: 'get'
    // data: parameter
  })
}
export function editC2cCoin(data) {
  return request({
    url: api.c2cCoinedit,
    method: 'post',
    data
  })
}
export function addC2cCoin(data) {
  return request({
    url: api.c2cCoinadd,
    method: 'post',
    data
  })
}
export function delC2cCoin(params) {
  return request({
    url: api.c2cCoindel,
    method: 'get',
    params
  })
}
// contractaccount api
export function getC2cAccountList(parameter) {
  let { page, pageSize } = parameter
  const { key, parentVal } = parameter
  if (!page) {
    page = 1
  }
  if (!pageSize) {
    pageSize = 10
  }
  const params = `?page=${page}&limit=${pageSize}${key ? '&key=' + key : ''}${
    parentVal ? '&parentVal=' + parentVal : ''
  }`
  return request({
    url: api.getC2cAccountList + params,
    method: 'get'
    // data: parameter
  })
}
