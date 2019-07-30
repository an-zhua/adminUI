let RouterPlugin = function () {
  this.$router = null
  this.$store = null
}
RouterPlugin.install = function (router, store) {
  this.$router = router
  this.$store = store

  // eslint-disable-next-line no-unused-vars
  function objToform (obj) {
    let result = []
    Object.keys(obj).forEach(ele => {
      result.push(`${ele}=${obj[ele]}`)
    })
    return result.join('&')
  }
  this.$router.$avueRouter = {
    // 全局配置
    $website: this.$store.getters.config,
    $defaultTitle: this.$store.getters.config.title,
    routerList: [],
    routerAdded: [],
    group: '',
    safe: this,
    // 设置标题
    setTitle: function (title) {
      title = title ? `${title}——${this.$defaultTitle}` : this.$defaultTitle
      document.title = title
    },
    // 正则处理路由
    vaildPath: function (list, path) {
      let result = false
      list.forEach(ele => {
        if (new RegExp('^' + ele + '.*', 'g').test(path)) {
          result = true
        }
      })
      return result
    },
    // 设置路由值
    getValue: function (route) {
      let value = ''
      if (route.query.src) {
        value = route.query.src
      } else {
        value = route.path
      }
      return value
    },
    // 动态路由
    formatRoutes: function (aMenu = [], first) {
      const aRouter = []
      const propsConfig = this.$website.menu.props
      const propsDefault = {
        name: propsConfig.name || 'name',
        path: propsConfig.path || 'path',
        children: propsConfig.children || 'children',
        meta: propsConfig.meta || 'meta'
      }
      if (!aMenu || aMenu.length === 0) return
      for (let i = 0; i < aMenu.length; i++) {
        const oMenu = aMenu[i]
        if (this.routerAdded.includes(oMenu[propsDefault.path])) return
        const name = oMenu[propsDefault.name]
        const path = oMenu[propsDefault.path]
        const component = oMenu.component
        const children = oMenu[propsDefault.children]
        const isChild = children && children.length !== 0
        const meta = oMenu[propsDefault.meta]

        const oRouter = {
          name: name,
          path: path,
          meta: meta,
          component (resolve) {
            if (!component) {
              require(['@/view/single-page/home'], resolve)
            } else if (component === 'Main') {
              require(['@/components/main'], resolve)
            } else {
              require([`@/${component}.vue`], resolve)
            }
          },
          // component: () => import('@/view/single-page/message/index.vue'),
          // 处理是否为一级路由
          children: !isChild ? (() => {
            if (first) {
              oMenu[propsDefault.path] = path
              return [{
                component (resolve) { require([`@/${component}.vue`], resolve) },
                name: name,
                meta: meta,
                path: path
              }]
            }
            return []
          })() : (() => {
            return this.formatRoutes(children, false)
          })()
        }
        aRouter.push(oRouter)
      }
      if (first) {
        if (!this.routerAdded.includes(aRouter[0][propsDefault.path])) {
          this.safe.$router.addRoutes(aRouter)
          this.routerList = Object.assign([], this.routerList, aRouter)
          this.routerAdded.push(aRouter[0][propsDefault.path])
        }
      } else {
        return aRouter
      }
    }
  }
}
export default RouterPlugin
