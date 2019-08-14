
export const formatDate = (date, fmt)  => {
  date = new Date(date)
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
  return fmt
}

export const baseIs = (h, params) => {
  if (params === 1) {
    return h('span', [h('span', {style: {color: '#0d8c12'}}, '是')])
  } else {
    return h('span', [h('span', {style: {color: '#a5a5a5'}}, '否')])
  }
}

