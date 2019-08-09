export default {
  state: {
    dateResult: null,
    baseIsResult: null
    //
  },
  mutations: {
    formatDate (state, { date, fmt }) {
      date = new Date(date)
      console.log(date)
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
      for (let k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
          let str = o[k] + ''
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : ('00' + str).substr(str.length))
        }
      }
      state.dateResult = fmt
    },

    baseIs (state, { h, params }) {
      if (params === '1') {
        state.baseIsResult = h('span', [h('span', { style: { color: '#0d8c12' } }, '是')])
        return h('span', [h('span', { style: { color: '#0d8c12' } }, '是')])
      } else {
        state.baseIsResult = h('span', [h('span', { style: { color: '#a5a5a5' } }, '否')])
        return h('span', [h('span', { style: { color: '#a5a5a5' } }, '否')])
      }
    }

  },
  actions: {
    //
  },
  getters () {

  }
}
