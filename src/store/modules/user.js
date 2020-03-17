import Vue from 'vue'
import { login } from '@/api'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import notification from 'ant-design-vue/es/notification'
const user = {
  state: {
    id: '',
    userName: '',
    nickName: '',
    token: '',
    avatar: '',
    roles: [], // 角色标识集合
    menuTree: [],
    executedLoadPermissionFromBackend: false, // 是否已执行过从后台加载用户权限信息的web api
    funPermissions: [], // 功能标识集合(权限标识集合)
    routerPermissions: [] // 菜单标识集合(路由name集合)
  },
  mutations: {
    SET_EXECUTED_LOAD_PERMISSION_FROM_BACKEND (state, executedLoadPermissionFromBackend) {
      state.executedLoadPermissionFromBackend = executedLoadPermissionFromBackend
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NICK_NAME: (state, nickName) => {
      state.nickName = nickName
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_USERID: (state, id) => {
      state.id = id
    },
    SET_MENU_TREE (state, menuTree) {
      state.menuTree = menuTree
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_FUN_PERMISSIONS: (state, funPermissions) => {
      state.funPermissions = funPermissions
    },
    SET_ROUTER_PERMISSIONS: (state, routerPermissions) => {
      state.routerPermissions = routerPermissions
    }
  },
  actions: {
    Login ({ commit }, params) {
      return new Promise((resolve, reject) => {
        login.userLogin(params)
          .then((res) => {
            console.log(res)
            if (res.header.status === 'SUCCESS') {
              Vue.ls.set(ACCESS_TOKEN, res.body.accessToken, 4 * 60 * 60 * 1000) // 4小时
              commit('SET_TOKEN', res.body.accessToken)
              resolve(res)
            } else {
              notification.error({
                message: '错误',
                duration: 4.5,
                description: res.header.statusMsg
              })
              reject(res)
            }
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
    Logout ({ commit, params }) {
      return new Promise((resolve, reject) => {
        login.userLogout(params)
          .then((res) => {
            if (res.header.status === 'SUCCESS') {
              commit('SET_TOKEN', '')
              commit('SET_MENU_TREE', [])
              commit('SET_EXECUTED_LOAD_PERMISSION_FROM_BACKEND', false)
              commit('SET_ROLES', [])
              commit('SET_FUN_PERMISSIONS', [])
              commit('SET_ROUTER_PERMISSIONS', [])
              Vue.ls.remove(ACCESS_TOKEN)
              resolve(res)
            } else {
              notification.error({
                message: '错误',
                duration: 4.5,
                description: res.header.statusMsg
              })
              reject(res)
            }
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
    GetInfo ({ commit, params }) {
      return new Promise((resolve, reject) => {
        // 临时本地菜单
        let res = {
          id: 'YS10012',
          nickName: '鹰视专家',
          email: 'zhangjt@inspower.cn',
          avatar: 'http://dummyimage.com/200x200',
          city: '佛山市',
          menuPermissionList: ['entry'],
          menuTree: [
            {
              id: 'a1',
              path: '/entry',
              title: '首页入口',
              icon: 'iconfont icon-overviews',
              flag: 'entry'
            },
            {
              id: 'a2',
              path: '/unit',
              title: '单元',
              icon: 'iconfont icon-overviews',
              flag: 'entry'
            }
          ],
          funPermissionList: [],
          roleList: []
        }
        commit('SET_EXECUTED_LOAD_PERMISSION_FROM_BACKEND', true)
        commit('SET_ROLES', res.roleList)
        commit('SET_FUN_PERMISSIONS', res.funPermissionList)
        commit('SET_ROUTER_PERMISSIONS', res.menuPermissionList)
        commit('SET_MENU_TREE', res.menuTree)
        commit('SET_NICK_NAME', res.nickName) // 用户姓名
        commit('SET_AVATAR', res.avatar)
        commit('SET_USERID', res.id)
        resolve(res)

        // login.getInfo(params)
        //   .then((res) => {
        //     // 设置用户动态菜单, 数据结构不一样的可以在这里进行转换, 转换成功完成之后, 再执行下面的`SET_MENU_TREE`方法
        //     // console.log('GetInfo', res)
        //     commit('SET_EXECUTED_LOAD_PERMISSION_FROM_BACKEND', true)
        //     commit('SET_ROLES', res.roleList)
        //     commit('SET_FUN_PERMISSIONS', res.funPermissionList)
        //     commit('SET_ROUTER_PERMISSIONS', res.menuPermissionList)
        //     commit('SET_MENU_TREE', res.menuTree)
        //     commit('SET_NICK_NAME', res.nickName) // 用户姓名
        //     commit('SET_AVATAR', res.avatar)
        //     commit('SET_USERID', res.id)
        //     resolve(res)
        //   })
        //   .catch((err) => {
        //     reject(err)
        //   })
      })
    }
  }
}

export default user
