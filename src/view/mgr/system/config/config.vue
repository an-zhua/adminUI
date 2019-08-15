<template>
  <div>
    <Card>
      <Form ref="searchMap" :model="searchMap" inline :label-width="100">
        <FormItem label="服务名" prop="application">
          <Input clearable placeholder="输入服务名搜索" v-model="searchMap.application" readonly/>
        </FormItem>
        <FormItem label="配置的key" prop="key1">
          <Input clearable placeholder="输入配置的key搜索" v-model="searchMap.key1" />
        </FormItem>
        <FormItem label="配置的value" prop="value1">
          <Input clearable placeholder="输入配置的value搜索" v-model="searchMap.value1" />
        </FormItem>
        <FormItem>
          <Button @click="getData()" type="primary">
            <Icon type="search"/>&nbsp;&nbsp;搜索
          </Button>
          <Button @click="handleReset('searchMap')" style="margin-left: 8px">重置</Button>
        </FormItem>
      </Form>
      <div style="padding-bottom:10px">
        <ButtonGroup>
          <Button v-if="hasPermissions('config_add')" type="info" @click="add">新增服务</Button>
        </ButtonGroup>
      </div>
      <Table
        ref="table"
        stripe
        :columns="columns"
        :loading="tableLoading"
        :data="tableData"
        :height="tableHeight"
        @on-selection-change="handleSelection">
        <template slot-scope="{ row, index }" slot="handler">
          <Button v-if="hasPermissions('config_edit')" type="info" size="small" style="margin-right: 5px" @click="edit(row)">修改</Button>
          <Button v-if="hasPermissions('config_del')" type="warning" size="small" style="margin-right: 5px" @click="del(row)">删除</Button>
        </template>
      </Table>
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
          <FormItem hidden label="id" prop="id">
            <Input v-model="formValidate.id" placeholder="无需输入，自动生成" readonly></Input>
          </FormItem>
          <FormItem label="配置中key的值" prop="key1">
            <Input v-model="formValidate.key1" placeholder="请输入配置中key的值" v-bind:readonly="isReadOnly"></Input>
          </FormItem>
          <FormItem label="配置中value的值" prop="value1">
            <Input v-model="formValidate.value1" placeholder="请输入配置中value的值"></Input>
          </FormItem>
          <FormItem label="应用名" prop="application">
            <Input v-model="formValidate.application" placeholder="请输入应用名" readonly></Input>
          </FormItem>
          <FormItem label="环境" prop="profile">
            <Input v-model="formValidate.profile" placeholder="请输入环境" v-bind:readonly="isReadOnly"></Input>
          </FormItem>
          <FormItem label="分支" prop="label">
            <Input v-model="formValidate.label" placeholder="请输入分支" v-bind:readonly="isReadOnly"></Input>
          </FormItem>
          <FormItem label="排序" prop="sort">
            <InputNumber :min="1" v-model="formValidate.sort" placeholder="请输入排序" v-bind:readonly="isReadOnly"></InputNumber>
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
  import { getConfigTableData, addConfig, updateConfig, deleteConfig} from '@/api/system/data'
  import {formatDate, baseIs} from '@/api/base'
  export default {
    name: 'config',
    components: {
      Tables
    },
    computed: {
      name(){
        return this.formValidate.application
      }
    },
    watch: {
      name(newValue, oldValue){
        if(!newValue){
          this.formValidate.application = oldValue;
        }
      }
    },
    data () {
      return {
        tableHeight: 300,
        tableLoading: true,
        modalLoading: true,
        columns: [
          { type: 'selection', width: 60, align: 'center' },
          { type: 'index', width: 60, align: 'center' },
          { title: '配置中key', key: 'key1', sortable: true, width: 260 },
          { title: '配置中value', key: 'value1', sortable: true, width: 260 },
          { title: '服务名称', key: 'application', sortable: true, width: 140 },
          { title: '环境', key: 'profile', sortable: true, width: 100 },
          { title: '分支', key: 'label', sortable: true, width: 100 },
          { title: '排序', key: 'sort', sortable: true, width: 100 },
          {
            title: '创建日期',
            key: 'createDate',
            width: 160,
            render: (h, params) => {
              return h('span', formatDate(params.row.createDate, 'yyyy-MM-dd hh:mm:ss'));
            }
          },
          { title: '操作', key: 'handler', slot: 'handler', width: 140 }
        ],
        tableData: [],
        selectionData: [],
        formModal: false,
        searchMap: {
          key1: '',
          value1: '',
          application: 'initData'
        },
        title: '',
        formValidate: {
          id: '',
          key1: '',
          value1: '',
          application: '',
          profile: 'dev',
          label: 'master',
          sort: 1,
          remark: ''
        },
        isReadOnly: false,
        ruleValidate: {
          key1: [
            {
              required: true,
              message: '配置中key为空',
              trigger: 'blur'
            }
          ],
          value1: [
            {
              required: true,
              message: '配置中value不能为空',
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
      // 父组件会调用这个getData，传递一个参数applicationName，同时把这个参数赋给this.searchMap.application、this.formValidate.application
      getData (applicationName = this.searchMap.application) {
        if(applicationName === 'initData'){
          return
        }
        this.searchMap.application = applicationName;
        this.formValidate.application = applicationName;
        let data = {
          application: applicationName,
          key1: this.searchMap.key1,
          value1: this.searchMap.value1
        };
        this.tableLoading = true;
        getConfigTableData(data)
          .then(res => {
            this.tableData = res.data.data;
            this.tableLoading = false
          }).catch(err => {
            console.log(err);
            this.tableLoading = false
        })
      },
      add () {
        this.title = '新增';
        this.formModal = true;
        this.isReadOnly = false
      },
      edit (row) {
        if (!row.id) {
          this.$Message.warning('请确定数据是否正确')
          return
        }
        this.title = '修改';
        this.formModal = true;
        this.isReadOnly = true;
        this.formValidate.id = row.id;
        this.formValidate.key1 = row.key1;
        this.formValidate.value1 = row.value1;
        this.formValidate.application = row.application;
        this.formValidate.profile = row.profile;
        this.formValidate.label = row.label;
        this.formValidate.sort = row.sort;
        this.formValidate.remark = row.remark
      },
      del (row) {
        if (!row.id) {
          this.$Message.warning('请确定数据是否正确');
          return
        }
        this.$Modal.confirm({
          title: '提示',
          content: '此操作将永久删除, 是否继续?',
          onOk: () => {
            deleteConfig(row.id)
              .then(res => {
                this.getData();
                this.$Message.success(res.data.msg)
              }).catch(err => {
                console.log(err)
            })
          }
        })
      },
      handleSubmit (name) {
        this.$refs[name].validate(valid => {
          if (valid) {
            let data = this.formValidate;
            if(!this.formValidate.id){
              addConfig(data)
                .then(res => {
                  this.getData();
                  this.handleReset (name);
                  this.formModal = false;
                  this.$Message.success(res.data.msg)
                }).catch(err => {
                this.handModelLoading(name);
                console.log(err)
              })
            }else{
              updateConfig(data)
                .then(res => {
                  this.getData();
                  this.handleReset (name);
                  this.formModal = false;
                  this.$Message.success(res.data.msg)
                }).catch(err => {
                this.handModelLoading(name);
                console.log(err)
              })
            }
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
          this.modalLoading = false;
          this.$nextTick(() => {
            this.modalLoading = true
          })
        }, 500)
      }
    },

    mounted () {
      this.getData();
      // 设置表格高度
      this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 300
    }
  }
</script>
<style scoped>
</style>
