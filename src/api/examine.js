import request from '@/utils/request'

const api = {
  // realy name
  realynamelist: '/cmsapi/realyname_list',
  // realynameadd: '/cmsapi/addrealyname',
  realynameedit: '/cmsapi/editrealyname',
  editRealyNameV2: '/cmsapi/editrealyname_v2',
  // realynamedel: '/cmsapi/removerealyname',
  // coin out name
  coinoutlist: '/cmsapi/coinout_list',
  coinoutedit: '/cmsapi/editcoinout',
  // fiat coin
  fiatcoinlist: '/cmsapi/fiat_orderlist',
  fiatcoinedit: 'cmsapi/fiat_shenhe'
}

export default api
// realy name
export function getRealyNameList(parameter) {
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
    url: api.realynamelist + params,
    method: 'get'
    // data: parameter
  })
}
export function editRealyName(parameter) {
  const params = `param=${JSON.stringify(parameter)}`
  return request({
    url: api.realynameedit,
    method: 'post',
    data: params
  })
}
export function editRealyNameV2(data) {
  return request({
    url: api.editRealyNameV2,
    method: 'post',
    data
  })
}
// coin out
export function getCoinOutList(parameter) {
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
    url: api.coinoutlist + params,
    method: 'get'
    // data: parameter
  })
}
export function editCoinOut(parameter) {
  const params = `param=${JSON.stringify(parameter)}`
  return request({
    url: api.coinoutedit,
    method: 'post',
    data: params
  })
}
// fiat coin
export function getFiatCoinList(parameter) {
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
    url: api.fiatcoinlist + params,
    method: 'get'
    // data: parameter
  })
}
export function editFiatCoin(parameter) {
  const params = `param=${JSON.stringify(parameter)}`
  return request({
    url: api.fiatcoinedit,
    method: 'post',
    data: params
  })
}

// // tradentrust api
// export function getTradEntrustList (parameter) {
//   let { page, pageSize } = parameter
//   const { key } = parameter
//   if (!page) { page = 1 }
//   if (!pageSize) { pageSize = 10 }
//   const params = `?page=${page}&limit=${pageSize}${key ? '&key=' + key : ''}`
//   return request({
//     url: api.tradentrustlist + params,
//     method: 'get'
//     // data: parameter
//   })
// }
// export function directTrad (parameter) {
//
//   const params = `param=${JSON.stringify(parameter)}`
//   return request({
//     url: api.directtrad,
//     method: 'post',
//     data: params
//   })
// }
// export function cancelEntrust (parameter) {
//
//   const params = `param=${JSON.stringify(parameter)}`
//   return request({
//     url: api.cancelentrust,
//     method: 'post',
//     data: params
//   })
// }
// // tradorder
// export function getTradOrderList (parameter) {
//   let { page, pageSize } = parameter
//   const { key } = parameter
//   if (!page) { page = 1 }
//   if (!pageSize) { pageSize = 10 }
//   const params = `?page=${page}&limit=${pageSize}${key ? '&key=' + key : ''}`
//   return request({
//     url: api.tradorderlist + params,
//     method: 'get'
//     // data: parameter
//   })
// }
