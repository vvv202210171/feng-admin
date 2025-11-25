import request from '@/utils/request'

const api = {
  // usaccount
  usaccountlist: '/cmsapi/usaccount_list',
  usaccountadd: '/cmsapi/addusaccount',
  // address
  addresslist: '/cmsapi/address_lists',
  addressadd: '/cmsapi/addbloack',
  addressdel: '/cmsapi/removeSyAddress',
  getmaincoins: '/cmsapi/getmainCions',
  // toaddress
  toaddresslist: '/cmsapi/toaddress_list',
  // usprofitin
  usprofitinlist: '/cmsapi/usprofit_list_coinin',
  // usprofitout
  usprofitoutlist: '/cmsapi/usprofit_list_coinout',
  // usprofittransfer
  usprofittransferlist: '/cmsapi/usprofit_list_transfer',
  // usprofitsystem
  usprofitsystemlist: '/cmsapi/usprofit_list_system',
  // usprofit
  usprofitlist: '/cmsapi/usprofit_list',
  // tradgas
  tradgaslist: '/cmsapi/report/statistics_gas',
  // coinin
  coininlist: '/cmsapi/report/statistics_in',
  // coinout
  coinoutlist: '/cmsapi/report/statistics_out',
  // useraccount
  useraccountlist: '/cmsapi/report/statistics_account',
  // bankcardinfo
  bankcardinfo: '/cmsapi/bankcardinfo',
  updateBankState: '/cmsapi/updatebankstate',
  updateBankById: '/cmsapi/updatebankbyid',
  udunAddress: '/cmsapi/address_list_udun',
  udunCoin: '/cmsapi/coin_udun',
  reloadUdunCoin: '/cmsapi/coin_udun_reload',
  getMemberAssets: '/cmsapi/getassets',
}

export default api

export function updateBankState(data) {
  return request({
    url: api.updateBankState,
    method: 'post',
    data
  })
}
export function updateBankById(data) {
  return request({
    url: api.updateBankById,
    method: 'post',
    data
  })
}

export function getBankCardInfo(parameter) {
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
    url: api.bankcardinfo + params,
    method: 'get'
    // data: parameter
  })
}

export function getMemberAssets(params) {
    return request({
    url: api.getMemberAssets ,
    method: 'get',
   params
  })
}
// usaccount
export function getUsaccountList(parameter) {
  let { page, pageSize } = parameter
  const { key, value } = parameter
  if (!page) {
    page = 1
  }
  if (!pageSize) {
    pageSize = 20
  }
  const params = `?page=${page}&limit=${pageSize}${key ? '&key=' + key : ''}${value ? '&parentVal=' + value : ''}`
  return request({
    url: api.usaccountlist + params,
    method: 'get'
    // data: parameter
  })
}
export function addUsaccount(parameter) {
  const params = `param=${JSON.stringify(parameter)}`
  return request({
    chineseURI: true,
    url: api.usaccountadd,
    method: 'post',
    data: params
  })
}

// address
export function getAddressList(parameter) {
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
    url: api.addresslist + params,
    method: 'get'
    // data: parameter
  })
}
// export function editAddress (parameter) {
//
//   const params = `param=${JSON.stringify(parameter)}`
//   return request({
//     url: api.tradedit,
//     method: 'post',
//     data: params
//   })
// }
export function addAddress(data) {
  return request({
    url: api.addressadd,
    method: 'post',
    data
  })
}
export function delAddress(parameter) {
  const params = `param=${JSON.stringify(parameter)}`
  return request({
    url: api.addressdel,
    method: 'post',
    data: params
  })
}
export function getMainCoins(parameter) {
  const params = `param=${JSON.stringify(parameter)}`
  return request({
    url: api.getmaincoins,
    method: 'get',
    data: params
  })
}

// toaddresslist
export function getToaddressList(parameter) {
  let { page, pageSize } = parameter
  const { key, parentVal, startdate, enddate } = parameter
  if (!page) {
    page = 1
  }
  if (!pageSize) {
    pageSize = 10
  }
  const params = `?page=${page}&limit=${pageSize}${key ? '&key=' + key : ''}${
    parentVal ? '&parentVal=' + parentVal : ''
  }${startdate ? '&startdate=' + startdate : ''}${enddate ? '&enddate=' + enddate : ''}`
  return request({
    url: api.toaddresslist + params,
    method: 'get'
    // data: parameter
  })
}
export function getUdunAddressList(parameter) {
  let { page, pageSize } = parameter
  const { key, parentVal, startdate, enddate } = parameter
  if (!page) {
    page = 1
  }
  if (!pageSize) {
    pageSize = 10
  }
  const params = `?page=${page}&limit=${pageSize}${key ? '&key=' + key : ''}${
    parentVal ? '&parentVal=' + parentVal : ''
  }${startdate ? '&startdate=' + startdate : ''}${enddate ? '&enddate=' + enddate : ''}`
  return request({
    url: api.udunAddress + params,
    method: 'get'
    // data: parameter
  })
}

export function getUdunCoinList(parameter) {
  let { page, pageSize } = parameter
  const { key, parentVal, startdate, enddate } = parameter
  if (!page) {
    page = 1
  }
  if (!pageSize) {
    pageSize = 10
  }
  const params = `?page=${page}&limit=${pageSize}${key ? '&key=' + key : ''}${
    parentVal ? '&parentVal=' + parentVal : ''
  }${startdate ? '&startdate=' + startdate : ''}${enddate ? '&enddate=' + enddate : ''}`
  return request({
    url: api.udunCoin + params,
    method: 'get'
    // data: parameter
  })
}
export function reloadUdunCoin() {
  return request({
    url: api.reloadUdunCoin,
    method: 'get'
    // data: parameter
  })
}
// usprofitin
export function getUsprofitinList(parameter) {
  let { page, pageSize } = parameter
  const { key, parentVal, startdate, enddate } = parameter
  if (!page) {
    page = 1
  }
  if (!pageSize) {
    pageSize = 10
  }
  const params = `?page=${page}&limit=${pageSize}${key ? '&key=' + key : ''}${
    parentVal ? '&parentVal=' + parentVal : ''
  }${startdate ? '&startdate=' + startdate : ''}${enddate ? '&enddate=' + enddate : ''}`
  return request({
    url: api.usprofitinlist + params,
    method: 'get'
    // data: parameter
  })
}
// usprofitout
export function getUsprofitoutList(parameter) {
  let { page, pageSize } = parameter
  const { key, parentVal, state, startdate, enddate } = parameter
  if (!page) {
    page = 1
  }
  if (!pageSize) {
    pageSize = 10
  }
  const params = `?page=${page}&limit=${pageSize}${key ? '&key=' + key : ''}${
    parentVal ? '&parentVal=' + parentVal : ''
  }${state ? '&state=' + state : ''}${startdate ? '&startdate=' + startdate : ''}${
    enddate ? '&enddate=' + enddate : ''
  }`
  return request({
    url: api.usprofitoutlist + params,
    method: 'get'
    // data: parameter
  })
}
// usprofittransfer
export function getUsprofitTransferList(parameter) {
  let { page, pageSize } = parameter
  const { key, parentVal, startdate, enddate } = parameter
  if (!page) {
    page = 1
  }
  if (!pageSize) {
    pageSize = 10
  }
  const params = `?page=${page}&limit=${pageSize}${key ? '&key=' + key : ''}${
    parentVal ? '&parentVal=' + parentVal : ''
  }${startdate ? '&startdate=' + startdate : ''}${enddate ? '&enddate=' + enddate : ''}`
  return request({
    url: api.usprofittransferlist + params,
    method: 'get'
    // data: parameter
  })
}
// usprofitsystem
export function getUsprofitSystemList(parameter) {
  let { page, pageSize } = parameter
  const { key, parentVal, startdate, enddate } = parameter
  if (!page) {
    page = 1
  }
  if (!pageSize) {
    pageSize = 10
  }
  const params = `?page=${page}&limit=${pageSize}${key ? '&key=' + key : ''}${
    parentVal ? '&parentVal=' + parentVal : ''
  }${startdate ? '&startdate=' + startdate : ''}${enddate ? '&enddate=' + enddate : ''}`
  return request({
    url: api.usprofitsystemlist + params,
    method: 'get'
    // data: parameter
  })
}
// usprofit
export function getUsprofitList(parameter) {
  let { page, pageSize } = parameter
  const { key, parentVal, startdate, enddate } = parameter
  if (!page) {
    page = 1
  }
  if (!pageSize) {
    pageSize = 10
  }
  const params = `?page=${page}&limit=${pageSize}${key ? '&key=' + key : ''}${
    parentVal ? '&parentVal=' + parentVal : ''
  }${startdate ? '&startdate=' + startdate : ''}${enddate ? '&enddate=' + enddate : ''}`
  return request({
    url: api.usprofitlist + params,
    method: 'get'
    // data: parameter
  })
}
// tradgas
export function getTradgasList(parameter) {
  let { page, pageSize } = parameter
  const { type } = parameter
  const encodedParameter = encodeURIComponent(type)
  if (!page) {
    page = 1
  }
  if (!pageSize) {
    pageSize = 300
  }
  const params = `?page=${page}&limit=${pageSize}${type ? '&type=' : ''}${encodedParameter}`
  return request({
    url: api.tradgaslist + params,
    method: 'get'
    // data: parameter
  })
}
// coinin
export function getCoinInList(parameter) {
  let { page, pageSize } = parameter
  const { type } = parameter
  const encodedParameter = encodeURIComponent(type)
  if (!page) {
    page = 1
  }
  if (!pageSize) {
    pageSize = 200
  }
  const params = `?page=${page}&limit=${pageSize}${type ? '&type=' : ''}${encodedParameter}`
  return request({
    url: api.coininlist + params,
    method: 'get'
    // data: parameter
  })
}
// coinout
export function getCoinOutList(parameter) {
  let { page, pageSize } = parameter
  const { type } = parameter
  const encodedParameter = encodeURIComponent(type)
  if (!page) {
    page = 1
  }
  if (!pageSize) {
    pageSize = 200
  }
  const params = `?page=${page}&limit=${pageSize}${type ? '&type=' : ''}${encodedParameter}`
  return request({
    url: api.coinoutlist + params,
    method: 'get'
    // data: parameter
  })
}
// useraccount
export function getUserAccountList(parameter) {
  let { page, pageSize } = parameter
  const { type } = parameter
  const encodedParameter = encodeURIComponent(type)
  if (!page) {
    page = 1
  }
  if (!pageSize) {
    pageSize = 200
  }
  const params = `?page=${page}&limit=${pageSize}${type ? '&type=' : ''}${encodedParameter}`
  return request({
    url: api.useraccountlist + params,
    method: 'get'
    // data: parameter
  })
}
