import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
export function timeFix() {
  const time = new Date()
  const hour = time.getHours()
  return hour < 9 ? '早上好' : hour <= 11 ? '上午好' : hour <= 13 ? '中午好' : hour < 20 ? '下午好' : '晚上好'
}

export function welcome() {
  const arr = ['欢迎使用后台管理系统', '准备吃什么呢?', '要不要打一把 DOTA', '我猜你可能累了', '你好~']
  const index = Math.floor(Math.random() * arr.length)
  return arr[index]
}

/**
 * 触发 window.resize
 */
export function triggerWindowResizeEvent() {
  const event = document.createEvent('HTMLEvents')
  event.initEvent('resize', true, true)
  event.eventType = 'message'
  window.dispatchEvent(event)
}

export function handleScrollHeader(callback) {
  let timer = 0

  let beforeScrollTop = window.pageYOffset
  callback = callback || function () {}
  window.addEventListener(
    'scroll',
    (event) => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        let direction = 'up'
        const afterScrollTop = window.pageYOffset
        const delta = afterScrollTop - beforeScrollTop
        if (delta === 0) {
          return false
        }
        direction = delta > 0 ? 'down' : 'up'
        callback(direction)
        beforeScrollTop = afterScrollTop
      }, 50)
    },
    false
  )
}

export function isIE() {
  const bw = window.navigator.userAgent
  const compare = (s) => bw.indexOf(s) >= 0
  const ie11 = (() => 'ActiveXObject' in window)()
  return compare('MSIE') || ie11
}

/**
 * Remove loading animate
 * @param id parent element id or class
 * @param timeout
 */
export function removeLoadingAnimate(id = '', timeout = 1500) {
  if (id === '') {
    return
  }
  setTimeout(() => {
    document.body.removeChild(document.getElementById(id))
  }, timeout)
}
export function scorePassword(pass) {
  let score = 0
  if (!pass) {
    return score
  }
  // award every unique letter until 5 repetitions
  const letters = {}
  for (let i = 0; i < pass.length; i++) {
    letters[pass[i]] = (letters[pass[i]] || 0) + 1
    score += 5.0 / letters[pass[i]]
  }

  // bonus points for mixing it up
  const variations = {
    digits: /\d/.test(pass),
    lower: /[a-z]/.test(pass),
    upper: /[A-Z]/.test(pass),
    nonWords: /\W/.test(pass)
  }

  let variationCount = 0
  for (var check in variations) {
    variationCount += variations[check] === true ? 1 : 0
  }
  score += (variationCount - 1) * 10

  return parseInt(score)
}

// 缓存时长
export function savingTime(day, hours) {
  const oneDay = 24 * 60 * 60 * 1000
  const now = new Date().getTime()
  if (day) {
    return now + day * oneDay
  } else if (hours) {
    return now + hours * 60 * 60 * 1000
  }
  // 默认7天
  return now + 7 * oneDay
}

export const getPermissionIdByTitle = (title) => {
  let permissionId = ''
  switch (title) {
    case '用户管理':
      permissionId = 'Members'
      break
    case '内容管理':
      permissionId = 'Contents'
      break
    case '币币交易':
      permissionId = 'cointransaction'
      break
    case '资产中心':
      permissionId = 'assetcenter'
      break
    case '合约交易':
      permissionId = 'contractstrade'
      break
    case '周期合约':
      permissionId = 'contracts'
      break
    case '锁仓挖矿':
      permissionId = 'lockMin'
      break
    case '待审核管理':
      permissionId = 'auditedmanage'
      break
    case '日志管理':
      permissionId = 'logmanage'
      break
    case '系统设置':
      permissionId = 'SystemSetting'
      break
    //
    default:
      permissionId = ''
      break
  }
  return permissionId
}

export function getPermissionIdOrTitle(str) {
  const permissionGroup = {
    100: '后台主页',
    101: '用户管理',
    102: '内容管理',
    114: '日志管理',
    115: '系统设置',
    101001: '用户列表',
    101005: '在线用户',
    101006: '用户IP黑名单',
    101007: 'VIP等级设定',
    101008: 'VIP奖金记录',
    102001: '轮播图管理',
    102002: '文章管理',
    102003: '新闻管理',
    106001: '验证码日志',
    106002: '管理员登录日志',
    106003: '管理员操作日志',
    106004: '用户登录日志',
    106005: '用户操作日志',
    106006: '异常日志',
    106007: '用户钱包日志',
    106008: '合约钱包日志',
    106009: '用户通知日志',
    107001: '管理员列表',
    107002: '系统配置(商户)',
    107003: 'APP版本管理',
    107004: '基础币种管理',
    109: '合约交易',
    109001: '合约币种管理',
    109002: '合约资产管理',
    109003: '合约委托记录',
    109004: '合约平仓记录',
    109006: '合约杠杆倍数',
    112: '待审核管理',
    112001: '实名审核',
    112002: '提币审核',
    106: '资产中心',
    113001: '充提资产管理',
    113002: '提币银行卡',
    113003: '充值地址',
    113004: '提币地址本',
    113009: '资产记录',
    113110: '币币手续费',
    113111: '充币统计',
    113112: '提币统计',
    113113: '充提钱包统计',
    113005: '充币记录',
    113006: '提币记录',
    113007: '划转记录',
    113008: '其他充提记录',
    101002: '会员统计',
    112003: '充值审核',
    109008: '当前持仓管理',
    109007: '止盈止损',
    101003: '工单列表',
    101004: '待回复工单',
    105: '币币交易',
    105001: '交易币种管理',
    105002: '交易委托订单',
    105003: '交易成交记录',
    107005: '充提币种管理',
    110: '周期合约',
    110001: '周期合约币种',
    110002: '周期合约周期',
    110003: '周期合约交易币种',
    110004: '周期合约历史订单',
    110005: '周期合约当前订单',
    110006: '周期合约统计',
    107006: '注册赠送配置',
    107007: '手续费等级配置',
    111: '锁仓挖矿',
    111001: '配置列表',
    101011: '在线管理员',
    111002: '订单列表',
    111003: '收益列表',
    107008: 'google用户绑定',
    107009: '后台白名单',
    107010: '系统配置（系统）',
    120: '认购发币',
    1130001: '活动上新',
    1130002: '认购订单记录',
    // 140: 'C2C',
    // 140001: '法币交易币种',
    // 140002: '法币资产',
    // 140003: '商户管理',
    116: '优盾钱包',
    116001: '用户地址本',
    116002: '支持币种',
    121: '闪兑中心',
    12101: '闪兑币种',
    12102: '闪兑订单',
    131: '法币中心',
    13101: '法币管理',
    13102: '法币收款管理',
    13103: '法币订单管理',
    13104: '法币审核管理',
    140: '理财中心',
    140001: '动态理财配置',
    140002: '动态理财订单',
    140003: '动态理财收益',
    140004: '动态理财注记词审核',
    140005: '静态理财配置',
    140006: '静态理财订单',
    140007: '静态理财收益',
    140008: '静态理财注记词审核',
    140009: 'VIP理财配置',
    140010: 'VIP理财订单',
    140011: 'VIP理财收益',
    150: '报表统计',
    150001: '币种资产统计',
    150002: '现货统计',
    150003: '合约统计',
    150004: '周期统计',
    160:"智能挖矿",
    160001:"赠送记录",
    160002:"挖矿记录",
    160003:"手续费返还记录",

  }

  const regCN = new RegExp('[\u4E00-\u9FA5]')
  const regNum = new RegExp('[0-9]+')

  if (regCN.test(str) || str === 'C2C' || str === '用户IP黑名单') {
    for (const key in permissionGroup) {
      if (permissionGroup.hasOwnProperty(key) && permissionGroup[key] === str) {
        // const element = permissionGroup[key]
        return key
      }
    }
  }
  if (regNum.test(str)) {
    return permissionGroup[str]
  }
  return ''
}

/** 所有接口权限表 */
export const Permissionlist = {
  101012: '用户列表-领导人', // :disabled="!$verify('')"
  101013: '用户列表-编辑',
  102011: '轮播图管理-删除',
  102012: '轮播图管理-新增',
  102013: '轮播图管理-编辑',
  102022: '内容管理-删除',
  102023: '内容管理-新增',
  102024: '内容管理-编辑',
  107014: '基础币种管理-删除',
  107015: '基础币种管理-新增',
  107016: '基础币种管理-编辑',
  107021: '管理员列表-删除',
  107022: '管理员列表-新增',
  107023: '管理员列表-编辑',
  107033: 'APP版本管理-删除',
  107035: 'APP版本管理-编辑',
  107043: '系统配置-新增',
  107044: '系统配置-编辑',
  109011: '合约币种管理-删除',
  109012: '合约币种管理-新增',
  109013: '合约币种管理-编辑',
  109016: '合约杠杆倍数-删除',
  109017: '合约杠杆倍数-新增',
  109018: '合约杠杆倍数-编辑',
  112011: '实名审核-编辑',
  112022: '提币审核-编辑',
  113011: '充提资产管理-派送电子币',
  113013: '充值地址-删除',
  113014: '充值地址-新增',
  112014: '充值审核-编辑',
  109028: '当前持仓管理-仓位调整',
  109029: '当前持仓管理-平仓',
  101014: '待回复工单-编辑',
  105011: '交易币种管理-删除',
  105012: '交易币种管理-新增',
  105013: '交易币种管理-编辑',
  105022: '交易委托订单-直接成交',
  105023: '交易委托订单-撤单',
  107025: '充提币种管理-删除',
  107026: '充提币种管理-新增',
  107027: '充提币种管理-编辑',
  110011: '周期合约币种-删除',
  110012: '周期合约币种-新增',
  110013: '周期合约币种-编辑',
  110021: '周期合约周期-删除',
  110022: '周期合约周期-新增',
  110023: '周期合约周期-编辑',
  110031: '周期合约交易币种-删除',
  110032: '周期合约交易币种-新增',
  110033: '周期合约交易币种-编辑',
  110015: '周期合约当前订单-平仓',
  107036: '注册赠送配置-编辑',
  1070017: '手续费等级配置-编辑',
  111011: '配置列表-新增',
  111012: '配置列表-编辑',
  107018: 'google用户绑定-更新/绑定',
  1130012: '活动上新-删除',
  1130013: '活动上新-新增',
  1130014: '活动上新-编辑'
}
/** 保存权限表 */
export function saveMyPermissionlist(list) {
  const objArr = []
  list.forEach((item) => {
    objArr.push(item.menuid)
  })
  const str = objArr.join(',')
  localStorage.setItem('persission', str)
}

/** 加载权限表 */
export function loadMyPermissionlist() {
  const permission = localStorage.getItem('persission') || ''
  const Permission = {}
  const strArr = permission.split(',')
  strArr.forEach((item) => {
    Permission[item] = true
  })
  myPermissionlist = Permission
}

/** 我拥有的权限 页面启动的时候从localstore里加载进来 */
export var myPermissionlist = {}

/** 校验是否拥有传入的权限 */
export function PermissionVerify(id) {
  return true
  // return myPermissionlist[id]
}

export function exportExcel(data, column, filename = '数据.xlsx') {
  if (!data || data.length === 0) return

  if (!filename.endsWith('.xlsx')) {
    filename += '.xlsx'
  }

  // 按 column 的顺序重新生成数据，并把 key 换成 title
  const exportData = data.map((row) => {
    const newRow = {}
    column.forEach((col) => {
      newRow[col.title] = row[col.dataIndex] ?? ''
    })
    return newRow
  })

  // 生成工作表
  const worksheet = XLSX.utils.json_to_sheet(exportData)

  // 设置列宽
  worksheet['!cols'] = column.map(() => ({ wch: 30 }))

  // 生成工作簿
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
  const blob = new Blob([excelBuffer], { type: 'application/octet-stream' })
  saveAs(blob, filename)
}
