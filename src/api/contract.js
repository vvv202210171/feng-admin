import request from '@/utils/request'

const api = {
  // contract coin
  contractcoinlist: '/cmsapi/contractcoin_list',
  contractcoinadd: '/cmsapi/addcontractcoin',
  contractcoinedit: '/cmsapi/editcontractcoin',
  contractcoindel: '/cmsapi/removecontractcoin',
  // contractaccount
  contractaccountlist: '/cmsapi/contractaccount_list',
  // contractentrust
  contractentrustlist: '/cmsapi/contractentrust_list',
  // contractorder
  contractorderlist: '/cmsapi/contractorder_list',
  // contractlever
  contractleverlist: '/cmsapi/contractlever_list',
  contractleveradd: '/cmsapi/addcontractlever',
  contractleveredit: '/cmsapi/editcontractlever',
  contractleverdel: '/cmsapi/removecontractlever',
  // contractorderenable
  contractorderenablelist: '/cmsapi/contractorder_enable_list_v2',
  contractorderenableadd: '/cmsapi/addcontractprice',
  contractorderenableedit: '/cmsapi/close_contract_order',
  strayById: '/cmsapi/get_srategy',
  editStrategy: '/cmsapi/edit_strategy',
  getMainMarketList: '/cmsapi/contract_enable_list',
  // profitloss
  contractProfitLoss: '/cmsapi/contract_profit_loss',
  getStrategyKline: '/cmsapi/get_srategy_kline',
  getCustomerDataList: '/cmsapi/get_customer_dataList',
  delCustomData: '/cmsapi/del_customer_dataList',
  addCustomDataRule: '/cmsapi/coin_control',
  updateCustomerData: '/cmsapi/update_customer_data',
  getHistoryList: '/cmsapi/kline',
  batchUpdateCustomdata: '/cmsapi/batch_customdata'
}

export default api
export function addCustomDataRule(data) {
  return request({
    url: api.addCustomDataRule,
    method: 'post',
    data
    // data: parameter
  })
}
export function batchUpdate(data) {
  return request({
    url: api.batchUpdateCustomdata,
    method: 'post',
    data
    // data: parameter
  })
}
export function updateCustomerData(data) {
  return request({
    url: api.updateCustomerData,
    method: 'post',
    data
  })
}
export function getHistoryList(params) {
  return request({
    url: api.getHistoryList,
    method: 'get',
    params
  })
}
export function getCustomerDataList(params) {
  return request({
    url: api.getCustomerDataList,
    method: 'get',
    params
    // data: parameter
  })
}
export function delCustomData(data) {
  return request({
    url: api.delCustomData,
    method: 'post',
    data
    // data: parameter
  })
}
export function getStrategyKline(autoid, kdate) {
  return request({
    url: api.getStrategyKline + `?autoid=${autoid}&kdate=${kdate}`,
    method: 'get'
  })
}

// contract coin
export function getContractCoinList(parameter) {
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
    url: api.contractcoinlist + params,
    method: 'get'
    // data: parameter
  })
}
export function editContractCoin(data) {
  return request({
    url: api.contractcoinedit,
    method: 'post',
    data
  })
}
export function addContractCoin(data) {
  return request({
    url: api.contractcoinadd,
    method: 'post',
    data
  })
}
export function delContractCoin(params) {
  return request({
    url: api.contractcoindel,
    method: 'get',
    params
  })
}
// contractaccount api
export function getContractAccountList(parameter) {
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
    url: api.contractaccountlist + params,
    method: 'get'
    // data: parameter
  })
}
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
// contractentrust
export function getContractEntrustList(params) {
  let { page, pageSize } = params
  if (!page) {
    page = 1
  }
  if (!pageSize) {
    pageSize = 10
  }
  params.page = page
  params.limit = pageSize
  return request({
    url: api.contractentrustlist,
    method: 'get',
    params
  })
}
// contractorder
export function getContractOrderList(params) {
  return request({
    url: api.contractorderlist,
    method: 'get',
    params
  })
}
// contractlever
export function getContractLeverList(parameter) {
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
    url: api.contractleverlist + params,
    method: 'get'
    // data: parameter
  })
}
export function editContractLever(parameter) {
  const params = `param=${JSON.stringify(parameter)}`
  return request({
    chineseURI: true,
    url: api.contractleveredit,
    method: 'post',
    data: params
  })
}
export function addContractLever(parameter) {
  const params = `param=${JSON.stringify(parameter)}`
  return request({
    chineseURI: true,
    url: api.contractleveradd,
    method: 'post',
    data: params
  })
}
export function delContractLever(parameter) {
  const params = `param=${JSON.stringify(parameter)}`
  return request({
    url: api.contractleverdel,
    method: 'post',
    data: params
  })
}
// contractorderenable
export function getContractOrderEnableList(params) {
  let { page, pageSize } = params
  if (!page) {
    page = 1
  }
  if (!pageSize) {
    pageSize = 10
  }
  params.page = page
  params.limit = pageSize

  return request({
    url: api.contractorderenablelist,
    method: 'get',
    params
  })
}
export function editContractOrderEnable(parameter) {
  const params = `param=${JSON.stringify(parameter)}`
  return request({
    chineseURI: true,
    url: api.contractorderenableedit,
    method: 'post',
    data: params
  })
}
export function addContractOrderEnable(parameter) {
  const params = `param=${JSON.stringify(parameter)}`
  return request({
    chineseURI: true,
    url: api.contractorderenableadd,
    method: 'post',
    data: params
  })
}
export function getMainMarketList() {
  return request({
    url: api.getMainMarketList,
    method: 'get'
  })
}
export function getStray(params) {
  return request({
    url: api.strayById,
    method: 'get',
    params
  })
}
export function editStrategy(data) {
  return request({
    url: api.editStrategy,
    method: 'post',
    data
  })
}
// contractorder
export function getContractProfitLoss(params) {
  let { page, pageSize } = params
  if (!page) {
    page = 1
  }
  if (!pageSize) {
    pageSize = 10
  }
  params.page = page
  params.limit = pageSize
  return request({
    url: api.contractProfitLoss,
    method: 'get',
    params
  })
}
