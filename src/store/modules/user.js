import storage from 'store'
import expirePlugin from 'store/plugins/expire'
import {
  login,
  // getInfo,
  logout
} from '@/api/login'
import { getCurrencyList } from '@/api/systemsetting'
import { getMenus, getMenus2 } from '@/api/manage'
import { ACCESS_TOKEN, USER_NAME } from '@/store/mutation-types'
import { setCookies, removeCookies } from '@/utils/auth'
import { welcome, savingTime, getPermissionIdOrTitle, loadMyPermissionlist } from '@/utils/util'
import defaultSettings from '@/config/defaultSettings'
// import { roleObj } from './user-role' // 静态权限，待迭代
import { saveMyPermissionlist } from '../../utils/util'

storage.addPlugin(expirePlugin)

const { version } = defaultSettings

const user = {
  state: {
    token: '',
    name: '',
    username: '',
    welcome: '',
    avatar: '',
    currencylist: [],
    roles: [],
    info: {}
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, { name, welcome }) => {
      state.name = name
      state.welcome = welcome
    },
    SET_USERNAME: (state, { name, welcome }) => {
      state.username = name
      state.welcome = welcome
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_INFO: (state, info) => {
      state.info = info
    },
    SET_CURRENCY: (state, currency) => {
      state.currencylist = currency
    }
  },

  actions: {
    // 登录 commit
    Login({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo)
          .then((response) => {
            const { code, data } = response
            if (code === 0) {
              // 返回匹配的管理员列表
              const ds = data
              // 设置缓存
              storage.set(ACCESS_TOKEN, ds.token, savingTime())
              commit('SET_TOKEN', ds.token)
              storage.set(USER_NAME, ds.username, savingTime())
              commit('SET_USERNAME', { name: ds.username, welcome: welcome() })
              setCookies('username', ds.username)
              setCookies('token', ds.token)
              if (ds.limitlist) {
                saveMyPermissionlist(ds.limitlist)
                loadMyPermissionlist()
              }
            } else {
              reject(response)
            }
            resolve(response)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },

    // 获取用户信息
    GetInfo({ commit }) {
      return new Promise((resolve, reject) => {
        // 请求后端获取用户信息 /api/user/info
        // 后续迭代的时候再补充权限
        const username = storage.get(USER_NAME)
        const token = storage.get(ACCESS_TOKEN)
        if (username && token) {
          const user = {
            username: username,
            roleId: 'admin',
            role: {} // roleObj
          }
          // 获取路由列表
          if (version === '1.0') {
            // 旧版路由
            getMenus({ token, username })
              .then((res) => {
                const timeZone = res.TIME_ZONE
                sessionStorage.setItem('timeZone', timeZone)
                if (res.contentManagement) {
                  const role = {
                    id: 'admin',
                    name: '管理员',
                    describe: '拥有权限',
                    creatorId: 'system',
                    permissions: []
                  }
                  // 权限
                  res.contentManagement.map((permission) => {
                    const { title, children } = permission

                    const permissionId = getPermissionIdOrTitle(title)
                    role.permissions.push(permissionId)
                    if (children) {
                      children.map((child) => {
                        const { title } = child
                        const permissionId = getPermissionIdOrTitle(title)
                        role.permissions.push(permissionId)
                      })
                    }
                  })
                  // role.permissionList = role.permissions.map(per => { return per.permissionId })
                  role.permissionList = role.permissions
                  //   role.permissionList.push('Home')
                  role.permissionList.unshift('Home') // 全局首页 改成放在第一个
                  // 覆盖响应体的 role, 供下游使用
                  user.role = role

                  // 全量权限
                  commit('SET_ROLES', role)
                  commit('SET_INFO', user)
                  commit('SET_NAME', { name: user.username, welcome: welcome() })
                  commit('SET_USERNAME', { name: user.username, welcome: welcome() })
                  resolve(user)
                } else {
                  reject(new Error('getInfo: roles must be a non-null array !'))
                }
              })
              .catch((err) => {
                console.log(err)
                reject(new Error(err))
              })
          } else {
            // 新版路由
            getMenus2({ token, username })
              .then((res) => {
                console.log('新版路由', res)
                const { code, data } = res
                if (code === '0') {
                  const role = {
                    id: 'admin',
                    name: '管理员',
                    describe: '拥有权限',
                    creatorId: 'system',
                    // status: 1,
                    // deleted: 0,
                    permissions: []
                  }

                  // role.permissions = data
                  data.map((permission) => {
                    const { menuid, children } = permission
                    // const permissionId = getPermissionIdByTitle(title)
                    // const per = {
                    //   roleId: 'admin',
                    //   permissionId: permissionId,
                    //   permissionName: title,
                    //   children
                    // }
                    // return per
                    role.permissions.push(menuid)
                    children.map((child) => {
                      const { menuid } = child
                      role.permissions.push(menuid)
                    })
                  })
                  // role.permissionList = role.permissions.map(per => { return per.menuid })
                  role.permissionList = role.permissions
                  role.permissionList.push('Home') // 全局首页
                  // 覆盖响应体的 role, 供下游使用
                  user.role = role

                  // 全量权限
                  commit('SET_ROLES', role)
                  commit('SET_INFO', user)
                  commit('SET_NAME', { name: user.username, welcome: welcome() })
                  commit('SET_USERNAME', { name: user.username, welcome: welcome() })
                  resolve(user)
                } else {
                  reject(new Error('getInfo: roles must be a non-null array !'))
                }

                // if (res.contentManagement) {
                //   const role = {
                //     id: 'admin',
                //     name: '管理员',
                //     describe: '拥有权限',
                //     creatorId: 'system',
                //     // status: 1,
                //     // deleted: 0,
                //     permissions: []
                //   }
                //   // 权限
                //   role.permissions = res.contentManagement.map(permission => {
                //     const { title, children } = permission
                //     const permissionId = getPermissionIdByTitle(title)
                //     const per = {
                //       roleId: 'admin',
                //       permissionId: permissionId,
                //       permissionName: title,
                //       children
                //     }
                //     return per
                //   })
                //   role.permissionList = role.permissions.map(per => { return per.permissionId })
                //   role.permissionList.push('Dashboard') // 全局首页
                //   // 覆盖响应体的 role, 供下游使用
                //   user.role = role
                //
                //   // 全量权限
                //   commit('SET_ROLES', role)
                //   commit('SET_INFO', user)
                //   commit('SET_NAME', { name: user.username, welcome: welcome() })
                //   commit('SET_USERNAME', { name: user.username, welcome: welcome() })
                //   resolve(user)
                // } else {
                //   reject(new Error('getInfo: roles must be a non-null array !'))
                // }

                // const role = { ...user.role }
                // role.permissions = user.role.permissions.map(permission => {
                //   const per = {
                //     ...permission,
                //     actionList: (permission.actionEntitySet || {}).map(item => item.action)
                //   }
                //   return per
                // })
                // role.permissionList = role.permissions.map(permission => { return permission.permissionId })
                // // 覆盖响应体的 role, 供下游使用
                // user.role = role

                // // 全量权限
                // commit('SET_ROLES', role)
                // commit('SET_INFO', user)
                // commit('SET_NAME', { name: user.username, welcome: welcome() })
                // commit('SET_USERNAME', { name: user.username, welcome: welcome() })
                // resolve(user)
              })
              .catch((err) => {
                console.log(err)
                reject(new Error(err))
              })
          }
        } else {
          reject(new Error('getInfo: roles must be a non-null array !'))
        }
      })
    },

    // 获取币种
    GetCurrency({ commit }) {
      return new Promise((resolve, reject) => {
        // console.log('Get Currency')
        getCurrencyList({ page: 1, pageSize: 100 }).then((res) => {
          // console.log(res)
          const { code, msg, data } = res
          if (code === 0) {
            // console.log(data)
            // 全量权限
            commit(
              'SET_CURRENCY',
              data.records.map((e) => {
                return {
                  coin: e.coin,
                  symbol: e.symbol,
                  blockname: e.blockname,
                  autoid: e.autoid,
                  klineType: e.klineType
                }
              })
            )
          } else {
            this.$message.error(msg)
          }
        })
        resolve()
      })
    },

    // 登出
    Logout({ commit, state }) {
      return new Promise((resolve) => {
        if (version === '1.0') {
          commit('SET_TOKEN', '')
          commit('SET_USERNAME', '')
          commit('SET_ROLES', [])
          commit('SET_INFO', {})
          storage.remove(ACCESS_TOKEN)
          storage.remove(USER_NAME)
          storage.remove('token')
          storage.remove('persission')
          loadMyPermissionlist()
          removeCookies('token')
          removeCookies('username')
          resolve()
        } else {
          logout(state.token)
            .then(() => {
              commit('SET_TOKEN', '')
              commit('SET_USERNAME', '')
              commit('SET_ROLES', [])
              commit('SET_INFO', {})
              storage.remove(ACCESS_TOKEN)
              storage.remove(USER_NAME)
              storage.remove('token')
              storage.remove('persission')
              loadMyPermissionlist()
              resolve()
            })
            .catch((err) => {
              console.log('logout fail:', err)
              // resolve()
            })
            .finally(() => {})
        }
      })
    }
  }
}

export default user
