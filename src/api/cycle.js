import request from '@/utils/request'

const api = {
  // cycle coin
  cyclecoinlist: '/cmsapi/cyclecoin_list_v2',
  cyclecoinadd: '/cmsapi/addcyclecoin_v2',
  cyclecoinedit: '/cmsapi/editcyclecoin_v2',
  cyclecoindel: '/cmsapi/removecyclecoin_v2',
  // cyclelever
  cycleleverlist: '/cmsapi/cyclelever_list',
  cycleleveradd: '/cmsapi/addcyclelever',
  cycleleveredit: '/cmsapi/editcyclelever',
  cycleleverdel: '/cmsapi/removecyclelever',
  // cycle pay coin
  cyclepaycoinlist: '/cmsapi/cyclepaycoin_list',
  cyclepaycoinadd: '/cmsapi/addcyclepaycoin',
  cyclepaycoinedit: '/cmsapi/editcyclepaycoin',
  cyclepaycoindel: '/cmsapi/removecyclepaycoin',
  // cycle order
  cycleorderlist: '/cmsapi/cycleorder_list',
  // cycleorderenable
  cycleorderenablelist: '/cmsapi/cycleorder_enable_list',
  cycleorderenableadd: '/cmsapi/addcycleprice',
  cycleorderenableedit: '/cmsapi/close_cycle_order',
  // cyclestatics
  cyclestaticslist: '/cmsapi/statistics_cycle'
}

export default api
// cycle coin
export function getCycleCoinList(parameter) {
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
    url: api.cyclecoinlist + params,
    method: 'get'
  })
}
export function editCycleCoin(data) {
  return request({
    url: api.cyclecoinedit,
    method: 'post',
    data
  })
}
export function addCycleCoin(data) {
  return request({
    url: api.cyclecoinadd,
    method: 'post',
    data
  })
}
export function delCycleCoin(params) {
  return request({
    url: api.cyclecoindel,
    method: 'get',
    params
  })
}
// cyclelever
export function getCycleLeverList(params) {
  return request({
    url: api.cycleleverlist,
    method: 'get',
    params
  })
}
export function editCycleLever(data) {
  return request({
    url: api.cycleleveredit,
    method: 'post',
    data
  })
}
export function addCycleLever(data) {
  return request({
    url: api.cycleleveradd,
    method: 'post',
    data
  })
}
export function delCycleLever(params) {
  return request({
    url: api.cycleleverdel,
    method: 'get',
    params
  })
}
// cycle pay coin
export function getCyclePayCoinList(parameter) {
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
    url: api.cyclepaycoinlist + params,
    method: 'get'
    // data: parameter
  })
}
export function editCyclePayCoin(parameter) {
  const params = `param=${JSON.stringify(parameter)}`
  return request({
    chineseURI: true,
    url: api.cyclepaycoinedit,
    method: 'post',
    data: params
  })
}
export function addCyclePayCoin(parameter) {
  const params = `param=${JSON.stringify(parameter)}`
  return request({
    chineseURI: true,
    url: api.cyclepaycoinadd,
    method: 'post',
    data: params
  })
}
export function delCyclePayCoin(parameter) {
  const params = `param=${JSON.stringify(parameter)}`
  return request({
    url: api.cyclepaycoindel,
    method: 'post',
    data: params
  })
}
// cycleorder
export function getCycleOrderList(params) {
  return request({
    url: api.cycleorderlist,
    method: 'get',
    params
  })
}
// cycleorderenable
export function getCycleOrderEnableList(parameter) {
  let { page, pageSize } = parameter
  const { key, parentVal, type, startdate, enddate } = parameter
  if (!page) {
    page = 1
  }
  if (!pageSize) {
    pageSize = 10
  }
  const params = `?page=${page}&limit=${pageSize}${key ? '&key=' + key : ''}${
    parentVal ? '&parentVal=' + parentVal : ''
  }${type ? '&type=' + type : ''}${startdate ? '&startdate=' + startdate : ''}${enddate ? '&enddate=' + enddate : ''}`
  return request({
    url: api.cycleorderenablelist + params,
    method: 'get'
    // data: parameter
  })
}
export function editCycleOrderEnable(parameter) {
  const params = `param=${JSON.stringify(parameter)}`
  return request({
    chineseURI: true,
    url: api.cycleorderenableedit,
    method: 'post',
    data: params
  })
}
export function addCycleOrderEnable(parameter) {
  const params = `param=${JSON.stringify(parameter)}`
  return request({
    chineseURI: true,
    url: api.cycleorderenableadd,
    method: 'post',
    data: params
  })
}

// cycle statics list
export function getCycleStaticsList(parameter) {
  let { page, pageSize } = parameter
  const { key, parentVal } = parameter
  if (!page) {
    page = 1
  }
  if (!pageSize) {
    pageSize = 200
  }
  const params = `?page=${page}&limit=${pageSize}${key ? '&key=' + key : ''}${
    parentVal ? '&parentVal=' + parentVal : ''
  }`
  return request({
    url: api.cyclestaticslist + params,
    method: 'get'
    // data: parameter
  })
}
