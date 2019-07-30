import axios from '@/libs/api.request'
const scope = 'server'

export const login = ({ username, password }) => {
  const grant_type = 'password'
  const data = {
    username,
    password,
    grant_type,
    scope
  }
  return axios.request({
    url: '/auth/oauth/token',
    headers: {
      isToken: false,
      'Authorization': 'Basic bG95YWw6bG95YWw='
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
