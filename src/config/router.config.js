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
            menuid: '107006',
            path: '/systems/handselcoinconfig/:pageNo([1-9]\\d*)?',
            name: 'HandselConfig',
            // hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
            component: () => import('@/views/systemsettings/HandselConfig'),
            meta: { title: '注册赠送配置', keepAlive: false, permission: ['SystemSetting', '107006'] }
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
      
        ]
      },


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
