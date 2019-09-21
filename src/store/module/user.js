import {
  getUserInfo,
  getMessage,
  getContentByMsgId,
  hasRead,
  removeReaded,
  restoreTrash,
  getUnreadCount
} from '@/api/user'
import {
  login,
  logout
} from '@/api/login'
import { getUserMenu } from '@/api/routers'
import routers from '@/router/routers'
import { getStore, setStore } from '@/libs/store'
import { getMenuByRouter } from '@/libs/util'

export default {
  state: {
    // userName: '',
    // userId: '',
    avatorImgPath: '',
    userInfo: {},
    access: '',
    permissions: [],
    menuList: getStore({
      name: 'menu'
    }) || [],
    hasGetInfo: false,
    unreadCount: 0,
    messageUnreadList: [],
    messageReadedList: [],
    messageTrashList: [],
    messageContentStore: {},
    accessToken: getStore({
      name: 'access_token'
    }) || '',
    refreshToken: getStore({
      name: 'refresh_token'
    }) || '',
    expiresIn: getStore({
      name: 'expires_in'
    }) || ''
  },
  mutations: {
    setUserInfo: (state, userInfo) => {
      state.userInfo = userInfo
    },
    setAvator (state, avatorPath) {
      state.avatorImgPath = avatorPath
    },
    setUserId (state, id) {
      state.userId = id
    },
    setUserName (state, name) {
      state.userName = name
    },
    setAccess (state, access) {
      state.access = access
    },
    setPermissions (state, list) {
      state.permissions = list
    },
    setMenuList (state, list) {
      state.menuList = list
      setStore({
        name: 'menu',
        content: state.menuList,
        type: 'session'
      })
    },
    setHasGetInfo (state, status) {
      state.hasGetInfo = status
    },
    setMessageCount (state, count) {
      state.unreadCount = count
    },
    setMessageUnreadList (state, list) {
      state.messageUnreadList = list
    },
    setMessageReadedList (state, list) {
      state.messageReadedList = list
    },
    setMessageTrashList (state, list) {
      state.messageTrashList = list
    },
    updateMessageContentStore (state, { msg_id, content }) {
      state.messageContentStore[msg_id] = content
    },
    moveMsg (state, { from, to, msg_id }) {
      const index = state[from].findIndex(_ => _.msg_id === msg_id)
      const msgItem = state[from].splice(index, 1)[0]
      msgItem.loading = false
      state[to].unshift(msgItem)
    },
    setAccessToken: (state, access_token) => {
      state.accessToken = access_token
      setStore({
        name: 'access_token',
        content: state.accessToken,
        type: 'session'
      })
    },
    setRefreshToken: (state, refresh_token) => {
      state.refreshToken = refresh_token
      setStore({
        name: 'refresh_token',
        content: state.refreshToken,
        type: 'session'
      })
    },
    setExpiresIn: (state, expires_in) => {
      state.expiresIn = expires_in
      setStore({
        name: 'expires_in',
        content: state.expiresIn,
        type: 'session'
      })
    }
  },
  getters: {
    menuList: (state, getters, rootState) => getMenuByRouter(routers, rootState.user.access, rootState.user.menuList),
    messageUnreadCount: state => state.messageUnreadList.length,
    messageReadedCount: state => state.messageReadedList.length,
    messageTrashCount: state => state.messageTrashList.length,
    permissions: state => state.permissions,
    getAccessToken: state => state.accessToken,
    getRefreshToken: state => state.refreshToken
  },
  actions: {
    // 登录
    handleLogin ({ commit }, { username, password, code, randomStr }) {
      username = username.trim()
      return new Promise((resolve, reject) => {
        login({
          username,
          password,
          code,
          randomStr
        }).then(res => {
          const data = res.data
          commit('setAccessToken', data.access_token)
          commit('setRefreshToken', data.refresh_token)
          commit('setExpiresIn', data.expires_in)
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 退出登录
    handleLogOut ({ state, commit }) {
      return new Promise((resolve, reject) => {
        logout().then(res => {
          commit('setUserInfo', {})
          // commit('setUserName', '')
          // commit('setUserId', '')
          commit('setAvator', '')
          commit('setAccessToken', '')
          commit('setRefreshToken', '')
          commit('setExpiresIn', '')
          commit('setAccess', '')
          commit('setPermissions', [])
          commit('setMenuList', [])
          resolve()
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 获取用户相关信息
    getUserInfo ({ state, commit }) {
      return new Promise((resolve, reject) => {
        try {
          getUserInfo(state.token).then(res => {
            const data = res.data.data
            commit('setUserInfo', data.sysUser)
            commit('setAvator', data.sysUser.avatar)
            commit('setAccess', data.roles)
            commit('setPermissions', data.permissions)
            commit('setHasGetInfo', true)
            resolve(data)
          }).catch(err => {
            reject(err)
          })
        } catch (error) {
          reject(error)
        }
      })
    },
    getUserMenu ({ state, commit }) {
      return new Promise((resolve, reject) => {
        try {
          getUserMenu().then(res => {
            const data = res.data.data
            commit('setMenuList', data)
            resolve(data)
          }).catch(err => {
            reject(err)
          })
        } catch (error) {
          reject(error)
        }
      })
    },
    // 此方法用来获取未读消息条数，接口只返回数值，不返回消息列表
    getUnreadMessageCount ({ state, commit }) {
      getUnreadCount().then(res => {
        const { data } = res
        commit('setMessageCount', data)
      })
    },
    // 获取消息列表，其中包含未读、已读、回收站三个列表
    getMessageList ({ state, commit }) {
      return new Promise((resolve, reject) => {
        getMessage().then(res => {
          const { unread, readed, trash } = res.data
          commit('setMessageUnreadList', unread.sort((a, b) => new Date(b.create_time) - new Date(a.create_time)))
          commit('setMessageReadedList', readed.map(_ => {
            _.loading = false
            return _
          }).sort((a, b) => new Date(b.create_time) - new Date(a.create_time)))
          commit('setMessageTrashList', trash.map(_ => {
            _.loading = false
            return _
          }).sort((a, b) => new Date(b.create_time) - new Date(a.create_time)))
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 根据当前点击的消息的id获取内容
    getContentByMsgId ({ state, commit }, { msg_id }) {
      return new Promise((resolve, reject) => {
        let contentItem = state.messageContentStore[msg_id]
        if (contentItem) {
          resolve(contentItem)
        } else {
          getContentByMsgId(msg_id).then(res => {
            const content = res.data
            commit('updateMessageContentStore', { msg_id, content })
            resolve(content)
          })
        }
      })
    },
    // 把一个未读消息标记为已读
    hasRead ({ state, commit }, { msg_id }) {
      return new Promise((resolve, reject) => {
        hasRead(msg_id).then(() => {
          commit('moveMsg', {
            from: 'messageUnreadList',
            to: 'messageReadedList',
            msg_id
          })
          commit('setMessageCount', state.unreadCount - 1)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 删除一个已读消息到回收站
    removeReaded ({ commit }, { msg_id }) {
      return new Promise((resolve, reject) => {
        removeReaded(msg_id).then(() => {
          commit('moveMsg', {
            from: 'messageReadedList',
            to: 'messageTrashList',
            msg_id
          })
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 还原一个已删除消息到已读消息
    restoreTrash ({ commit }, { msg_id }) {
      return new Promise((resolve, reject) => {
        restoreTrash(msg_id).then(() => {
          commit('moveMsg', {
            from: 'messageTrashList',
            to: 'messageReadedList',
            msg_id
          })
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}
