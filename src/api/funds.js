import request from '@/utils/request'

const api = {
  // DymicFunds
  DymicFundslist: '/cmsapi/dymicFunds/page',
  DymicFundsadd: '/cmsapi/dymicFunds/add',
  DymicFundsedit: '/cmsapi/dymicFunds/update',
  DymicFundsdel: '/cmsapi/dymicFunds/del',
  getHelpDymicList: '/cmsapi/dymicFunds/help_page',
  helpExam: '/cmsapi/dymicFunds/helpExam',
  orderStatus: '/cmsapi/dymicFunds/orderStatus',
  getOrderDymicList: '/cmsapi/dymicFunds/order_page',
  getDymicInComeList: '/cmsapi/dymicFunds/income_page',
  StaticFundslist: '/cmsapi/staticFunds/page',
  StaticFundsadd: '/cmsapi/staticFunds/add',
  StaticFundsedit: '/cmsapi/staticFunds/update',
  StaticFundsdel: '/cmsapi/staticFunds/del',
  staticHelpExam: '/cmsapi/staticFunds/helpExam',
  getHelpStaticList: '/cmsapi/staticFunds/help_page',
  getOrderStaticList: '/cmsapi/staticFunds/order_page',
  getStaticInComeList: '/cmsapi/staticFunds/income_page',
  getVipFundsList: '/cmsapi/vipFunds/page',
  delVipFunds: '/cmsapi/vipFunds/del',
  addVipFunds: '/cmsapi/vipFunds/add',
  editVipFunds: '/cmsapi/vipFunds/update',
  getOrderVipFundsList: '/cmsapi/vipFunds/order_page',
  getVipFundsIncomeList: '/cmsapi/vipFunds/income_page'
}

export default api
export function getDymicInComeList(params) {
  return request({
    url: api.getDymicInComeList,
    method: 'get',
    params
  })
}

export function orderStatus() {
  return request({
    url: api.orderStatus,
    method: 'get'
  })
}
export function getOrderDymicList(params) {
  return request({
    url: api.getOrderDymicList,
    method: 'get',
    params
  })
}
export function helpExam(data) {
  return request({
    url: api.helpExam,
    method: 'post',
    data: data
  })
}
export function getHelpDymicList(params) {
  return request({
    url: api.getHelpDymicList,
    method: 'get',
    params
  })
}

export function getDymicFundsList(params) {
  return request({
    url: api.DymicFundslist,
    method: 'get',
    params
  })
}
export function delDymicFunds(params) {
  return request({
    url: api.DymicFundsdel,
    method: 'get',
    params
  })
}
export function editDymicFunds(data) {
  return request({
    url: api.DymicFundsedit,
    method: 'post',
    data: data
  })
}
export function addDymicFunds(data) {
  return request({
    url: api.DymicFundsadd,
    method: 'post',
    data
  })
}

export function getStaticFundsList(params) {
  return request({
    url: api.StaticFundslist,
    method: 'get',
    params
  })
}
export function delStaticFunds(params) {
  return request({
    url: api.StaticFundsdel,
    method: 'get',
    params
  })
}
export function editStaticFunds(data) {
  return request({
    url: api.StaticFundsedit,
    method: 'post',
    data: data
  })
}
export function addStaticFunds(data) {
  return request({
    url: api.StaticFundsadd,
    method: 'post',
    data
  })
}

export function staticHelpExam(data) {
  return request({
    url: api.staticHelpExam,
    method: 'post',
    data: data
  })
}
export function getHelpStaticList(params) {
  return request({
    url: api.getHelpStaticList,
    method: 'get',
    params
  })
}
export function getOrderStaticList(params) {
  return request({
    url: api.getOrderStaticList,
    method: 'get',
    params
  })
}
export function getStaticInComeList(params) {
  return request({
    url: api.getStaticInComeList,
    method: 'get',
    params
  })
}

export function getVipFundsList(params) {
  return request({
    url: api.getVipFundsList,
    method: 'get',
    params
  })
}
export function delVipFunds(params) {
  return request({
    url: api.delVipFunds,
    method: 'get',
    params
  })
}
export function editVipFunds(data) {
  return request({
    url: api.editVipFunds,
    method: 'post',
    data: data
  })
}
export function addVipFunds(data) {
  return request({
    url: api.addVipFunds,
    method: 'post',
    data
  })
}
export function getOrderVipFundsList(params) {
  return request({
    url: api.getOrderVipFundsList,
    method: 'get',
    params
  })
}

export function getVipFundsIncomeList(params) {
  return request({
    url: api.getVipFundsIncomeList,
    method: 'get',
    params
  })
}
