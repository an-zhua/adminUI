import axios from '@/libs/api.request'

export const getUserInfo = () => {
  return axios.request({
    url: '/user/baseUser/info',
    method: 'get'
  })
}

export const getUserTableData = param => {
  return axios.request({
    url: '/user/baseUser/page',
    params: param,
    method: 'get'
  })
}

export const addUser = param => {
  return axios.request({
    url: '/user/baseUser/add',
    params: param,
    method: 'post'
  })
}

export const updateUser = param => {
  return axios.request({
    url: '/user/baseUser/update',
    params: param,
    method: 'post'
  })
}

export const deleteUser = param => {
  return axios.request({
    url: '/user/baseUser/delete',
    params: param,
    method: 'delete'
  })
}

export const getUnreadCount = () => {
  return axios.request({
    url: 'message/count',
    method: 'get'
  })
}

export const getMessage = () => {
  return axios.request({
    url: 'message/init',
    method: 'get'
  })
}

export const getContentByMsgId = msg_id => {
  return axios.request({
    url: 'message/content',
    method: 'get',
    params: {
      msg_id
    }
  })
}

export const hasRead = msg_id => {
  return axios.request({
    url: 'message/has_read',
    method: 'post',
    data: {
      msg_id
    }
  })
}

export const removeReaded = msg_id => {
  return axios.request({
    url: 'message/remove_readed',
    method: 'post',
    data: {
      msg_id
    }
  })
}

export const restoreTrash = msg_id => {
  return axios.request({
    url: 'message/restore',
    method: 'post',
    data: {
      msg_id
    }
  })
}
