import axios from '@/libs/api.request'

export const getServiceTableData = () => {
  return axios.request({
    url: '/manage/microservices/getList',
    method: 'get'
  })
}
