<template>
  <div>
    <Card>
      <Form ref="searchMap" :model="searchMap" inline :label-width="100">
        <FormItem label="部门名称" prop="deptName">
          <Input clearable placeholder="输入部门名称搜索" v-model="searchMap.deptName"/>
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
          <Button v-if="sys_dept_add" type="info" @click="add">新增</Button>
          <Button v-if="sys_dept_edit" type="success" @click="edit">修改</Button>
          <Button v-if="sys_dept_del" type="warning" @click="del">删除</Button>
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
          <FormItem label="部门名称" prop="name">
            <Input v-model="formValidate.name" placeholder="Enter dept name"></Input>
          </FormItem>
          <FormItem label="序号" prop="sort">
            <InputNumber :min="1" v-model="formValidate.sort"></InputNumber>
          </FormItem>
          <FormItem label="Desc" prop="desc">
            <Input
              v-model="formValidate.desc"
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
import { getDeptTableData } from '@/api/data'
import { mapGetters } from 'vuex'
export default {
  name: 'dept',
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
        { title: '部门名称', key: 'name', sortable: true },
        { title: '序号', key: 'sort', sortable: true },
        { title: '创建日期', key: 'createTime' },
        { title: '备注', key: 'desc' }
      ],
      tableData: [],
      selectionData: [],
      sys_dept_add: false,
      sys_dept_edit: false,
      sys_dept_del: false,
      formModal: false,
      pageInfo: {
        total: 0,
        current: 1,
        size: 10
      },
      searchMap: {
        deptName: '',
        createTimeS: '',
        createTimeE: ''
      },
      title: '',
      formValidate: {
        id: '',
        name: '',
        sort: 1,
        desc: ''
      },
      ruleValidate: {
        name: [
          {
            required: true,
            message: 'The name cannot be empty',
            trigger: 'blur'
          }
        ],
        sort: [
          {
            type: 'number',
            required: true,
            message: 'The sort cannot be empty',
            trigger: 'blur'
          }
        ],
        desc: [
          {
            required: true,
            message: 'Please enter a personal introduction',
            trigger: 'blur'
          },
          {
            type: 'string',
            min: 10,
            message: 'Introduce no less than 10 words',
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
      getDeptTableData(data).then(res => {
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
    },
    edit () {
      if (this.selectionData === false || this.selectionData.length !== 1) {
        this.$Message.warning('请选择一条数据')
        return
      }
      this.title = '修改'
      this.formModal = true
      this.formValidate.name = this.selectionData[0].name
      this.formValidate.sort = this.selectionData[0].sort
      this.formValidate.desc = this.selectionData[0].desc
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
    this.sys_dept_add = this.permissions.includes('sys_dept_add')
    this.sys_dept_edit = this.permissions.includes('sys_dept_edit')
    this.sys_dept_del = this.permissions.includes('sys_dept_del')
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
