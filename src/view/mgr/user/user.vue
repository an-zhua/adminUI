<template>
  <div>
    <Card>
      <Form ref="searchMap" :model="searchMap" inline :label-width="100">
        <FormItem label="用户名" prop="nickName">
          <Input clearable placeholder="输入用户名搜索" v-model="searchMap.nickName"/>
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
          <FormItem label="手机号" prop="phone">
            <Input v-model="formValidate.userName" placeholder="请输入手机号"></Input>
          </FormItem>
          <FormItem label="邮箱" prop="email">
            <Input v-model="formValidate.email" placeholder="请输入邮箱"></Input>
          </FormItem>
          <FormItem label="个性签名" prop="content">
            <Input
              v-model="formValidate.content"
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
import { getUserTableData, addUser, updateUser, deleteUser } from '@/api/user'
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
        { title: '姓名', key: 'nickName', sortable: true, width: 120 },
        { title: '用户名', key: 'userName', sortable: true, width: 120 },
        { title: '头像', key: 'avatar', width: 150 },
        { title: '手机号', key: 'phone', width: 120 },
        { title: '邮箱', key: 'email', width: 180 },
        { title: 'wxLink', key: 'wxLink', width: 200 },
        { title: 'qqLink', key: 'qqLink', width: 200 },
        { title: '锁定标志',
          key: 'isLock',
          width: 100,
          render: (h, params) => {
            if (params.row.isLock === 1) {
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
            if (params.row.isDelete === 1) {
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
        { title: '创建日期', key: 'createDate', width: 180,
          render: (h, params) => {
            return h("span",this.$dateFormateT(params.row.createDate,"yyyy-MM-dd hh:mm:ss"))
          } 
        }
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
        userName: ''
      },
      title: '',
      formValidate: {
        id: '',
        nickName: '',
        userName: '',
        email: '',
        phone: '',
        content: ''
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
        phone: [
          {
            required: true,
            message: '手机号不能为空',
            trigger: 'blur'
          }
        ],
        email: [
          {
            required: true,
            message: '邮箱不能为空',
            trigger: 'blur'
          },
          { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  methods: {
    hasPermissions(data) {
      return this.$hasPermissions(data)
    },
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
        size: this.pageInfo.size
      }
       data = Object.assign({}, data, this.searchMap)
      this.tableLoading = true
      getUserTableData(data).then(res => {
        this.tableData = res.data.data.records
        this.pageInfo.total = res.data.data.total
        this.tableLoading = false
        this.selectionData = []
      }).catch(err => {
        this.tableLoading = false
        this.selectionData = []
      })
    },
    add () {
      this.title = '新增'
      this.formModal = true
      this.formValidate.id = null
    },
    edit () {
      if (this.selectionData === false || this.selectionData.length !== 1) {
        this.$Message.warning('请选择一条数据')
        return
      }
      this.title = '修改'
      this.formModal = true
      this.formValidate.id = this.selectionData[0].id
      this.formValidate.nickName = this.selectionData[0].nickName
      this.formValidate.userName = this.selectionData[0].userName
      this.formValidate.email = this.selectionData[0].email
      this.formValidate.phone = this.selectionData[0].phone
      this.formValidate.content = this.selectionData[0].content
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
          let ids = ''
          for (let i = 0; i < this.selectionData.length; i++) {
            if(!ids) {
              ids += ',' + this.selectionData[i].id
            }
            ids = this.selectionData[i].id
          }
          let data = {}
          data['ids'] = ids
          // 删除
          deleteUser(data).then(res => {
            this.getData()
            this.$Message.success(res.data.msg)
          }).catch(err => {
            this.getData()
          })
        }
      })
    },
    handleSubmit (name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          let data = this.formValidate
          if ( !this.formValidate.id ) {//新增
            addUser(data).then(res => {
              this.getData()
              this.handleReset (name)
              this.formModal = false
              this.$Message.success(res.data.msg)
            }).catch(err => {
              this.getData()
              this.handModelLoading(name)
            })
          } else {//修改
            updateUser(data).then(res => {
              this.getData()
              this.handleReset (name)
              this.formModal = false
              this.$Message.success(res.data.msg)
            }).catch(err => {
              this.getData()
              this.handModelLoading(name)
            })
          }
        } else {
          this.handModelLoading(name)
        }
      })
    },
    handleReset (name) {
      this.$refs[name].resetFields()
      this.uploadList = []
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
