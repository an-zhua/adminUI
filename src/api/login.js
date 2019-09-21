import axios from '@/libs/api.request'
const scope = 'server'

export const login = ({ username, password, code, randomStr }) => {
  const grant_type = 'password'
  const data = {
    username,
    password,
    code,
    grant_type,
    scope,
    randomStr
  }
  return axios.request({
    url: '/auth/oauth/token',
    headers: {
      isToken: false,
      'Authorization': 'Basic bWFwbGU6bWFwbGU='
    },
    params: data,
    method: 'post'
  })
}

export const logout = () => {
  return axios.request({
    url: '/auth/token/logout',
    method: 'get'
  })
}
