// eslint-disable-next-line
import { UserLayout, BasicLayout, BlankLayout, PageView } from '@/layouts'
import { bxAnaalyse } from '@/core/icons'

const RouteView = {
  name: 'RouteView',
  render: (h) => h('router-view')
}
// 路由接口配置（id转换）
// const changePermissionIdByID = (menuid) => {
//   let permissionId = ''
//   switch (menuid) {
//     case '101': // '用户管理'
//       permissionId = 'members'
//       break
//     case '102': // '内容管理'
//       permissionId = 'contents'
//       break
//     case '103': // '币币交易'
//       permissionId = 'cointransaction'
//       break
//     case '104': // '资产中心':
//       permissionId = 'assetcenter'
//       break
//     case '105': // '合约交易':
//       permissionId = 'contractstrade'
//       break
//     case '106': // '周期合约':
//       permissionId = 'contracts'
//       break
//     case '107': // '锁仓挖矿':
//       permissionId = 'locking'
//       break
//     case '108': // '待审核管理':
//       permissionId = 'auditedmanage'
//       break
//     case '109': // '日志管理':
//       permissionId = 'logmanage'
//       break
//     case '110': // '系统设置':
//       permissionId = 'systemmanage'
//       break
//     //
//     default:
//       permissionId = ''
//       break
//   }
//   return permissionId
// }
// console.log(changePermissionIdByID('101'))

// 静态同步路由
export const asyncRouterMap = [
  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: { title: '主页' },
    redirect: '/home',
    children: [
      {
        menuid: '100',
        path: '/home',
        name: 'home',
        redirect: '/home',
        component: RouteView,
        meta: { title: '主页', keepAlive: true, icon: bxAnaalyse, permission: ['Home', '100'] },
        children: [
          // 首页
          {
            path: '/home',
            name: 'Home',
            component: () => import('@/views/home/Home'),
            meta: { title: '后台首页', keepAlive: false, permission: ['Home', '100'] }
          }
        ]
      },
      // 用户管理
      {
        menuid: '101',
        path: '/members',
        name: 'members',
        component: RouteView,
        redirect: '/members/memberlist',
        meta: { title: '用户管理', icon: 'user', permission: ['Members', '101'] },
        children: [
          {
            menuid: '101001',
            path: '/members/memberonlinelist/:pageNo([1-9]\\d*)?',
            name: 'MemberTableList',
            // hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
            component: () => import('@/views/memberlist/MemberList'),
            meta: { title: '用户列表', keepAlive: true, permission: ['Members', '101001'] }
          },
          {
            menuid: '101005',
            path: '/members/memberlist/:pageNo([1-9]\\d*)?',
            name: 'MemberOnlineList',
            // hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
            component: () => import('@/views/memberlist/MemberOnlineList'),
            meta: { title: '在线用户', keepAlive: true, permission: ['Members', '101005'] }
          },

          {
            menuid: '101003',
            path: '/members/orderlist',
            name: 'MemberOrderList',
            component: () => import('@/views/memberlist/OrderList'),
            meta: { title: '工单列表', permission: ['Members', '101003'] }
          },
          {
            menuid: '101004',
            path: '/members/orderreply/:pageNo([1-9]\\d*)?',
            name: 'MemberReplyList',
            // hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
            component: () => import('@/views/memberlist/OrderReply'),
            meta: { title: '待回复工单', keepAlive: true, permission: ['Members', '101004'] }
          },
          {
            menuid: '101006',
            path: '/members/userback/:pageNo([1-9]\\d*)?',
            name: 'MemberBalck',
            // hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
            component: () => import('@/views/memberlist/MemberBalck'),
            meta: { title: '用户IP黑名单', keepAlive: true, permission: ['Members', '101006'] }
          },
          {
            menuid: '101007',
            path: '/members/vipsetting/:pageNo([1-9]\\d*)?',
            name: 'VipSetting',
            // hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
            component: () => import('@/views/memberlist/VipSetting'),
            meta: { title: 'VIP等级设定', keepAlive: true, permission: ['Members', '101007'] }
          },
          {
            menuid: '101008',
            path: '/members/vipbonus/:pageNo([1-9]\\d*)?',
            name: 'VipBonus',
            // hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
            component: () => import('@/views/memberlist/VipBonus'),
            meta: { title: 'VIP奖金记录', keepAlive: true, permission: ['Members', '101008'] }
          }
        ]
      },
      // 内容管理
      {
        menuid: '102',
        path: '/contents',
        name: 'contents',
        component: RouteView,
        redirect: '/contents/banners',
        meta: { title: '内容管理', icon: 'slack', permission: ['Dashboard', '102'] },
        children: [
          {
            menuid: '102001',
            path: '/contents/banners/:pageNo([1-9]\\d*)?',
            name: 'Banners',
            // hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
            component: () => import('@/views/content/Banners'),
            meta: { title: '轮播图管理', keepAlive: true, permission: ['102001'] }
          },
          {
            menuid: '102002',
            path: '/contents/articles/:pageNo([1-9]\\d*)?',
            name: 'Articles',
            // hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
            component: () => import('@/views/content/Articles'),
            meta: { title: '公告管理', keepAlive: true, permission: ['102002', '102'] }
          },
          {
            menuid: '102003',
            path: '/contents/news/:pageNo([1-9]\\d*)?',
            name: 'News',
            // hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
            component: () => import('@/views/content/News'),
            meta: { title: '新闻管理', keepAlive: true, permission: ['102003', '102'] }
          }
        ]
      },
      // 币币交易
      {
        menuid: '105',
        path: '/trad',
        name: 'trad',
        component: RouteView,
        redirect: '/trad/tradcoinlist',
        meta: { title: '币币交易', icon: 'form', permission: ['Dashboard', '105'] },
        children: [
          {
            menuid: '105001',
            path: '/trad/tradcoinlist/:pageNo([1-9]\\d*)?',
            name: 'TradCoinList',
            // hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
            component: () => import('@/views/trads/TradCoinList'),
            meta: { title: '交易币种管理', keepAlive: true, permission: ['105001'] }
          },
          {
            menuid: '105002',
            path: '/trad/tradentrust/:pageNo([1-9]\\d*)?',
            name: 'TradEntrustList',
            // hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
            component: () => import('@/views/trads/TradEntrustList'),
            meta: { title: '交易委托订单', keepAlive: true, permission: ['105002'] }
          },
          {
            menuid: '105003',
            path: '/trad/tradorderlist/:pageNo([1-9]\\d*)?',
            name: 'TradOrderList',
            // hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
            component: () => import('@/views/trads/TradOrderList'),
            meta: { title: '交易成交记录', keepAlive: true, permission: ['105003'] }
          }
        ]
      },
      // 资产中心
      {
        menuid: '106',
        path: '/assethub',
        name: 'assethub',
        component: RouteView,
        redirect: '/assethub/usaccountlist',
        meta: { title: '资产中心', icon: 'check-circle-o', permission: ['Dashboard', '106'] },
        children: [
          {
            menuid: '113001',
            path: '/assethub/usaccountlist/:pageNo([1-9]\\d*)?',
            name: 'UsaccountList',
            // hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
            component: () => import('@/views/assethubs/UsaccountList'),
            meta: { title: '充提资产管理', keepAlive: true, permission: ['113001'] }
          },
          {
            menuid: '113003',
            path: '/assethub/addresslist/:pageNo([1-9]\\d*)?',
            name: 'AddressList',
            // hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
            component: () => import('@/views/assethubs/AddressList'),
            meta: { title: '充值地址', keepAlive: true, permission: ['113003'] }
          },
          {
            menuid: '113004',
            path: '/assethub/toaddresslist/:pageNo([1-9]\\d*)?',
            name: 'ToaddressList',
            // hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
            component: () => import('@/views/assethubs/ToaddressList'),
            meta: { title: '提币地址本', keepAlive: true, permission: ['113004'] }
          },
          {
            menuid: '113002',
            path: '/assethub/bankcardmember/:pageNo([1-9]\\d*)?',
            name: 'BankCardMember',
            // hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
            component: () => import('@/views/assethubs/BankCardMember'),
            meta: { title: '提币银行卡', keepAlive: true, permission: ['113002'] }
          },
          {
            menuid: '113005',
            path: '/assethub/usprofitinlist/:pageNo([1-9]\\d*)?',
            name: 'UsprofitInList',
            // hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
            component: () => import('@/views/assethubs/UsprofitInList'),
            meta: { title: '充币记录', keepAlive: true, permission: ['113005'] }
          },
          {
            menuid: '113006',
            path: '/assethub/usprofitoutlist/:pageNo([1-9]\\d*)?',
            name: 'UsprofitOutList',
            // hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
            component: () => import('@/views/assethubs/UsprofitOutList'),
            meta: { title: '提币记录', keepAlive: true, permission: ['113006'] }
          },
          {
            menuid: '113007',
            path: '/assethub/usprofittransferlist/:pageNo([1-9]\\d*)?',
            name: 'UsprofitTransferList',
            // hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
            component: () => import('@/views/assethubs/UsprofitTransferList'),
            meta: { title: '划转记录', keepAlive: true, permission: ['113007'] }
          },
          {
            menuid: '113008',
            path: '/assethub/usprofitsystemlist/:pageNo([1-9]\\d*)?',
            name: 'UsprofitSystemList',
            // hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
            component: () => import('@/views/assethubs/UsprofitSystemList'),
            meta: { title: '其他充提记录', keepAlive: true, permission: ['113008'] }
          },
          {
            menuid: '113009',
            path: '/assethub/usprofitlist/:pageNo([1-9]\\d*)?',
            name: 'UsprofitList',
            // hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
            component: () => import('@/views/assethubs/UsprofitList'),
            meta: { title: '资产记录', keepAlive: true, permission: ['113009'] }
          }
        ]
      },
      // 合约交易
      {
        menuid: '109',
        path: '/contract',
        name: 'contract',
        component: RouteView,
        redirect: '/contract/contractcoinlist',
        meta: { title: '合约交易', icon: 'table', permission: ['Dashboard', '109'] },
        children: [
          {
            menuid: '109001',
            path: '/contract/contractcoinlist/:pageNo([1-9]\\d*)?',
            name: 'contractcoinlist',
            // hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
            component: () => import('@/views/contracts/ContractCoinList'),
            meta: { title: '合约币种管理', keepAlive: true, permission: ['109001'] }
          },
          {
            menuid: '109002',
            path: '/contract/contractaccountlist/:pageNo([1-9]\\d*)?',
            name: 'contractaccountlist',
            // hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
            component: () => import('@/views/contracts/ContractAccountList'),
            meta: { title: '合约资产管理', keepAlive: true, permission: ['109002'] }
          },
          {
            menuid: '109003',
            path: '/contract/contractentrustlist/:pageNo([1-9]\\d*)?',
            name: 'contractentrustlist',
            // hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
            component: () => import('@/views/contracts/ContractEntrustList'),
            meta: { title: '合约委托记录', keepAlive: true, permission: ['109003'] }
          },
          {
            menuid: '109004',
            path: '/contract/contractorderlist/:pageNo([1-9]\\d*)?',
            name: 'contractorderlist',
            // hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
            component: () => import('@/views/contracts/ContractOrderList'),
            meta: { title: '合约平仓记录', keepAlive: true, permission: ['109004'] }
          },
          {
            menuid: '109006',
            path: '/contract/contractleverlist/:pageNo([1-9]\\d*)?',
            name: 'contractleverlist',
            // hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
            component: () => import('@/views/contracts/ContractLeverList'),
            meta: { title: '合约杠杆倍数', keepAlive: true, permission: ['109006'] }
          },
          {
            menuid: '109008',
            path: '/contract/contractorderenablelist/:pageNo([1-9]\\d*)?',
            name: 'contractorderenablelist',
            // hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
            component: () => import('@/views/contracts/ContractOrderEnableList'),
            meta: { title: '当前持仓管理', keepAlive: true, permission: ['109008'] }
          },
          {
            menuid: '109007',
            path: '/contract/profitloss/:pageNo([1-9]\\d*)?',
            name: 'profitloss',
            // hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
            component: () => import('@/views/contracts/ProfitLoss'),
            meta: { title: '止盈止损', keepAlive: true, permission: ['109007'] }
          },
          {
            menuid: '00',
            path: '/contract/stragy/',
            name: 'contractstragy',
            hideChildrenInMenu: false, // 强制显示 MenuItem 而不是 SubMenu
            component: () => import('@/views/contracts/ContractStagy'),
            meta: { title: '系统币策略', keepAlive: true, permission: ['109008'], show: false }
          },
          {
            menuid: '01',
            path: '/contract/control/',
            name: 'contractcontrol',
            hideChildrenInMenu: false, // 强制显示 MenuItem 而不是 SubMenu
            component: () => import('@/views/contracts/ContractControl'),
            meta: {
              title: '行情控制',
              keepAlive: true,
              permission: ['109008'],
              show: false
            }
          }
        ]
      },
      // 周期合约
      {
        menuid: '110',
        path: '/cycle',
        name: 'cycle',
        component: RouteView,
        redirect: '/cycle/cyclecoinlist',
        meta: { title: '周期合约', icon: 'form', permission: ['Dashboard', '110'] },
        children: [
          {
            menuid: '110001',
            path: '/cycle/cyclecoinlist/:pageNo([1-9]\\d*)?',
            name: 'cyclecoinlist',
            // hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
            component: () => import('@/views/cycles/CycleCoinList'),
            meta: { title: '周期合约币种', keepAlive: true, permission: ['110001'] }
          },
          {
            menuid: '110002',
            path: '/cycle/cycleleverlist/:pageNo([1-9]\\d*)?',
            name: 'cycleleverlist',
            // hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
            component: () => import('@/views/cycles/CycleLeverList'),
            meta: { title: '周期合约周期', keepAlive: true, permission: ['110002'] }
          },
          {
            menuid: '110003',
            path: '/cycle/cyclepaycoinlist/:pageNo([1-9]\\d*)?',
            name: 'cyclepaycoinlist',
            // hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
            component: () => import('@/views/cycles/CyclePayCoinList'),
            meta: { title: '周期合约交易币种', keepAlive: true, permission: ['110003'] }
          },
          {
            menuid: '110004',
            path: '/cycle/cycleorderlist/:pageNo([1-9]\\d*)?',
            name: 'cycleorderlist',
            // hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
            component: () => import('@/views/cycles/CycleOrderList'),
            meta: { title: '周期合约历史订单', keepAlive: true, permission: ['110004'] }
          },
          {
            menuid: '110005',
            path: '/cycle/cycleorderenablelist/:pageNo([1-9]\\d*)?',
            name: 'cycleorderenablelist',
            // hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
            component: () => import('@/views/cycles/CycleOrderEnableList'),
            meta: { title: '周期合约当前订单', keepAlive: true, permission: ['110005'] }
          },
          {
            menuid: '110006',
            path: '/cycle/cyclestaticslist/:pageNo([1-9]\\d*)?',
            name: 'cyclestaticslist',
            // hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
            component: () => import('@/views/cycles/CycleStaticsList'),
            meta: { title: '周期合约统计', keepAlive: true, permission: ['110006'] }
          }
        ]
      },
      // 锁仓挖矿
      {
        menuid: '111',
        path: '/miner',
        name: 'miner',
        component: RouteView,
        redirect: '/miner/minerlist',
        meta: { title: '锁仓挖矿', icon: 'warning', permission: ['Dashboard', '111'] },
        children: [
          {
            menuid: '111001',
            path: '/miner/minerlist/:pageNo([1-9]\\d*)?',
            name: 'minerlist',
            // hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
            component: () => import('@/views/miners/MinerList'),
            meta: { title: '配置列表', keepAlive: true, permission: ['111001'] }
          },
          {
            menuid: '111002',
            path: '/miner/minerorder/:pageNo([1-9]\\d*)?',
            name: 'minerorder',
            // hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
            component: () => import('@/views/miners/MinerOrderList'),
            meta: { title: '订单列表', keepAlive: true, permission: ['111002'] }
          },
          {
            menuid: '111003',
            path: '/miner/minerincome/:pageNo([1-9]\\d*)?',
            name: 'minerincome',
            // hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
            component: () => import('@/views/miners/MinerInCome'),
            meta: { title: '收益列表', keepAlive: true, permission: ['111003'] }
          }
        ]
      },
      // 待审核管理
      {
        menuid: '112',
        path: '/examine',
        name: 'examine',
        component: RouteView,
        redirect: '/examine/realyname',
        meta: { title: '待审核管理', icon: 'tool', permission: ['Dashboard', '112'] },
        children: [
          {
            menuid: '112001',
            path: '/examine/realyname/:pageNo([1-9]\\d*)?',
            name: 'realyname',
            // hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
            component: () => import('@/views/examines/RealyNameList'),
            meta: { title: '实名审核', keepAlive: true, permission: ['112001'] }
          },
          {
            menuid: '112002',
            path: '/examine/coinoutlist/:pageNo([1-9]\\d*)?',
            name: 'coinoutlist',
            // hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
            component: () => import('@/views/examines/CoinOutList'),
            meta: { title: '提币审核', keepAlive: true, permission: ['112002'] }
          },
          {
            menuid: '112003',
            path: '/examine/coininlist/:pageNo([1-9]\\d*)?',
            name: 'coininlist',
            // hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
            component: () => import('@/views/examines/FiatCoinList'),
            meta: { title: '充值审核', keepAlive: true, permission: ['112003'] }
          }
        ]
      },
      // 日志管理
      {
        menuid: '114',
        path: '/log',
        name: 'log',
        component: RouteView,
        redirect: '/log/logsms',
        meta: { title: '日志管理', icon: 'warning', permission: ['Dashboard', '114'] },
        children: [
          {
            menuid: '106001',
            path: '/log/logsms/:pageNo([1-9]\\d*)?',
            name: 'LogSms',
            // hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
            component: () => import('@/views/logs/LogSms'),
            meta: { title: '验证码日志', keepAlive: true, permission: ['106001'] }
          },
          {
            menuid: '106002',
            path: '/log/logadminlogin/:pageNo([1-9]\\d*)?',
            name: 'LogAdminLogin',
            // hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
            component: () => import('@/views/logs/LogAdminLogin'),
            meta: { title: '管理员登录日志', keepAlive: true, permission: ['106002'] }
          },
          {
            menuid: '106003',
            path: '/log/logadminsetting/:pageNo([1-9]\\d*)?',
            name: 'LogAdminSetting',
            // hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
            component: () => import('@/views/logs/LogAdminSetting'),
            meta: { title: '管理员操作日志', keepAlive: true, permission: ['106003'] }
          },
          {
            menuid: '106004',
            path: '/log/loguserlogin/:pageNo([1-9]\\d*)?',
            name: 'LogUserLogin',
            // hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
            component: () => import('@/views/logs/LogUserLogin'),
            meta: { title: '用户登录日志', keepAlive: true, permission: ['106004'] }
          },
          {
            menuid: '106005',
            path: '/log/logusersetting/:pageNo([1-9]\\d*)?',
            name: 'LogUserSetting',
            // hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
            component: () => import('@/views/logs/LogUserSetting'),
            meta: { title: '用户操作日志', keepAlive: true, permission: ['106005'] }
          },

          {
            menuid: '106006',
            path: '/log/LogEx/:pageNo([1-9]\\d*)?',
            name: 'LogEx',
            // hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
            component: () => import('@/views/logs/LogEx'),
            meta: { title: '用户异常日志', keepAlive: true, permission: ['106006'] }
          },
          {
            menuid: '106007',
            path: '/log/usaccountlog/:pageNo([1-9]\\d*)?',
            name: 'LogUserAccount',
            // hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
            component: () => import('@/views/logs/LogUserAccount'),
            meta: {
              title: '用户钱包日志',
              keepAlive: true,
              permission: ['106007']
            }
          },
          {
            menuid: '106008',
            path: '/log/contrractaccountlog/:pageNo([1-9]\\d*)?',
            name: 'LogContractAccount',
            // hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
            component: () => import('@/views/logs/LogContractAccount'),
            meta: {
              title: '合约钱包日志',
              keepAlive: true,
              permission: ['106008']
            }
          }
          ,
          {
            menuid: '106009',
            path: '/log/lognotify/:pageNo([1-9]\\d*)?',
            name: 'LogNotify',
            // hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
            component: () => import('@/views/logs/logNotify'),
            meta: {
              title: '用户通知日志',
              keepAlive: true,
              permission: ['106009']
            }
          }
        ]
      },
      // 系统设置
      {
        menuid: '115',
        path: '/systems',
        name: 'systems',
        component: RouteView,
        redirect: '/systems/adminlist',
        meta: { title: '系统设置', icon: 'slack', permission: ['SystemSetting', '115'] },
        children: [
          {
            menuid: '107001',
            path: '/systems/adminlist/:pageNo([1-9]\\d*)?',
            name: 'AdminList',
            // hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
            component: () => import('@/views/systemsettings/AdminList'),
            meta: { title: '管理员列表', keepAlive: false, permission: ['SystemSetting', '107001'] }
          },
          {
            menuid: '101011',
            path: '/systems/adminonlinelist/:pageNo([1-9]\\d*)?',
            name: 'AdminOnLineList',
            // hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
            component: () => import('@/views/systemsettings/AdminOnLineList'),
            meta: { title: '在线管理员', keepAlive: false, permission: ['SystemSetting', '101011'] }
          },
          {
            menuid: '107002',
            path: '/systems/configlist/:pageNo([1-9]\\d*)?',
            name: 'ConfigList',
            // hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
            component: () => import('@/views/systemsettings/ConfigList'),
            meta: { title: '系统配置(商户)', keepAlive: false, permission: ['SystemSetting', '107002'] }
          },
          {
            menuid: '107010',
            path: '/systems/configlist_sys/:pageNo([1-9]\\d*)?',
            name: 'ConfigListSys',
            // hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
            component: () => import('@/views/systemsettings/ConfigListSys'),
            meta: { title: '系统配置(系统)', keepAlive: false, permission: ['SystemSetting', '107010'] }
          },
          {
            menuid: '107003',
            path: '/systems/versionlist/:pageNo([1-9]\\d*)?',
            name: 'VersionList',
            // hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
            component: () => import('@/views/systemsettings/APPVersionList'),
            meta: { title: 'APP版本管理', keepAlive: false, permission: ['SystemSetting', '107003'] }
          },
          {
            menuid: '107004',
            path: '/systems/currencylist/:pageNo([1-9]\\d*)?',
            name: 'CurrencyList',
            // hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
            component: () => import('@/views/systemsettings/CurrencyList'),
            meta: { title: '基础币种管理', keepAlive: false, permission: ['SystemSetting', '107004'] }
          },
          {
            menuid: '107005',
            path: '/systems/coinlist/:pageNo([1-9]\\d*)?',
            name: 'CoinList',
            // hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
            component: () => import('@/views/systemsettings/CoinList'),
            meta: { title: '充提币种管理', keepAlive: false, permission: ['SystemSetting', '107005'] }
          },
          {
            menuid: '107006',
            path: '/systems/handselcoinconfig/:pageNo([1-9]\\d*)?',
            name: 'HandselConfig',
            // hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
            component: () => import('@/views/systemsettings/HandselConfig'),
            meta: { title: '注册赠送配置', keepAlive: false, permission: ['SystemSetting', '107006'] }
          },
          {
            menuid: '107007',
            path: '/systems/userlevelconfig/:pageNo([1-9]\\d*)?',
            name: 'UserLevelConfig',
            // hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
            component: () => import('@/views/systemsettings/UserLevelConfig'),
            meta: { title: '手续费等级配置', keepAlive: false, permission: ['SystemSetting', '107007'] }
          },
          {
            menuid: '107008',
            path: '/systems/googleverifylist/:pageNo([1-9]\\d*)?',
            name: 'GoogleVerifyList',
            // hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
            component: () => import('@/views/systemsettings/GoogleVerifyList'),
            meta: { title: 'google用户绑定', keepAlive: false, permission: ['SystemSetting', '107008'] }
          },
          {
            menuid: '107009',
            path: '/systems/whitelist/:pageNo([1-9]\\d*)?',
            name: 'WhiteList',
            // hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
            component: () => import('@/views/systemsettings/WhiteList'),
            meta: { title: '后台白名单', keepAlive: false, permission: ['SystemSetting', '107009'] }
          }
        ]
      },
      // 认购发币
      {
        menuid: '120',
        path: '/activity',
        name: 'activity',
        component: RouteView,
        redirect: '/activity/actlist',
        meta: { title: '认购发币', icon: 'form', permission: ['SystemSetting', '120'] },
        children: [
          {
            menuid: '1130001',
            path: '/activity/actlist/:pageNo([1-9]\\d*)?',
            name: 'ActList',
            // hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
            component: () => import('@/views/activitics/ActivityList'),
            meta: { title: '活动上新', keepAlive: false, permission: ['SystemSetting', '1130001'] }
          },
          {
            menuid: '1130002',
            path: '/activity/actorderlist/:pageNo([1-9]\\d*)?',
            name: 'ActOrderList',
            // hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
            component: () => import('@/views/activitics/ActivityOrderList'),
            meta: { title: '认购订单记录', keepAlive: false, permission: ['SystemSetting', '1130002'] }
          }
        ]
      },
      // c2c
      // {
      //   menuid: '140',
      //   path: '/c2c',
      //   name: 'c2c',
      //   component: RouteView,
      //   redirect: '/c2c/C2cCoinList',
      //   meta: { title: 'C2C', icon: 'form', permission: ['SystemSetting', '140'] },
      //   children: [
      //     {
      //       menuid: '140001',
      //       path: '/c2c/C2cCoinList/:pageNo([1-9]\\d*)?',
      //       name: 'C2cCoinList',
      //       component: () => import('@/views/c2c/C2cCoinList'),
      //       meta: { title: '法币交易币种', keepAlive: false, permission: ['SystemSetting', '140001'] }
      //     },
      //     {
      //       menuid: '140002',
      //       path: '/c2c/C2cAccount/:pageNo([1-9]\\d*)?',
      //       name: 'C2cAccount',
      //       component: () => import('@/views/c2c/C2cAccount'),
      //       meta: { title: '法币资产', keepAlive: false, permission: ['SystemSetting', '140002'] }
      //     },
      //     {
      //       menuid: '140003',
      //       path: '/c2c/C2cMerchant/:pageNo([1-9]\\d*)?',
      //       name: 'C2cMerchant',
      //       component: () => import('@/views/c2c/C2cMerchant'),
      //       meta: { title: '商户管理', keepAlive: false, permission: ['SystemSetting', '140003'] }
      //     }
      //   ]
      // },
      // udun
      {
        menuid: '116',
        path: '/udun',
        name: 'udun',
        component: RouteView,
        redirect: '/udun/address',
        meta: { title: '优盾钱包', icon: 'wallet', permission: ['SystemSetting', '116'] },
        children: [
          {
            menuid: '116001',
            path: '/udun/address/:pageNo([1-9]\\d*)?',
            name: 'address',
            component: () => import('@/views/assethubs/AddressListUdun.vue'),
            meta: { title: '用户地址本', keepAlive: false, permission: ['SystemSetting', '116001'] }
          },
          {
            menuid: '116002',
            path: '/udun/coin/:pageNo([1-9]\\d*)?',
            name: 'coin_udun',
            component: () => import('@/views/assethubs/CoinUdun.vue'),
            meta: { title: '支持币种', keepAlive: false, permission: ['SystemSetting', '116001'] }
          }
        ]
      },
      // 兑换中心
      {
        menuid: '121',
        path: '/flash',
        name: 'flash',
        component: RouteView,
        redirect: '/flash/coin',
        meta: { title: '闪兑中心', icon: 'interaction', permission: ['SystemSetting', '121'] },
        children: [
          {
            menuid: '12101',
            path: '/flash/coin/:pageNo([1-9]\\d*)?',
            name: 'flashCoin',
            component: () => import('@/views/flash/Coin.vue'),
            meta: { title: '闪兑币种', keepAlive: false, permission: ['SystemSetting', '12101'] }
          },
          {
            menuid: '12102',
            path: '/flash/order/:pageNo([1-9]\\d*)?',
            name: 'flashOrder',
            component: () => import('@/views/flash/Order.vue'),
            meta: { title: '闪兑订单', keepAlive: false, permission: ['SystemSetting', '12102'] }
          }
        ]
      },
      // 法币管理<DollarCircleOutlined />
      {
        menuid: '131',
        path: '/fiat',
        name: 'fiat',
        component: RouteView,
        redirect: '/fiat/currency',
        meta: { title: '法币中心', icon: 'money-collect', permission: ['SystemSetting', '131'] },
        children: [
          {
            menuid: '13101',
            path: '/fiat/currency/:pageNo([1-9]\\d*)?',
            name: 'fiatCoin',
            component: () => import('@/views/fiat/Coin.vue'),
            meta: { title: '法币管理', keepAlive: false, permission: ['SystemSetting', '13101'] }
          },
          {
            menuid: '13102',
            path: '/fiat/payment/:pageNo([1-9]\\d*)?',
            name: 'fiatPayment',
            component: () => import('@/views/fiat/Payment.vue'),
            meta: { title: '收款方式管理', keepAlive: false, permission: ['SystemSetting', '13102'] }
          },
          {
            menuid: '13103',
            path: '/fiat/order/:pageNo([1-9]\\d*)?',
            name: 'fiatOrder',
            component: () => import('@/views/fiat/Order.vue'),
            meta: { title: '法币订单', keepAlive: false, permission: ['SystemSetting', '13102'] }
          }
        ]
      },
      // 法币管理<DollarCircleOutlined />
      {
        menuid: '140',
        path: '/funds',
        name: 'funds',
        component: RouteView,
        redirect: '/funds/dymicfunds',
        meta: { title: '理财中心', icon: 'money-collect', permission: ['SystemSetting', '140'] },
        children: [
          {
            menuid: '140001',
            path: '/funds/dymicFunds/:pageNo([1-9]\\d*)?',
            name: 'dymicfunds',
            component: () => import('@/views/funds/Dymicfunds.vue'),
            meta: { title: '动态理财配置', keepAlive: false, permission: ['SystemSetting', '140001'] }
          },
          {
            menuid: '140002',
            path: '/funds/dymicFundsOrder:pageNo([1-9]\\d*)?',
            name: 'dymicFundsOrder',
            component: () => import('@/views/funds/DymicFundsOrder.vue'),
            meta: { title: '动态理财订单', keepAlive: false, permission: ['SystemSetting', '140002'] }
          },
          {
            menuid: '140003',
            path: '/funds/dymicFundsIncome:pageNo([1-9]\\d*)?',
            name: 'dymicFundsIncome',
            component: () => import('@/views/funds/DymicFundsIncome.vue'),
            meta: { title: '动态理财收益', keepAlive: false, permission: ['SystemSetting', '140003'] }
          },
          {
            menuid: '140004',
            path: '/funds/dymicFundsHelp/:pageNo([1-9]\\d*)?',
            name: 'dymicFundsHelp',
            component: () => import('@/views/funds/DymicFundsHelp.vue'),
            meta: { title: '动态理财注记词审核', keepAlive: false, permission: ['SystemSetting', '140004'] }
          },
          {
            menuid: '140005',
            path: '/funds/staticFunds/:pageNo([1-9]\\d*)?',
            name: 'StaticFunds',
            component: () => import('@/views/funds/StaticFunds.vue'),
            meta: { title: '静态理财配置', keepAlive: false, permission: ['SystemSetting', '140005'] }
          },
          {
            menuid: '140006',
            path: '/funds/staticFundsOrder:pageNo([1-9]\\d*)?',
            name: 'staticFundsOrder',
            component: () => import('@/views/funds/StaticFundsOrder.vue'),
            meta: { title: '静态理财订单', keepAlive: false, permission: ['SystemSetting', '140006'] }
          },
          {
            menuid: '140007',
            path: '/funds/staticFundsIncome:pageNo([1-9]\\d*)?',
            name: 'staticFundsIncome',
            component: () => import('@/views/funds/StaticFundsIncome.vue'),
            meta: { title: '静态理财收益', keepAlive: false, permission: ['SystemSetting', '140007'] }
          },
          {
            menuid: '140008',
            path: '/funds/StaticFundsHelp/:pageNo([1-9]\\d*)?',
            name: 'StaticFundsHelp',
            component: () => import('@/views/funds/StaticFundsHelp.vue'),
            meta: { title: '静态理财注记词审核', keepAlive: false, permission: ['SystemSetting', '140008'] }
          },

          {
            menuid: '140009',
            path: '/funds/vip/:pageNo([1-9]\\d*)?',
            name: 'VipFunds',
            component: () => import('@/views/funds/VipFunds.vue'),
            meta: { title: 'VIP理财配置', keepAlive: false, permission: ['SystemSetting', '140009'] }
          },
          {
            menuid: '140010',
            path: '/funds/vipFundsOrder/:pageNo([1-9]\\d*)?',
            name: 'vipFundsOrder',
            component: () => import('@/views/funds/VipFundsOrder.vue'),
            meta: { title: 'VIP理财订单', keepAlive: false, permission: ['SystemSetting', '140010'] }
          },
          {
            menuid: '140011',
            path: '/funds/VipFundsIncome/:pageNo([1-9]\\d*)?',
            name: 'VipFundsIncome',
            component: () => import('@/views/funds/VipFundsIncome.vue'),
            meta: { title: 'VIP理财收益', keepAlive: false, permission: ['SystemSetting', '140011'] }
          }
        ]
      },
      // 报表管理<DollarCircleOutlined />
      {
        menuid: '150',
        path: '/report',
        name: 'report',
        component: RouteView,
        redirect: '/report/coinReport',
        meta: { title: '报表统计', icon: 'bar-chart', permission: ['SystemSetting', '150'] },
        children: [
          {
            menuid: '101002',
            path: '/report/membercount',
            name: 'MemberCountList',
            component: () => import('@/views/report/MemberCount'),
            meta: { title: '会员统计', keepAlive: true, permission: ['Members', '101002'] }
          },
          {
            menuid: '150001',
            path: '/funds/coinReport/:pageNo([1-9]\\d*)?',
            name: 'coinReport',
            component: () => import('@/views/report/AssetsStatic.vue'),
            meta: { title: '币种资产统计', keepAlive: false, permission: ['SystemSetting', '140001'] }
          },
          {
            menuid: '150002',
            path: '/funds/TradStatic/:pageNo([1-9]\\d*)?',
            name: 'TradStatic',
            component: () => import('@/views/report/TradStatic.vue'),
            meta: { title: '现货统计', keepAlive: false, permission: ['SystemSetting', '150002'] }
          },
          {
            menuid: '150003',
            path: '/funds/ContractStatic/:pageNo([1-9]\\d*)?',
            name: 'ContractStatic',
            component: () => import('@/views/report/ContractStatic.vue'),
            meta: { title: '合约统计', keepAlive: false, permission: ['SystemSetting', '150003'] }
          },
          {
            menuid: '150004',
            path: '/funds/CycleStatic/:pageNo([1-9]\\d*)?',
            name: 'CycleStatic',
            component: () => import('@/views/report/CycleStatic.vue'),
            meta: { title: '周期统计', keepAlive: false, permission: ['SystemSetting', '150004'] }
          },
          {
            menuid: '113111',
            path: '/report/coinin/:pageNo([1-9]\\d*)?',
            name: 'Coinin',
            // hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
            component: () => import('@/views/report/Coinin'),
            meta: { title: '充币统计', keepAlive: true, permission: ['113111'] }
          },
          {
            menuid: '113112',
            path: '/report/coinout/:pageNo([1-9]\\d*)?',
            name: 'Coinout',
            // hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
            component: () => import('@/views/report/Coinout'),
            meta: { title: '提币统计', keepAlive: true, permission: ['113112'] }
          },
          {
            menuid: '113113',
            path: '/report/useraccount/:pageNo([1-9]\\d*)?',
            name: 'Useraccount',
            // hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
            component: () => import('@/views/report/Useraccount'),
            meta: { title: '充提钱包统计', keepAlive: true, permission: ['113113'] }
          },
          {
            menuid: '113110',
            path: '/assethub/tradgas/:pageNo([1-9]\\d*)?',
            name: 'Tradgas',
            // hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
            component: () => import('@/views/assethubs/Tradgas'),
            meta: { title: '币币手续费', keepAlive: true, permission: ['113110'] }
          }
        ]
      },
      //智能挖矿
   {
        menuid: '160',
        path: '/daily',
        name: 'daily',
        component: RouteView,
        redirect: '/report/coinReport',
        meta: { title: '智能挖矿', icon: 'bar-chart', permission: ['SystemSetting', '160'] },
        children: [
            {
            menuid: '160001',
            path: '/daily/gift/:pageNo([1-9]\\d*)?',
            name: 'gift',
            // hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
            component: () => import('@/views/daily/Gift'),
            meta: { title: '赠送记录', keepAlive: true, permission: ['160001'] }
          },
           {
            menuid: '160002',
            path: '/daily/DailyFee/:pageNo([1-9]\\d*)?',
            name: 'DailyFee',
            // hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
            component: () => import('@/views/daily/DailyFee'),
            meta: { title: '挖矿记录', keepAlive: true, permission: ['160002'] }
          },
                    {
            menuid: '160003',
            path: '/daily/feeReturn/:pageNo([1-9]\\d*)?',
            name: 'feeReturn',
            // hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
            component: () => import('@/views/daily/FeeReturn'),
            meta: { title: '手续费返回记录', keepAlive: true, permission: ['160003'] }
          },
        ]
      }

    ]
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]
/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/user',
    component: UserLayout,
    redirect: '/user/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import(/* webpackChunkName: "user" */ '@/views/users/Login')
      },

      {
        path: 'register',
        name: 'register',
        component: () => import(/* webpackChunkName: "user" */ '@/views/users/Register')
      },
      {
        path: 'register-result',
        name: 'registerResult',
        component: () => import(/* webpackChunkName: "user" */ '@/views/users/RegisterResult')
      },
      {
        path: 'recover',
        name: 'recover',
        component: undefined
      }
    ]
  },
  {
    path: '/iplimit',
    name: 'iplimit',
    component: () => import(/* webpackChunkName: "user" */ '@/views/exceptions/iplimit')
  },
  {
    path: '/404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exceptions/404')
  },
  {
    path: '/403',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exceptions/403')
  }
]
