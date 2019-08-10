<template>
  <div>
    <Card>
      <Row>
        <Col span="6">
          <Button v-if="res_add" type="info" @click="handleAdd">新增</Button>&nbsp;
          <Button v-if="res_del" type="info" @click="handleDel">删除</Button>&nbsp;
          <Button type="info" @click="getData">刷新</Button>
          <Tree ref="tree" :data="resourceTree" @on-select-change="selectTree"></Tree>
        </Col>
        <Col span="12">
          <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
            <FormItem label="标题" prop="resName">
              <Input v-model="formValidate.resName" placeholder="请输入标题"></Input>
            </FormItem>
            <FormItem label="序号" prop="sortNum">
              <InputNumber v-model="formValidate.sortNum" :min="1"></InputNumber>
            </FormItem>
            <FormItem label="类型" prop="resType">
              <Select v-model="formValidate.resType" placeholder="请选择类型">
                <Option value="1">菜单</Option>
                <Option value="2">按钮</Option>
              </Select>
            </FormItem>
            <FormItem v-if="formValidate.resType === '2'" :key="'resCode'" label="权限标识" prop="resCode">
              <Input v-model="formValidate.resCode" placeholder="请输入权限标识"></Input>
            </FormItem>
            <FormItem v-if="formValidate.resType === '1'" label="图标" prop="icon">
              <Input v-model="formValidate.icon" placeholder="Enter your icon"></Input>
            </FormItem>
            <FormItem v-if="formValidate.resType === '1'" :key="'path'" label="前端路由" prop="path">
              <Input v-model="formValidate.path" placeholder="请输入前端路由"></Input>
            </FormItem>
            <FormItem v-if="formValidate.resType === '1'" :key="'component'" label="前端组件" prop="component">
              <Input v-model="formValidate.component" placeholder="请输入前端组件地址"></Input>
            </FormItem>
            <FormItem>
              <Button v-if="res_edit" type="primary" @click="handleSubmit('formValidate')">提交</Button>
              <Button @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
            </FormItem>
          </Form>
        </Col>
      </Row>
    </Card>
  </div>
</template>

<script>
import { getMenuTree, addMenu, updateMenu } from '@/api/data'
import { mapGetters } from 'vuex'
export default {
  name: 'menu',
  data () {
    return {
      resourceTree: [],
      roleList: [],
      res_add: false,
      res_edit: false,
      res_del: false,
      formValidate: {
        parentId: -1,
        id: null,
        resName: null,
        sortNum: 1,
        resCode: null,
        icon: null,
        component: null,
        resType: '1',
        path: null
      },
      currentId: -1,
      ruleValidate: {
        resName: [
          { required: true, message: '标题不能为空', trigger: 'blur' }
        ],
        resType: [
          { required: true, message: '类型不能为空', trigger: 'change' }
        ],
        sortNum: [
          { type: 'number', required: true, message: '序号不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  methods: {
    getData () {
      getMenuTree().then(res => {
        this.resourceTree = res.data.data
      })
    },
    selectTree: function (data, node) {
      this.formValidate.parentId = node.parentId
      this.formValidate.id = node.id
      this.formValidate.resName = node.title
      this.formValidate.sortNum = node.sort
      this.formValidate.resCode = node.resCode
      this.formValidate.icon = node.icon
      this.formValidate.component = node.component
      this.formValidate.resType = node.type
      this.formValidate.path = node.path
      this.currentId = node.id
    },
    handleAdd: function () {
      this.$refs['formValidate'].resetFields()
      this.formValidate.parentId = this.currentId
    },
    handleDel: function () {

    },
    handleSubmit (name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          let data = Object.assign({}, this.formValidate)
          if (this.formValidate.parentId === this.currentId) { // 新增
            addMenu(data).then(res => {
              this.$Message.success(res.data.msg)
              this.getData()
            })
          } else {
            updateMenu(data).then(res => {
              this.$Message.success(res.data.msg)
              this.getData()
            })
          }
        } else {
          this.$Message.error('毕填项不能为空!')
        }
      })
    },
    handleReset (name) {
      this.$refs[name].resetFields()
      this.currentId = -1
    }
  },
  created () {
    this.res_add = this.permissions && this.permissions.includes('res_add')
    this.res_edit = this.permissions && this.permissions.includes('res_edit')
    this.res_del = this.permissions && this.permissions.includes('res_del')
    this.getData()
  }
}
</script>

<style scoped>
</style>
