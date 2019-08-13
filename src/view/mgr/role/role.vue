<template>
  <div>
    <Card>
      <Form ref="searchMap" :model="searchMap" inline :label-width="100">
        <FormItem label="角色名称" prop="roleName">
          <Input clearable placeholder="输入角色名称搜索" v-model="searchMap.roleName"/>
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
          <Button v-if="hasPermissions('role_add')" type="info" @click="add">新增</Button>
          <Button v-if="hasPermissions('role_edit')" type="success" @click="edit">修改</Button>
          <Button v-if="hasPermissions('role_del')" type="warning" @click="del">删除</Button>
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
      >
        <template slot-scope="{ row, index }" slot="handler">
            <Button v-if="hasPermissions('role_perm')" type="primary" size="small" style="margin-right: 5px" @click="auth(row, index)">授权</Button>
        </template>
      </Table>
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
          <FormItem label="角色名字" prop="roleName">
            <Input v-model="formValidate.roleName" placeholder="请输入角色名称"></Input>
          </FormItem>
          <FormItem label="角色代码" prop="roleCode">
            <Input v-model="formValidate.roleCode" placeholder="请输入角色代码"></Input>
          </FormItem>
          <FormItem label="备注">
            <Input
              v-model="formValidate.remark"
              type="textarea"
              :autosize="{minRows: 2,maxRows: 5}"
              placeholder="请输入角色备注"
            ></Input>
          </FormItem>
        </Form>
      </Modal>
			<Modal
        v-model="authModal"
        title="授权"
        :loading="authModalLoading"
        :mask-closable="false"
        @on-ok="handleSubmit('authForm')"
        @on-cancel="handleReset('authForm')"
      >
        <Form ref="authForm" :model="authFrom" :label-width="80">
          <FormItem prop="resIds">
						<Tree ref="tree" :data="resourcesList" show-checkbox multiple check-strictly></Tree>
          </FormItem>
        </Form>
      </Modal>
    </div>
  </div>
</template>
<script>
import Tables from '_c/tables'
import { getRoleTableData, addRole, updateRole,
  deleteRole,getAuthTree,updateRoleAuth } from '@/api/data'
import { mapGetters } from 'vuex'
export default {
  name: 'role',
  components: {
		Tables
  },
  data () {
    return {
      tableHeight: 300,
      tableLoading: true,
			modalLoading: true,
			authModalLoading: true,
      columns: [
        { type: 'selection', width: 60, align: 'center' },
        { type: 'index', width: 60, align: 'center' },
        { title: '角色名称', key: 'roleName', sortable: true },
        { title: '角色代码', key: 'roleCode', sortable: true },
        { title: '删除标志', key: 'isDelete', width: 100,
          render: (h, params) => {
            if (params.row.isDelete == '1') {
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
        { title: '创建日期', key: 'createDate' ,
          render: (h, params) => {
            return h("span",this.$dateFormateT(params.row.createDate,"yyyy-MM-dd hh:mm:ss"))
          }
        },
        { title: '备注', key: 'remark', width: 180},
        { title: '操作', key: 'handler', slot: 'handler', width: 80 }
      ],
      tableData: [],
			selectionData: [],
			formModal: false,
			authModal: false,
      pageInfo: {
        total: 0,
        current: 1,
        size: 10
      },
      searchMap: {
        roleName: ''
      },
      title: '',
      formValidate: {
        id: '',
        roleName: '',
        roleCode: '',
        remark: ''
      },
      resourcesList: [],
			authFrom: {
				roleId: '',
				resIds: []
			},
      ruleValidate: {
        roleName: [
          {
            required: true,
            message: 'The name cannot be empty',
            trigger: 'blur'
          }
        ],
        roleCode: [
          {
            required: true,
            message: 'The roleCode cannot be empty',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    hasPermissions(data) {
      return this.$hasPermissions(data)
    },
    handleSelection (data) {
      this.selectionData = data
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
      getRoleTableData(data).then(res => {
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
      this.formValidate.id = this.selectionData[0].id
      this.formValidate.roleName = this.selectionData[0].roleName
      this.formValidate.roleCode = this.selectionData[0].roleCode
      this.formValidate.remark = this.selectionData[0].remark
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
          // 删除
          deleteRole(ids).then(res => {
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
					if (name === 'formValidate') {
            let data = this.formValidate
            if ( !this.formValidate.id ) {//新增
              addRole(data).then(res => {
                this.getData()
                this.handleReset (name)
                this.formModal = false
                this.$Message.success(res.data.msg)
              }).catch(err => {
                this.getData()
                this.handModelLoading(name)
              })
            } else {//修改
              updateRole(data).then(res => {
                this.getData()
                this.handleReset (name)
                this.formModal = false
                this.$Message.success(res.data.msg)
              }).catch(err => {
                this.getData()
                this.handModelLoading(name)
              })
            }
					}else if(name ===  'authForm') {
            let data = Object.assign({},this.authFrom)
            let checkedList = this.$refs.tree.getCheckedAndIndeterminateNodes()
            if(checkedList != null && checkedList.length > 0) {
              for(let index in checkedList) {
                if(index == 0) {
                  data.resIds = checkedList[index].id
                }else {
                  data.resIds += ',' + checkedList[index].id
                }
              }
            }
            updateRoleAuth(data).then(res => {
              this.$Message.success(res.data.msg)
              this.authModal = false
            }).catch(err => {
              this.handModelLoading(name)
            })
          }
        } else {
          this.handModelLoading(name)
        }
			})
    },
    handModelLoading(name) {
      setTimeout(() => {
        if (name === 'formValidate') {
          this.modalLoading = false
          this.$nextTick(() => {
            this.modalLoading = true
          })
        }else if(name === 'authForm') {
          this.authModalLoading = false
          this.$nextTick(() => {
            this.authModalLoading = true
          })
        }
      }, 500)
    },
    handleReset (name) {
      this.$refs[name].resetFields()
		},
		auth (row, index) {
      this.authModal = true
      this.authFrom.roleId = row.id
			this.loadResources(row)
		},
		loadResources (row) {
      let data = {}
      data.roleId = row.id
      getAuthTree(data).then(res => {
        this.resourcesList = res.data.data
      })
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
