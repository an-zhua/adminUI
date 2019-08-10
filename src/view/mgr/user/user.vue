<template>
  <div>
    <Card>
      <Form ref="searchMap" :model="searchMap" inline :label-width="100">
        <FormItem label="用户名" prop="nickName">
          <Input clearable placeholder="输入用户名搜索" v-model="searchMap.nickName"/>
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
          <Button v-if="hasPermissions('user_add')" type="info" @click="add">新增</Button>
          <Button v-if="hasPermissions('user_edit')" type="success" @click="edit">修改</Button>
          <Button v-if="hasPermissions('user_del')" type="warning" @click="del">删除</Button>
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
          <FormItem label="姓名" prop="nickName">
            <Input v-model="formValidate.nickName" placeholder="请输入姓名"></Input>
          </FormItem>
          <FormItem label="用户名" prop="userName">
            <Input v-model="formValidate.userName" placeholder="请输入用户名"></Input>
          </FormItem>
          <FormItem label="邮箱" prop="mail">
            <Input v-model="formValidate.mail" placeholder="请输入邮箱"></Input>
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
import hasPermissions from '@/libs/permission'
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
        { title: '姓名', key: 'nickName', sortable: true, width: 120 },
        { title: '用户名', key: 'userName', sortable: true, width: 120 },
        { title: '手机号', key: 'phone', width: 120 },
        { title: '邮箱', key: 'email', width: 180 },
        { title: 'wxLink', key: 'wxLink' },
        { title: 'qqLink', key: 'qqLink' },
        { title: '锁定标志',
          key: 'isLock',
          width: 100,
          render: (h, params) => {
            if (params.row.isLock === '1') {
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
        { title: '删除标志',
          key: 'isDelete',
          width: 100,
          render: (h, params) => {
            if (params.row.isDelete === '1') {
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
        { title: '创建日期', key: 'createDate' }
      ],
      tableData: [],
      selectionData: [],
      formModal: false,
      pageInfo: {
        total: 0,
        current: 1,
        size: 10
      },
      searchMap: {
        userName: '',
        createTimeS: '',
        createTimeE: ''
      },
      title: '',
      deptList: [],
      formValidate: {
        nickName: '',
        userName: '',
        mail: '',
        gender: '',
        date: '',
        avatar: ''
      },
      ruleValidate: {
        nickName: [
          {
            required: true,
            message: '姓名不能为空',
            trigger: 'blur'
          }
        ],
        userName: [
          {
            required: true,
            message: '用户名不能为空',
            trigger: 'blur'
          }
        ],
        mail: [
          {
            required: true,
            message: '邮箱不能为空',
            trigger: 'blur'
          },
          { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
        ],
        gender: [
          { required: true, message: '请选择性别', trigger: 'change' }
        ],
        date: [
          {
            required: true,
            type: 'date',
            message: '请选择出生日期',
            trigger: 'change'
          }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  methods: {
    hasPermissions,
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
    },
    edit () {
      if (this.selectionData === false || this.selectionData.length !== 1) {
        this.$Message.warning('请选择一条数据')
        return
      }
      this.title = '修改'
      this.formModal = true
      this.formValidate.nickName = this.selectionData[0].nickName
      this.formValidate.userName = this.selectionData[0].userName
      this.formValidate.mail = this.selectionData[0].email
      this.formValidate.date = this.selectionData[0].createTime
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
          this.handleReset(name)
        } else {
          this.handModelLoading(name)
        }
      })
    },
    handleReset (name) {
      this.$refs[name].resetFields()
    },
    handModelLoading (name) {
      setTimeout(() => {
        this.modalLoading = false
        this.$nextTick(() => {
          this.modalLoading = true
        })
      }, 500)
    }
  },
  created () {
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
