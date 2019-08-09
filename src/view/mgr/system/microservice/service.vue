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
          <Button v-if="sys_service_add" type="info" @click="add">新增</Button>
          <Button v-if="sys_service_edit" type="success" @click="edit">修改</Button>
          <Button v-if="sys_service_del" type="warning" @click="del">删除</Button>
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
  </div>
</template>
<script>
import Tables from '_c/tables'
import { getServiceTableData } from '@/api/system/data'
import { mapMutations, mapState } from 'vuex'
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
            this.$store.commit('baseIs', { h, params: params.row.isStart })
            let result = this.manage.baseIsResult
            return result
          }
        },
        {
          title: '默认config',
          key: 'isCreateConfig',
          width: 160,
          render: (h, params) => {
            this.$store.commit('baseIs', { h, params: params.row.isCreateConfig })
            let result = this.manage.baseIsResult
            return result
          }
        },
        {
          title: '初始化mysql',
          key: 'isUseMysql',
          width: 160,
          render: (h, params) => {
            this.$store.commit('baseIs', { h, params: params.row.isUseMysql })
            let result = this.manage.baseIsResult
            return result
          }
        },
        {
          title: '初始化redis',
          key: 'isUseRedis',
          width: 160,
          render: (h, params) => {
            this.$store.commit('baseIs', { h, params: params.row.isUseRedis })
            let result = this.manage.baseIsResult
            return result
          }
        },
        {
          title: '初始化RabbitMQ',
          key: 'isUseRabbitmq',
          width: 160,
          render: (h, params) => {
            this.$store.commit('baseIs', { h, params: params.row.isUseRabbitmq })
            let result = this.manage.baseIsResult
            return result
          }
        },
        {
          title: '是否启用',
          key: 'status',
          width: 160,
          render: (h, params) => {
            this.$store.commit('baseIs', { h, params: params.row.status })
            let result = this.manage.baseIsResult
            return result
          }
        },
        {
          title: '创建日期',
          key: 'createDate',
          width: 160,
          render: (h, params) => {
            this.$store.commit('formatDate', { date: params.row.createDate, fmt: 'yyyy-MM-dd hh:mm:ss' })
            let time = this.manage.dateResult
            return h('span', time)
            // return this.formatDate(params.row.createDate, 'yyyy-MM-dd hh:mm:ss');
          }
        }
      ],
      tableData: [],
      selectionData: [],
      sys_service_add: false,
      sys_service_edit: false,
      sys_service_del: false,
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
      deptList: [],
      formValidate: {
        name: '',
        username: '',
        mail: '',
        gender: '',
        deptId: '',
        date: '',
        avatar: ''
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
