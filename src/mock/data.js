import Mock from 'mockjs'
import { doCustomTimes } from '@/libs/util'
import orgData from './data/org-data'
import { treeData } from './data/tree-select'
const Random = Mock.Random

export const getTableData = req => {
  let tableData = []
  let body = JSON.parse(req.body)
  let size = body.pageSize ? body.pageSize : 10
  doCustomTimes(size, () => {
    tableData.push(Mock.mock({
      name: '@name',
      email: '@email',
      createTime: '@date'
    }))
  })
  return tableData
}

export const getUserTableData = req => {
  let tableData = []
  let body = JSON.parse(req.body)
  let size = body.pageSize ? body.pageSize : 10
  doCustomTimes(size, () => {
    tableData.push(Mock.mock({
      name: '@name',
      email: '@email',
      phone: /^1[385][1-9]\d{8}/,
      createTime: '@date',
      desc: Random.image('200x200', '#50B347', '#FFF', 'Mock.js')
    }))
  })
  let res = {
    data: tableData,
    total: 100
  }
  return res
}

export const getDeptTableData = req => {
  let tableData = []
  let body = JSON.parse(req.body)
  let size = body.pageSize ? body.pageSize : 10
  doCustomTimes(size, () => {
    tableData.push(Mock.mock({
      name: '@name',
      createTime: '@date'
    }))
  })
  let res = {
    data: tableData,
    total: 50
  }
  return res
}

export const getRoleTableData = req => {
  let tableData = []
  let body = JSON.parse(req.body)
  let size = body.pageSize ? body.pageSize : 10
  doCustomTimes(size, () => {
    tableData.push(Mock.mock({
      name: '@name',
      createTime: '@date'
    }))
  })
  let res = {
    data: tableData,
    total: 50
  }
  return res
}

export const getDragList = req => {
  let dragList = []
  doCustomTimes(5, () => {
    dragList.push(Mock.mock({
      name: Random.csentence(10, 13),
      id: Random.increment(10)
    }))
  })
  return dragList
}

export const uploadImage = req => {
  return Promise.resolve()
}

export const getOrgData = req => {
  return orgData
}

export const getTreeSelectData = req => {
  return treeData
}

export const getPowerTreeData = req => {
  let treeData = [
    {
      id: 1,
      title: '权限管理',
      expand: true,
      children: [
        {
          id: 2,
          title: '用户管理',
          expand: true,
          children: [
            {
              id: 3,
              title: '用户新增'
            },
            {
              id: 4,
              title: '用户修改'
            },
            {
              id: 5,
              title: '用户删除'
            }
          ]
        },
        {
          id: 6,
          title: '部门管理',
          expand: true,
          children: [
            {
              id: 7,
              title: '部门新增'
            },
            {
              id: 8,
              title: '部门修改'
            }
          ]
        }
      ]
    },
    {
      title: '组件',
      expand: true
    }
  ]
  return treeData
}
