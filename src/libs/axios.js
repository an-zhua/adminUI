import axios from 'axios'
import qs from 'qs'
import store from '@/store'
import router from '@/router'
import { Message } from 'iview'
import errorCode from '@/const/errorCode'
import { serialize } from '@/libs/util'
// import { Spin } from 'iview'
const addErrorLog = errorInfo => {
  const { statusText, status, request: { responseURL } } = errorInfo
  let info = {
    type: 'ajax',
    code: status,
    mes: statusText,
    url: responseURL
  }
  if (!responseURL.includes('save_error_logger')) store.dispatch('addErrorLog', info)
}

// 返回其他状态吗
axios.defaults.validateStatus = function (status) {
  return status >= 200 && status <= 507 // 默认的
}

// 跨域请求，允许保存cookie
axios.defaults.withCredentials = true

class HttpRequest {
  constructor (baseUrl = baseURL) {
    this.baseUrl = baseUrl
    this.queue = {}
  }
  getInsideConfig () {
    const config = {
      baseURL: this.baseUrl,
      headers: {
        //
      }
    }
    return config
  }
  destroy (url) {
    delete this.queue[url]
    if (!Object.keys(this.queue).length) {
      // Spin.hide()
    }
  }
  interceptors (instance, url) {
    // 请求拦截
    instance.interceptors.request.use(config => {
      // 添加全局的loading...
      if (!Object.keys(this.queue).length) {
        // Spin.show() // 不建议开启，因为界面不友好
      }
      const isToken = (config.headers || {}).isToken === false
      let token = store.state.user.accessToken
      if (token && !isToken) {
        config.headers['Authorization'] = 'Bearer ' + token// token
      }
      // headers中配置serialize为true开启序列化
      if (config.method === 'post' && config.headers.serialize) {
        config.data = serialize(config.data)
        delete config.data.serialize
      }
      // 对get请求做参数处理
      if (config.method === 'get' && config.params) {
        if (config.url.indexOf('?') === -1) {
          config.url = config.url + '?' + qs.stringify(config.params)
        } else {
          config.url = config.url + '&' + qs.stringify(config.params)
        }
        config.params = null
      }
      this.queue[url] = true
      return config
    }, error => {
      return Promise.reject(error)
    })
    // 响应拦截
    instance.interceptors.response.use(res => {
      this.destroy(url)
      const { data } = res
      const status = Number(res.status) || 200
      const message = res.data.msg || errorCode[status] || errorCode['default']
      if (status === 401) {
        Message.error(message)
        store.dispatch('handleLogOut').then(() => {
          router.push({
            name: 'login'
          })
        })
        return
      }
      if (status !== 200 || data.code === 1) {
        Message.error(message)
        return Promise.reject(new Error(message))
      }
      return { data, status }
    }, error => {
      this.destroy(url)
      let errorInfo = error.response
      if (!errorInfo) {
        const { request: { statusText, status }, config } = JSON.parse(JSON.stringify(error))
        errorInfo = {
          statusText,
          status,
          request: { responseURL: config.url }
        }
      }
      addErrorLog(errorInfo)
      return Promise.reject(error)
    })
  }
  request (options) {
    const instance = axios.create()
    options = Object.assign(this.getInsideConfig(), options)
    this.interceptors(instance, options.url)
    return instance(options)
  }
}
export default HttpRequest
