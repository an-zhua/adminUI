<template>
  <div>
    <Card>
      <Form ref="searchMap" :model="searchMap" inline :label-width="100">
        <FormItem label="服务名" prop="serviceName">
          <Input clearable placeholder="输入服务名搜索" v-model="searchMap.serviceName"/>
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
          <Button v-if="hasPermissions('service_add')" type="info" @click="add">新增</Button>
          <Button v-if="hasPermissions('service_edit')" type="success" @click="edit">修改</Button>
          <Button v-if="hasPermissions('service_del')" type="warning" @click="del">删除</Button>
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
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="150">
          <FormItem label="服务名称" prop="serviceName">
            <Input v-model="formValidate.serviceName" placeholder="请输入服务名称"></Input>
          </FormItem>
          <FormItem label="部署服务器IP" prop="serviceIp">
            <Input v-model="formValidate.serviceIp" placeholder="请输入部署机器ip"></Input>
          </FormItem>
          <FormItem label="服务端口号" prop="servicePort">
            <Input v-model="formValidate.servicePort" placeholder="请输入端口号"></Input>
          </FormItem>
          <FormItem label="是否自动创建config" prop="isCreateConfig">
            <RadioGroup v-model="formValidate.isCreateConfig">
              <Radio label="1">是</Radio>
              <Radio label="0">否</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="是否使用Mysql" prop="isUseMysql">
            <RadioGroup v-model="formValidate.isUseMysql">
              <Radio label="1">是</Radio>
              <Radio label="0">否</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="是否使用Redis" prop="isUseRedis">
            <RadioGroup v-model="formValidate.isUseRedis">
              <Radio label="1">是</Radio>
              <Radio label="0">否</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="是否使用RabbitMQ" prop="isUseRabbitmq">
            <RadioGroup v-model="formValidate.isUseRabbitmq">
              <Radio label="1">是</Radio>
              <Radio label="0">否</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="备注" prop="remark">
            <Input
              v-model="formValidate.remark"
              type="textarea"
              :autosize="{minRows: 2,maxRows: 5}"
              placeholder="请输入备注信息"
            ></Input>
          </FormItem>
        </Form>
      </Modal>
    </div>

  </div>
</template>
<script>
import Tables from '_c/tables'
import { getServiceTableData } from '@/api/system/data'
import { mapMutations, mapState } from 'vuex'
import {formatDate, baseIs} from '@/api/base'
export default {
  name: 'service',
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
        { title: '服务名称', key: 'serviceName', sortable: true, width: 140 },
        { title: '服务ip', key: 'serviceIp', sortable: true, width: 140 },
        {
          title: '是否启动',
          key: 'isStart',
          width: 160,
          render: (h, params) => {
            return baseIs(h, params.row.isStart)
          }
        },
        {
          title: '默认config',
          key: 'isCreateConfig',
          width: 160,
          render: (h, params) => {
            return baseIs(h, params.row.isCreateConfig)
          }
        },
        {
          title: '初始化mysql',
          key: 'isUseMysql',
          width: 160,
          render: (h, params) => {
            return baseIs(h, params.row.isUseMysql)
          }
        },
        {
          title: '初始化redis',
          key: 'isUseRedis',
          width: 160,
          render: (h, params) => {
            return baseIs(h, params.row.isUseRedis)
          }
        },
        {
          title: '初始化RabbitMQ',
          key: 'isUseRabbitmq',
          width: 160,
          render: (h, params) => {
            return baseIs(h, params.row.isUseRabbitmq)
          }
        },
        {
          title: '是否启用',
          key: 'status',
          width: 160,
          render: (h, params) => {
            return baseIs(h, params.row.status)
          }
        },
        {
          title: '创建日期',
          key: 'createDate',
          width: 160,
          render: (h, params) => {
            return h('span', formatDate(params.row.createDate, 'yyyy-MM-dd hh:mm:ss'));
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
        serviceName: ''
      },
      title: '',
      formValidate: {
        serviceName: '',
        serviceIp: '',
        servicePort: '',
        isCreateConfig: '0',
        isUseMysql: '0',
        isUseRedis: '0',
        isUseRabbitmq: '0',
        remark: ''
      },
      ruleValidate: {
        serviceName: [
          {
            required: true,
            message: '服务名称为空',
            trigger: 'blur'
          }
        ],
        servicePort: [
          {
            required: true,
            message: '服务端口号不能为空',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  computed: {
    ...mapState({
      manage: state => state.manage
    }),
    ...mapMutations([
      'formatDate',
      'baseIs'
    ])
  },
  methods: {
    hasPermissions,
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
      getServiceTableData(data)
        .then(res => {
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

  mounted () {
    this.getData()
    // 设置表格高度
    this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 160
  }
}
</script>
<style scoped>
</style>
