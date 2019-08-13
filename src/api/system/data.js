import axios from '@/libs/api.request'

export const getServiceTableData = () => {
  return axios.request({
    url: '/manage/microservices/getList',
    method: 'get'
  })
};

export const addService = param => {
  return axios.request({
    url: '/manage/microservices',
    params: param,
    method: 'post'
  })
};

export const updateService = param => {
  return axios.request({
    url: '/manage/microservices/' + param.id,
    params: param,
    method: 'put'
  })
};

export const deleteService = id => {
  return axios.request({
    url: '/manage/microservices/' + id,
    method: 'delete'
  })
};

export const getConfigTableData = param => {
  return axios.request({
    url: '/manage/configProperties/getList',
    params: param,
    method: 'get'
  })
};

export const addConfig = param => {
  return axios.request({
    url: '/manage/configProperties',
    params: param,
    method: 'post'
  })
};

export const updateConfig = param => {
  return axios.request({
    url: '/manage/configProperties/' + param.id,
    params: param,
    method: 'put'
  })
};

export const deleteConfig = id => {
  return axios.request({
    url: '/manage/configProperties/' + id,
    method: 'delete'
  })
};

