import store from '@/store'
export default {

  // 普通日期格式化
  install (Vue) {
    Vue.prototype.$dateFormate = function (time, fmt) {
      if (time) {
        if (String(time).indexOf('-') > 0) {
          return time
        }
        var date = new Date(time)
        // var re = /(\d{4})(?:-(\d{1,2})(?:-(\d{1,2}))?)?(?:\s+(\d{1,2}):(\d{1,2}):(\d{1,2}))?/.exec(time);
        // var date = new Date(re[1],(re[2]||1)-1,re[3]||1,re[4]||0,re[5]||0,re[6]||0).getTime()/1000;
        if (/(y+)/.test(fmt)) {
          fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
        }
        let o = {
          'M+': date.getMonth() + 1,
          'd+': date.getDate(),
          'h+': date.getHours(),
          'm+': date.getMinutes(),
          's+': date.getSeconds()
        }
        // console.log(new Date(time))
        for (let k in o) {
          if (new RegExp(`(${k})`).test(fmt)) {
            let str = o[k] + ''
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : ('00' + str).substr(str.length))
          }
        }
        if (fmt.indexOf('Nan') > -1) {
          return ''
        } else {
          return fmt
        }
      } else {
        return ''
      }
    }

    // 国际化日期格式化
    Vue.prototype.$dateFormateT = function (time, fmt) {
      if (time) {
        if (String(time).indexOf('T') < 0) {
          return time
        }
        var dateee = new Date(time).toJSON()
        var date = new Date(+new Date(dateee) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
        return date
      } else {
        return ''
      }
    }

    /**
    * 判断权限
    * @param {*} data
    */
    Vue.prototype.$hasPermissions = function (data) {
      if (!data) {
        return true
      }
      let permissions = store.state.user.permissions
      if (permissions) {
        return permissions.includes(data)
      }
      return false
    }
  }
};