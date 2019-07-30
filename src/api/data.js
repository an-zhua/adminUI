import axios from '@/libs/api.request'

export const getDeptList = () => {
  return axios.request({
    url: '/admin/sysDept/getDeptList',
    method: 'get'
  })
}

export const getDeptTableData = param => {
  return axios.request({
    url: '/admin/sysDept/page',
    params: param,
    method: 'get'
  })
}

export const getRoleTableData = param => {
  return axios.request({
    url: '/admin/sysRole/page',
    params: param,
    method: 'get'
  })
}

export const getRoleList = () => {
  return axios.request({
    url: '/admin/sysRole/getRoleList',
    method: 'get'
  })
}

export const addRole = param => {
  return axios.request({
    url: '/admin/sysRole/add',
    params: param,
    method: 'post'
  })
}

export const updateRole = param => {
  return axios.request({
    url: '/admin/sysRole/update',
    params: param,
    method: 'post'
  })
}

export const deleteRole = id => {
  return axios.request({
    url: '/admin/sysRole/delete/' + id,
    method: 'delete'
  })
}

export const updateRoleAuth = param => {
  return axios.request({
    url: '/admin/sysRole/updateRoleAuth',
    params: param,
    method: 'post'
  })
}

export const getPermissionTree = param => {
  return axios.request({
    url: '/admin/sysPermission/getTree',
    params: param,
    method: 'get'
  })
}

export const getAuthTree = param => {
  return axios.request({
    url: '/admin/sysPermission/getAuthTree',
    params: param,
    method: 'get'
  })
}

export const addPermission = param => {
  return axios.request({
    url: '/admin/sysPermission/add',
    params: param,
    method: 'post'
  })
}

export const updatePermission = param => {
  return axios.request({
    url: '/admin/sysPermission/update',
    params: param,
    method: 'post'
  })
}

export const getDragList = () => {
  return axios.request({
    url: 'get_drag_list',
    method: 'get'
  })
}

export const errorReq = () => {
  return axios.request({
    url: 'error_url',
    method: 'post'
  })
}

export const saveErrorLogger = info => {
  return axios.request({
    url: 'save_error_logger',
    data: info,
    method: 'post'
  })
}

export const uploadImg = formData => {
  return axios.request({
    url: 'image/upload',
    data: formData
  })
}

export const getOrgData = () => {
  return axios.request({
    url: 'get_org_data',
    method: 'get'
  })
}

export const getTreeSelectData = () => {
  return axios.request({
    url: 'get_tree_select_data',
    method: 'get'
  })
}
