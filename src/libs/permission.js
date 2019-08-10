import store from '@/store'

/**
* 判断权限
* @param {*} data
*/
export default function hasPermissions (data) {
  if (!data) {
    return true
  }
  let permissions = store.state.user.permissions
  if (permissions) {
    return permissions.includes(data)
  }
  return false
}
