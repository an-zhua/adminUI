<template>
  <div>
    <Card>
      <Row>
        <Col span="6">
          <Button v-if="sys_permission_add" type="info" @click="handleAdd">新增</Button>&nbsp;
          <Button type="info" @click="getData">刷新</Button>
          <Tree ref="tree" :data="permissionTree" @on-select-change="selectTree" :render="renderContent"></Tree>
        </Col>
        <Col span="12">
          <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
            <FormItem label="父级节点" prop="parentId">
              <Input v-model="formValidate.parentId" disabled></Input>
            </FormItem>
            <FormItem label="节点ID" prop="id">
              <Input v-model="formValidate.id" disabled></Input>
            </FormItem>
            <FormItem label="名字" prop="name">
              <Input v-model="formValidate.name" placeholder="Enter your name"></Input>
            </FormItem>
            <FormItem label="标题" prop="title">
              <Input v-model="formValidate.title" placeholder="Enter your title"></Input>
            </FormItem>
            <FormItem label="序号" prop="sort">
              <InputNumber v-model="formValidate.sort" :min="1"></InputNumber>
            </FormItem>
            <FormItem label="是否删除" prop="delFlag">
              <Select v-model="formValidate.delFlag" placeholder="Select your delFlag">
                <Option value="0">否</Option>
                <Option value="1">是</Option>
              </Select>
            </FormItem>
            <FormItem label="类型" prop="type">
              <Select v-model="formValidate.type" placeholder="Select your type">
                <Option value="0">菜单</Option>
                <Option value="1">按钮</Option>
              </Select>
            </FormItem>
            <FormItem v-if="formValidate.type === '1'" :key="'permission'" label="权限标识" prop="permission">
              <Input v-model="formValidate.permission" placeholder="Enter your permission"></Input>
            </FormItem>
            <FormItem v-if="formValidate.type === '0'" label="图标" prop="icon">
              <Input v-model="formValidate.icon" placeholder="Enter your icon"></Input>
            </FormItem>
            <FormItem v-if="formValidate.type === '0'" :key="'component'" label="前端组件" prop="component">
              <Input v-model="formValidate.component" placeholder="Enter your component"></Input>
            </FormItem>
            <FormItem v-if="formValidate.type === '0'" :key="'href'" label="前端地址" prop="href">
              <Input v-model="formValidate.href" placeholder="Enter your href"></Input>
              <span style="color:green">用于跳转到外部连接</span>
            </FormItem>
            <FormItem v-if="formValidate.type === '0'" :key="'hideInMenu'" label="菜单隐藏" prop="hideInMenu">
              <Select v-model="formValidate.hideInMenu" clearable placeholder="Select your hideInMenu">
                <Option value="1">是</Option>
                <Option value="0">否</Option>
              </Select>
              <span style="color:green">设为true后在左侧菜单不会显示该页面选项</span>
            </FormItem>
            <FormItem v-if="formValidate.type === '0'" :key="'showAlways'" label="总是显示" prop="showAlways">
              <Select v-model="formValidate.showAlways" clearable placeholder="Select your showAlways">
                <Option value="1">是</Option>
                <Option value="0">否</Option>
              </Select>
              <span style="color:green">设为true后如果该路由只有一个子路由，在菜单中也会显示该父级菜单</span>
            </FormItem>
            <FormItem v-if="formValidate.type === '0'" :key="'notCache'" label="是否缓存" prop="notCache">
              <Select v-model="formValidate.notCache" clearable placeholder="Select your notCache">
                <Option value="0">缓存</Option>
                <Option value="1">不缓存</Option>
              </Select>
              <span style="color:green">设为true后页面不会缓存</span>
            </FormItem>
            <FormItem v-if="formValidate.type === '0'" :key="'access'" label="访问权限" prop="access">
              <Select v-model="formValidate.access" clearable multiple placeholder="Select your access">
                <Option v-for="item in roleList" :value="item.roleCode" :key="item.roleCode">{{ item.name }}</Option>
              </Select>
              <span style="color:green">可访问该页面的权限数组，当前路由设置的权限会影响子路由</span>
            </FormItem>
            <FormItem>
              <Button v-if="sys_permission_edit" type="primary" @click="handleSubmit('formValidate')">Submit</Button>
              <Button @click="handleReset('formValidate')" style="margin-left: 8px">Reset</Button>
            </FormItem>
          </Form>
        </Col>
      </Row>
    </Card>
  </div>
</template>

<script>
import { getPermissionTree, getRoleList, addPermission, updatePermission } from "@/api/data"
import { mapGetters } from 'vuex'
export default {
  name: "permission",
  data() {
    return {
      permissionTree: [],
      roleList: [],
      sys_permission_add: false,
      sys_permission_edit: false,
			sys_permission_del: false,
      formValidate: {
        parentId: -1,
        id: null,
        name: null,
        title: null,
        sort: 1,
        delFlag: '0',
        permission: null,
        icon: null,
        component: null,
        type: '0',
        href: null,
        hideInMenu: '0',
        showAlways: '0',
        notCache: '0',
        access: null
      },
      currentId: -1,
      ruleValidate: {
        name: [
          { required: true, message: "The name cannot be empty", trigger: "blur" }
        ],
        title: [
          { required: true, message: "The title cannot be empty", trigger: "blur" }
        ],
        type: [
          { required: true, message: "Please select type", trigger: "change" }
        ],
        sort: [
          { type: 'number', required: true, message: 'The sort cannot be empty', trigger: 'blur' }
        ],
        permission: [
          { required: true, message: "The permission cannot be empty", trigger: "blur" }
        ],
        component: [
          { required: true, message: "The component cannot be empty", trigger: "blur" }
        ]
      }
    };
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  methods: {
    getRoleList() {
      getRoleList().then(res => {
        this.roleList = res.data.data
      });
    },
    getData() {
      getPermissionTree().then(res => {
        this.permissionTree = res.data.data
      });
    },
    selectTree: function(data, node) {
      this.formValidate.parentId = node.parentId
      this.formValidate.id = node.id
      this.formValidate.name = node.name
      this.formValidate.title = node.title
      this.formValidate.sort = node.sort
      this.formValidate.delFlag = node.delFlag
      this.formValidate.permission = node.permission
      this.formValidate.icon = node.icon
      this.formValidate.component = node.component
      this.formValidate.type = node.type
      this.formValidate.href = node.href
      if( node.hideInMenu ) {
        this.formValidate.hideInMenu = '1'
      } else {
        this.formValidate.hideInMenu = '0'
      }
      if( node.showAlways ) {
        this.formValidate.showAlways = '1'
      } else {
        this.formValidate.showAlways = '0'
      }
      if( node.notCache ) {
        this.formValidate.notCache = '1'
      } else {
        this.formValidate.notCache = '0'
      }
      if(node.access && node.access.length > 0) {
        this.formValidate.access = node.access.split(',')
      } else {
        this.formValidate.access = null
      }
      this.currentId = node.id
    },
    handleAdd: function() {
      this.$refs['formValidate'].resetFields()
      this.formValidate.parentId = this.currentId
    },
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          let data = Object.assign({}, this.formValidate)
          if( this.formValidate.access && this.formValidate.access.length > 0 ) {
            data.access = JSON.stringify( this.formValidate.access )
          }
          if( this.formValidate.parentId === this.currentId ) {// 新增
            addPermission(data).then(res => {
              this.$Message.success(res.data.msg)
              this.getData()
            })
          } else {
            updatePermission(data).then(res => {
              this.$Message.success(res.data.msg)
              this.getData()
            })
          }
        } else {
          this.$Message.error("毕填项不能为空!")
        }
      });
    },
    handleReset(name) {
      this.$refs[name].resetFields()
      this.currentId = -1
    },
    renderContent(h, { root, node, data }) {
      if ( data.delFlag === '1' ) {
        let title = data.title + ' (已删除)'
        return h( "span", {
            style: {
              display: "inline-block",
              cursor: "pointer",
              color: node.node.selected ? "#2d8cf0" : "red" //根据选中状态设置样式
            },
            on: {
              click: () => {
                if (!node.node.selected) {
                  this.$refs.tree.handleSelect(node.nodeKey); //手动选择树节点
                } else {
                  node.node.selected = false
                  this.handleReset('formValidate')
                }
              }
            }
          },title)
      } else {
        return h( "span", {
            style: {
              display: "inline-block",
              cursor: "pointer",
              color: node.node.selected ? "#2d8cf0" : "#515a6e" //根据选中状态设置样式
            },
            on: {
              click: () => {
                if (!node.node.selected) {
                  this.$refs.tree.handleSelect(node.nodeKey); //手动选择树节点
                } else {
                  node.node.selected = false
                  this.handleReset('formValidate')
                }
              }
            }
          },data.title)
      }
    }
  },
  created() {
    this.getRoleList()
    this.sys_permission_add = this.permissions && this.permissions.includes('sys_permission_add')
    this.sys_permission_edit = this.permissions && this.permissions.includes('sys_permission_edit')
    this.sys_permission_del = this.permissions && this.permissions.includes('sys_permission_del')
    this.getData()
  }
};
</script>

<style scoped>
</style>
