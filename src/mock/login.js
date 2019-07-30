import { getParams } from '@/libs/util'

const USER_MAP = {
  super_admin: {
    name: 'super_admin',
    user_id: '1',
    access: ['super_admin', 'admin'],
    token: 'super_admin',
    avator: 'https://file.iviewui.com/dist/a0e88e83800f138b94d2414621bd9704.png',
    permissions: ['sys_user_add', 'sys_user_edit', 'sys_user_del', 'sys_dept_add', 'sys_dept_edit', 'sys_auth_edit'],
    menuList: [{
      path: '/components',
      name: 'components',
      meta: {
        icon: 'logo-buffer',
        title: '组件'
      },
      component: 'Main',
      children: [
        {
          path: 'tree_select_page',
          name: 'tree_select_page',
          meta: {
            icon: 'md-arrow-dropdown-circle',
            title: '树状下拉选择器'
          },
          component: 'view/components/tree-select/index'
        }, {
          path: 'count_to_page',
          name: 'count_to_page',
          meta: {
            icon: 'md-trending-up',
            title: '数字渐变'
          },
          component: 'view/components/count-to/count-to'
        },
        {
          path: 'tables_page',
          name: 'tables_page',
          meta: {
            icon: 'md-grid',
            title: '多功能表格'
          },
          component: 'view/components/tables/tables'
        },
        {
          path: 'slot_table',
          name: 'slot_table',
          meta: {
            icon: 'md-grid',
            title: 'slot表格'
          },
          component: 'view/components/tables/slot-table'
        },
        {
          path: 'data_table',
          name: 'data_table',
          meta: {
            icon: 'md-grid',
            title: '数据表格'
          },
          component: 'view/components/tables/data-table'
        }
      ]
    }, {
      path: '/upms',
      name: 'upms',
      meta: {
        icon: 'md-menu',
        title: '基础管理'
      },
      component: 'Main',
      children: [
        {
          path: 'user',
          name: 'user',
          meta: {
            icon: 'md-contacts',
            title: '用户管理'
          },
          component: 'view/upms/user/user'
        },
        {
          path: 'dept',
          name: 'dept',
          meta: {
            icon: 'md-funnel',
            title: '部门管理'
          },
          component: 'view/upms/dept/dept'
        },
        {
          path: 'role',
          name: 'role',
          meta: {
            icon: 'md-hand',
            title: '角色管理'
          },
          component: 'view/upms/role/role'
        },
        {
          path: 'power',
          name: 'power',
          meta: {
            icon: 'md-hand',
            title: '权限管理'
          },
          component: 'view/upms/power/power'
        }
      ]
    }]
  },
  admin: {
    name: 'admin',
    user_id: '2',
    access: ['admin'],
    token: 'admin',
    avator: 'https://avatars0.githubusercontent.com/u/20942571?s=460&v=4'
  }
}

export const login = req => {
  req = JSON.parse(req.body)
  // return { token: USER_MAP[req.userName].token }
  return USER_MAP[req.userName]
}

export const getUserInfo = req => {
  const params = getParams(req.url)
  return USER_MAP[params.token]
}

export const logout = req => {
  return {code: 0}
}
