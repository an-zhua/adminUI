import axios from '@/libs/api.request'

export const getDeptList = () => {
  return axios.request({
    url: 'user/sysDept/getDeptList',
    method: 'get'
  })
}

export const getDeptTableData = param => {
  return axios.request({
    url: 'user/sysDept/page',
    params: param,
    method: 'get'
  })
}

export const getRoleTableData = param => {
  return axios.request({
    url: 'user/baseRole/page',
    params: param,
    method: 'get'
  })
}

export const getRoleList = () => {
  return axios.request({
    url: 'user/baseRole/getRoleList',
    method: 'get'
  })
}

export const addRole = param => {
  return axios.request({
    url: 'user/baseRole/add',
    params: param,
    method: 'post'
  })
}

export const updateRole = param => {
  return axios.request({
    url: 'user/baseRole/update',
    params: param,
    method: 'post'
  })
}

export const deleteRole = param => {
  return axios.request({
    url: 'user/baseRole/delete',
    params: param,
    method: 'delete'
  })
}

export const updateRoleAuth = param => {
  return axios.request({
    url: 'user/baseRole/updateRoleAuth',
    params: param,
    method: 'post'
  })
}

export const getMenuTree = param => {
  return axios.request({
    url: 'user/baseResources/getMenuTree',
    params: param,
    method: 'get'
  })
}

export const getAuthTree = param => {
  return axios.request({
    url: 'user/baseResources/getAuthTree',
    params: param,
    method: 'get'
  })
}

export const addMenu = param => {
  return axios.request({
    url: 'user/baseResources/addMenu',
    params: param,
    method: 'post'
  })
}

export const updateMenu = param => {
  return axios.request({
    url: 'user/baseResources/updateMenu',
    params: param,
    method: 'post'
  })
}

export const deleteMenu = id => {
  return axios.request({
    url: 'user/baseResources/delete/' + id,
    method: 'delete'
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
