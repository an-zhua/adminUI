<template>
  <div>
    <Card>
      <Form ref="searchMap" :model="searchMap" inline :label-width="100">
        <FormItem label="用户名" prop="username">
          <Input clearable placeholder="输入用户名搜索" v-model="searchMap.username"/>
        </FormItem>
        <FormItem label="创建日期">
          <Row>
            <Col span="11">
              <FormItem prop="createTimeS">
                  <DatePicker type="date" placeholder="Select date" v-model="searchMap.createTimeS"></DatePicker>
              </FormItem>
            </Col>
            <Col span="2" style="text-align: center">-</Col>
            <Col span="11">
              <FormItem prop="createTimeE">
                  <DatePicker type="date" placeholder="Select date" v-model="searchMap.createTimeE"></DatePicker>
              </FormItem>
            </Col>
          </Row>
        </FormItem>
        <FormItem>
          <Button @click="getData" type="primary">
            <Icon type="search"/>&nbsp;&nbsp;搜索
          </Button>
          <Button @click="handleReset('searchMap')" style="margin-left: 8px">重置</Button>
        </FormItem>
      </Form>
      <div style="padding-bottom:10px">
        <ButtonGroup>
          <Button v-if="sys_user_add" type="info" @click="add">新增</Button>
          <Button v-if="sys_user_edit" type="success" @click="edit">修改</Button>
          <Button v-if="sys_user_del" type="warning" @click="del">删除</Button>
        </ButtonGroup>
      </div>
      <Table
        ref="table"
        stripe
        :columns="columns"
        :loading="tableLoading"
        :data="tableData"
        :height="tableHeight"
        @on-selection-change="handleSelection"
      ></Table>
      <div style="padding-top:10px; height:40px;">
        <div style="float: right">
          <Page
            :total="pageInfo.total"
            :page-size="pageInfo.size"
            show-elevator
            show-sizer
            show-total
            @on-change="pageChange"
            @on-page-size-change="pageSizeChange"
          />
        </div>
      </div>
    </Card>
    <div>
      <Modal
        v-model="formModal"
        :title="title"
        :loading="modalLoading"
        :mask-closable="false"
        @on-ok="handleSubmit('formValidate')"
        @on-cancel="handleReset('formValidate')"
      >
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
          <FormItem label="姓名" prop="name">
            <Input v-model="formValidate.name" placeholder="Enter your name"></Input>
          </FormItem>
          <FormItem label="用户名" prop="username">
            <Input v-model="formValidate.username" placeholder="Enter your username"></Input>
          </FormItem>
          <FormItem label="邮箱" prop="mail">
            <Input v-model="formValidate.mail" placeholder="Enter your e-mail"></Input>
          </FormItem>
          <FormItem label="生日" prop="date">
            <Row>
              <Col span="11">
                <DatePicker type="date" placeholder="Select date" v-model="formValidate.date"></DatePicker>
              </Col>
            </Row>
          </FormItem>
          <FormItem label="性别" prop="gender">
            <RadioGroup v-model="formValidate.gender">
              <Radio label="male">Male</Radio>
              <Radio label="female">Female</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="部门" prop="deptId">
            <Select v-model="formValidate.deptId" clearable style="width:200px">
              <Option v-for="item in deptList" :value="item.id" :key="item.id">{{ item.name }}</Option>
            </Select>
          </FormItem>
          <FormItem label="简介" prop="avatar">
            <Input
              v-model="formValidate.avatar"
              type="textarea"
              :autosize="{minRows: 2,maxRows: 5}"
              placeholder="Enter something..."
            ></Input>
          </FormItem>
        </Form>
      </Modal>
    </div>
  </div>
</template>
<script>
import Tables from '_c/tables'
import { getUserTableData } from '@/api/user'
import { getDeptList } from '@/api/data'
import { mapGetters } from 'vuex'
export default {
  name: 'user',
  components: {
    Tables
  },
  data () {
    return {
      tableHeight: 300,
      tableLoading: true,
      modalLoading: true,
      columns: [
        { type: 'selection', width: 60, align: 'center' },
        { type: 'index', width: 60, align: 'center' },
        { title: '姓名', key: 'name', sortable: true, width: 120 },
        { title: '用户名', key: 'username', sortable: true, width: 120 },
        { title: '手机号', key: 'phone', width: 120 },
        { title: '邮箱', key: 'email', width: 150 },
        { title: '部门', key: 'deptName', width: 100 },
        { title: '微信_openid', key: 'wxOpenid', width: 250 },
        { title: 'QQ_openid', key: 'qqOpenid', width: 250 },
        { title: '锁定标志', key: 'lockFlag', width: 100,
          render: (h, params) => {
            if (params.row.lockFlag == '1') {
              return h('span', [
                h('span', {
                  style: {
                    color: 'red'
                  }
                }, '已锁定')
              ])
            } else {
              return h('span', '未锁定')
            }
          } 
        },
        { title: '删除标志', key: 'delFlag', width: 100,
          render: (h, params) => {
            if (params.row.delFlag == '1') {
              return h('span', [
                h('span', {
                  style: {
                    color: 'red'
                  }
                }, '已删除')
              ])
            } else {
              return h('span', '未删除')
            }
          } 
        },
        { title: '创建日期', key: 'createTime', width: 160 }
      ],
      tableData: [],
      selectionData: [],
      sys_user_add: false,
      sys_user_edit: false,
      sys_user_del: false,
      formModal: false,
      pageInfo: {
        total: 0,
        current: 1,
        size: 10
      },
      searchMap: {
        username: '',
        createTimeS: '',
        createTimeE: ''
      },
      title: '',
      deptList: [],
      formValidate: {
        name: '',
        username: '',
        mail: '',
        gender: '',
        deptId: '',
        date: '',
        avatar: ''
      },
      ruleValidate: {
        name: [
          {
            required: true,
            message: 'The name cannot be empty',
            trigger: 'blur'
          }
        ],
        username: [
          {
            required: true,
            message: 'The username cannot be empty',
            trigger: 'blur'
          }
        ],
        mail: [
          {
            required: true,
            message: 'Mailbox cannot be empty',
            trigger: 'blur'
          },
          { type: 'email', message: 'Incorrect email format', trigger: 'blur' }
        ],
        gender: [
          { required: true, message: 'Please select gender', trigger: 'change' }
        ],
        deptId: [
          {
            type: 'number',
            required: true,
            message: 'The dept cannot be empty',
            trigger: 'change'
          }
        ],
        date: [
          {
            required: true,
            type: 'date',
            message: 'Please select the date',
            trigger: 'change'
          }
        ],
        avatar: [
          {
            required: true,
            message: 'Please enter a personal introduction',
            trigger: 'blur'
          },
          {
            type: 'string',
            min: 20,
            message: 'Introduce no less than 20 words',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  methods: {
    handleSelection (data) {
      this.selectionData = data
    },
    handleDelete (params) {
      console.log(params)
    },
    pageChange (current) {
      this.pageInfo.current = current
      this.getData()
    },
    pageSizeChange (size) {
      this.pageInfo.size = size
      this.getData()
    },
    getData () {
      let data = {
        current: this.pageInfo.current,
        size: this.pageInfo.size,
        searchMap: {}
      }
      data.searchMap = Object.assign({}, this.searchMap)
      this.tableLoading = true
      getUserTableData(data).then(res => {
        this.tableData = res.data.data.records
        this.pageInfo.total = res.data.data.total
        this.tableLoading = false
      }).catch(err => {
        this.tableLoading = false
      })
    },
    add () {
      this.title = '新增'
      this.formModal = true
      this.getDeptList()
    },
    edit () {
      if (this.selectionData === false || this.selectionData.length !== 1) {
        this.$Message.warning('请选择一条数据')
        return
      }
      this.title = '修改'
      this.formModal = true
      this.formValidate.name = this.selectionData[0].name
      this.formValidate.mail = this.selectionData[0].email
      this.formValidate.date = this.selectionData[0].createTime
      this.formValidate.deptId = this.selectionData[0].deptId
      this.getDeptList()
    },
    getDeptList () {
      getDeptList().then(res => {
        this.deptList = res.data.data
      }).catch(err => {
        
      })
    },
    del () {
      if (this.selectionData === false || this.selectionData.length === 0) {
        this.$Message.warning('请至少选择一条数据')
        return
      }
      this.$Modal.confirm({
        title: '提示',
        content: '此操作将永久删除, 是否继续?',
        onOk: () => {
          // 删除
          this.getData()
        }
      })
    },
    handleSubmit (name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.$Message.success('Success!')
          this.formModal = false
          this.handleReset (name)
        } else {
          this.handModelLoading(name)
        }
      })
    },
    handleReset (name) {
      this.$refs[name].resetFields()
    },
    handModelLoading(name) {
      setTimeout(() => {
        this.modalLoading = false
        this.$nextTick(() => {
          this.modalLoading = true
        })
      }, 500)
    }
  },
  created () {
    this.sys_user_add = this.permissions && this.permissions.includes('sys_user_add')
    this.sys_user_edit = this.permissions && this.permissions.includes('sys_user_edit')
    this.sys_user_del = this.permissions && this.permissions.includes('sys_user_del')
  },
  mounted () {
    this.getData()
    // 设置表格高度
    this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 160
  }
}
</script>
<style scoped>
</style>
