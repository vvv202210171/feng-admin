import request from '@/utils/request'

const api = {
  // admin setting
  adminList: '/cmsapi/admin_list',
  adminDel: '/cmsapi/removeadmin',
  adminAdd: '/cmsapi/addadmin',
  adminEdit: '/cmsapi/editadmin',
  adminMenu: '/cmsapi/allmenu_list',
  adminNotmenu: '/cmsapi/notmenu_list',
  adminNotmenu2: '/cmsapi/notmenu2_list',
  editAdminPwd: '/cmsapi/editadminpwd',

  adminOnLineList: '/cmsapi/online_admin_list',
  adminOnLineTick: '/cmsapi/online_admin_tick',

  // 系统配置 // ?page=1&limit=20&key=
  configList: '/cmsapi/config_list_v2',
  configEdit: '/cmsapi/editconfig_v2', // 接口无法修改
  configAdd: '/cmsapi/addconfig_v2',
  // 版本配置
  versionList: '/cmsapi/version_list',
  versionEdit: '/cmsapi/editversion',
  // 币种管理
  currencyList: '/cmsapi/currency_list',
  getCurrenctTypeList: '/cmsapi/currency_type_list',
  currencyEdit: '/cmsapi/editcurrency',
  currencyDel: '/cmsapi/removecurrency',
  currencyAdd: '/cmsapi/addcurrency',
  // 充提管理
  coinList: '/cmsapi/coin_list',
  coinEdit: '/cmsapi/editcoin',
  coinDel: '/cmsapi/removecoin',
  coinAdd: '/cmsapi/addcoin',
  // 版本配置
  handselList: '/cmsapi/config_handsel_coin_list',
  handselEdit: '/cmsapi/editconfig_handsel_coin',
  // level
  userlevelList: '/cmsapi/config_user_lever_list',
  userlevelEdit: '/cmsapi/editconfig_user_lever',
  // google
  googleverifyList: '/cmsapi/google_venify_list',
  googleverifyBind: '/cmsapi/google_venify_bind',

  // whiteIp
  whiteIpList: 'cmsapi/white/list',
  whiteIpAdd: 'cmsapi/white/add',
  whiteIpUpdate: 'cmsapi/white/update',
  whiteIpDel: 'cmsapi/white/del',
  // blackIp
  blackIpList: 'cmsapi/black/list',
  blackIpAdd: 'cmsapi/black/batch_add',
  blackIpUpdate: 'cmsapi/black/update',
  blackIpDel: 'cmsapi/black/batch_del',
  selectLangIntro: 'cmsapi/get_coin_intro',
  saveLangIntro: 'cmsapi/saveLangIntro'
}

export default api
// system setting
// 管理员api

export function selectLangIntro(params) {
  return request({
    url: api.selectLangIntro,
    method: 'get',
    params
  })
}

export function saveLangIntro(data) {
  return request({
    url: api.saveLangIntro,
    method: 'post',
    data
  })
}
export function getAdminList(parameter) {
  let { page, pageSize } = parameter
  const { key } = parameter
  if (!page) {
    page = 1
  }
  if (!pageSize) {
    pageSize = 500
  }
  const params = `?page=${page}&limit=${pageSize}${key ? '&key=' + key : ''}`
  return request({
    url: api.adminList + params,
    method: 'get'
    // data: parameter
  })
}

export function delAdmin(parameter) {
  const params = `param=${JSON.stringify(parameter)}`
  return request({
    url: api.adminDel,
    method: 'post',
    data: params
  })
}
/**
 * 获取在线用户
 * @param {} params
 * @returns
 */
export function getAdminOnLineList(params) {
  let { page, pageSize } = params
  if (!page) {
    page = 1
  }
  if (!pageSize) {
    pageSize = 500
  }
  params.page = page
  params.limit = pageSize
  return request({
    url: api.adminOnLineList,
    method: 'get',
    params
  })
}
export function tickAdmin(params) {
  return request({
    url: api.adminOnLineTick,
    method: 'get',
    params
  })
}
/**
{'username':'mike','user':'eeee','password':'121212','tel':'1','email':'1','remarks':'1','root':[{"value":"101","title":"用户管理"},{"value":"101001","title":"用户列表"},{"value":"101002","title":"会员统计"}]}
 */
export function addAdmin(parameter) {
  const params = `param=${JSON.stringify(parameter)}`
  return request({
    chineseURI: true, // 中文乱码，转变提交内容类型
    url: api.adminAdd,
    method: 'post',
    data: params
  })
}
export function editAdmin(parameter) {
  const params = `param=${JSON.stringify(parameter)}`
  return request({
    chineseURI: true, // 中文乱码，转变提交内容类型
    url: api.adminEdit,
    method: 'post',
    data: params
  })
}
export function editAdminPwd(parameter) {
  // const params = `${JSON.stringify(parameter)}`
  return request({
    url: api.editAdminPwd,
    method: 'post',
    data: parameter
  })
}
export function getAdminMenu(parameter) {
  let { page, pageSize } = parameter
  const { key } = parameter
  if (!page) {
    page = 1
  }
  if (!pageSize) {
    pageSize = 500
  }
  const params = `?page=${page}&limit=${pageSize}${key ? '&key=' + key : ''}`
  return request({
    url: api.adminMenu + params,
    method: 'get'
    // data: parameter
  })
}
export function getAdminNotMenu(parameter) {
  let { page, pageSize } = parameter
  const { key, user } = parameter
  if (!page) {
    page = 1
  }
  if (!pageSize) {
    pageSize = 100
  }
  const params = `?page=${page}&limit=${pageSize}&user=${user}${key ? '&key=' + key : ''}`
  return request({
    url: api.adminNotmenu + params,
    method: 'get'
    // data: parameter
  })
}
export function getAdminNotMenu2(parameter) {
  let { page, pageSize } = parameter
  const { key, user } = parameter
  if (!page) {
    page = 1
  }
  if (!pageSize) {
    pageSize = 100
  }
  const params = `?page=${page}&limit=${pageSize}${user ? '&user=' + user : ''}${key ? '&key=' + key : ''}`
  return request({
    url: api.adminNotmenu2 + params,
    method: 'get'
    // data: parameter
  })
}
// 系统配置api
export function getConfigList(params) {
  let { page, pageSize } = params
  if (!page) {
    page = 1
  }
  if (!pageSize) {
    pageSize = 20
  }
  params.page = page
  params.limit = pageSize
  return request({
    url: api.configList,
    method: 'get',
    params
    // data: parameter
  })
}
export function addConfig(data) {
  return request({
    url: api.configAdd,
    method: 'post',
    data
  })
}
export function editConfig(data) {
  return request({
    url: api.configEdit,
    method: 'post',
    data
  })
}
// 版本管理api
export function getVersionList(parameter) {
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
    url: api.versionList + params,
    method: 'get'
    // data: parameter
  })
}
export function editVersion(data) {
  return request({
    url: api.versionEdit,
    method: 'post',
    data,
  })
}

export function getcurrencyTypeList() {
  return request({
    chineseURI: true, // 中文乱码，转变提交内容类型
    url: api.getCurrenctTypeList,
    method: 'get'
  })
}

export function addCurrency(data) {
  return request({
    url: api.currencyAdd,
    method: 'post',
    data
  })
}
export function editCurrency(data) {
  return request({
    url: api.currencyEdit,
    method: 'post',
    data
  })
}
export function delCurrency(data) {
  return request({
    url: api.currencyDel,
    method: 'post',
    data
  })
}
// 充提管理api
export function getCoinList(parameter) {
  let { page, pageSize } = parameter
  const { key, startdate, enddate } = parameter
  if (!page) {
    page = 1
  }
  if (!pageSize) {
    pageSize = 20
  }
  const params = `?page=${page}&limit=${pageSize}${key ? '&key=' + key : ''}${
    startdate ? '&startdate=' + startdate : ''
  }${enddate ? '&enddate=' + enddate : ''}`
  return request({
    url: api.coinList + params,
    method: 'get'
    // data: parameter
  })
}
export function addCoin(parameter) {
  const params = `param=${JSON.stringify(parameter)}`
  return request({
    chineseURI: true, // 中文乱码，转变提交内容类型
    url: api.coinAdd,
    method: 'post',
    data: params
  })
}
export function editCoin(parameter) {
  const params = `param=${JSON.stringify(parameter)}`
  return request({
    chineseURI: true, // 中文乱码，转变提交内容类型
    url: api.coinEdit,
    method: 'post',
    data: params
  })
}
export function delCoin(parameter) {
  const params = `param=${JSON.stringify(parameter)}`
  return request({
    url: api.coinDel,
    method: 'post',
    data: params
  })
}
// 注册配置api
export function getHandselList(parameter) {
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
    url: api.handselList + params,
    method: 'get'
    // data: parameter
  })
}
export function editHandsel(parameter) {
  const params = `param=${JSON.stringify(parameter)}`
  return request({
    chineseURI: true, // 中文乱码，转变提交内容类型
    url: api.handselEdit,
    method: 'post',
    data: params
  })
}
// level api
export function getUserLevelList(parameter) {
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
    url: api.userlevelList + params,
    method: 'get'
    // data: parameter
  })
}
export function editUserLevel(parameter) {
  const params = `param=${JSON.stringify(parameter)}`
  return request({
    chineseURI: true, // 中文乱码，转变提交内容类型
    url: api.userlevelEdit,
    method: 'post',
    data: params
  })
}
// google api
export function getGoogleList(parameter) {
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
    url: api.googleverifyList + params,
    method: 'get'
    // data: parameter
  })
}
export function bindGoogleVerify(parameter) {
  const params = `param=${JSON.stringify(parameter)}`
  return request({
    chineseURI: true, // 中文乱码，转变提交内容类型
    url: api.googleverifyBind,
    method: 'post',
    data: params
  })
}
// 白名单api
export function getWhiteIp(params) {
  let { page, pageSize } = params
  if (!page) {
    page = 1
  }
  if (!pageSize) {
    pageSize = 20
  }
  params.page = page
  params.limit = pageSize
  return request({
    url: api.whiteIpList,
    method: 'get',
    params
    // data: parameter
  })
}

export function addWhiteIp(data) {
  return request({
    url: api.whiteIpAdd,
    method: 'post',
    data
  })
}
export function updateWhiteIp(data) {
  return request({
    url: api.whiteIpUpdate,
    method: 'post',
    data
  })
}
export function delWhiteIp(params) {
  return request({
    url: api.whiteIpDel,
    method: 'get',
    params
  })
}
export function getBlackIp(params) {
  let { page, pageSize } = params
  if (!page) {
    page = 1
  }
  if (!pageSize) {
    pageSize = 20
  }
  params.page = page
  params.limit = pageSize
  return request({
    url: api.blackIpList,
    method: 'get',
    params
    // data: parameter
  })
}

export function addBlackIp(data) {
  return request({
    url: api.blackIpAdd,
    method: 'post',
    data
  })
}
export function updateBlackIp(data) {
  return request({
    url: api.blackIpUpdate,
    method: 'post',
    data
  })
}
export function delBlackIp(params) {
  return request({
    url: api.blackIpDel,
    method: 'get',
    params
  })
}
