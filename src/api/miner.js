import request from '@/utils/request'

const api = {
  // miner
  minerlist: '/min_cmsapi/miner_list',
  mineradd: '/min_cmsapi/addminer',
  mineredit: '/min_cmsapi/editminer',
   minerdel: '/min_cmsapi/removeminer',
  // miner order
  minerorderlist: '/min_cmsapi/minerorder_list',
  // miner income
  minerincomelist: '/min_cmsapi/minerincome_list'
}

export default api
// miner
export function getMinerList(parameter) {
  let { page, pageSize } = parameter
  const { key, state } = parameter
  if (!page) {
    page = 1
  }
  if (!pageSize) {
    pageSize = 10
  }
  const params = `?page=${page}&limit=${pageSize}${key ? '&key=' + key : ''}&state=${state}`
  return request({
    url: api.minerlist + params,
    method: 'get'
    // data: parameter
  })
}
export function editMiner(parameter) {
  const params = `param=${JSON.stringify(parameter)}`
  return request({
    url: api.mineredit,
    method: 'post',
    data: params
  })
}
export function addMiner(parameter) {
  const params = `param=${JSON.stringify(parameter)}`
  return request({
    url: api.mineradd,
    method: 'post',
    data: params
  })
}
export function delMiner (parameter) {

  const params = `param=${JSON.stringify(parameter)}`
  return request({
    url: api.minerdel,
    method: 'post',
    data: params
  })
}
// miner order
export function getMinerOrderList(parameter) {
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
    url: api.minerorderlist + params,
    method: 'get'
    // data: parameter
  })
}
// miner income
export function getMinerInComeList(parameter) {
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
    url: api.minerincomelist + params,
    method: 'get'
    // data: parameter
  })
}
