<template>
  <div :class="showPaging ? 'tablePage' : ''">
    <Table
      ref="dataTablesMain"
      :data="insideTableData"
      :columns="insideColumns"
      :stripe="stripe"
      :border="border"
      :show-header="showHeader"
      :width="width"
      :height="height"
      :loading="loading"
      :disabled-hover="disabledHover"
      :highlight-row="highlightRow"
      :row-class-name="rowClassName"
      :size="size"
      :no-data-text="noDataText"
      :no-filtered-data-text="noFilteredDataText"
      @on-current-change="onCurrentChange"
      @on-select="onSelect"
      @on-select-cancel="onSelectCancel"
      @on-select-all="onSelectAll"
      @on-selection-change="onSelectionChange"
      @on-sort-change="onSortChange"
      @on-filter-change="onFilterChange"
      @on-row-click="onRowClick"
      @on-row-dblclick="onRowDblclick"
      @on-expand="onExpand"
    >
      <slot name="header" slot="header"></slot>
      <slot name="footer" slot="footer"></slot>
      <slot name="loading" slot="loading"></slot>
    </Table>
    <Page ref="paging" v-if="showPaging" :total="total" style="margin-top:5px;float: right"
          :show-total="pagingOption.showTotal" :show-elevator="pagingOption.showElevator" :show-sizer="pagingOption.showSizer"
          @on-change="onPageChange" @on-page-size-change="onPageSizeChange"></Page>
  </div>
</template>

<script>
  import axios from '@/libs/api.request'
  import TablesEdit from '../edit.vue'
  import handleBtns from '../handle-btns'
  export default {
    name: 'DataTable',
    props: {
      value: {
        type: Array,
        default () {
          return []
        }
      },
      columns: {
        type: Array,
        default () {
          return []
        }
      },
      size: String,
      width: {
        type: [Number, String]
      },
      height: {
        type: [Number, String]
      },
      stripe: {
        type: Boolean,
        default: false
      },
      border: {
        type: Boolean,
        default: false
      },
      showHeader: {
        type: Boolean,
        default: true
      },
      highlightRow: {
        type: Boolean,
        default: false
      },
      rowClassName: {
        type: Function,
        default () {
          return ''
        }
      },
      context: {
        type: Object
      },
      noDataText: {
        type: String
      },
      noFilteredDataText: {
        type: String
      },
      disabledHover: {
        type: Boolean
      },
      /**
       * @description 全局设置是否可编辑
       */
      editable: {
        type: Boolean,
        default: false
      },
      queryParam: {
        type: Object
      },
      url: {
        type: String,
        default: ''
      },
      checkBox:{
        type:Boolean,
        default:true
      },
      /**
       * @description 搜索控件
       */
      showPaging:{
        type: Boolean,
        default:true
      },
      pagingOption: {
        type: Object,
        default: function () {
          return {
            showTotal: true,
            showElevator: true,
            showSizer: true
          }
        }
      }
    },
    /**
     * Events
     * @on-start-edit 返回值 {Object} ：同iview中render函数中的params对象 { row, index, column }
     * @on-cancel-edit 返回值 {Object} 同上
     * @on-save-edit 返回值 {Object} ：除上面三个参数外，还有一个value: 修改后的数据
     */
    data () {
      return {
        loading: false,
        insideColumns: [],
        insideTableData: [],
        edittingCellId: '',
        edittingText: '',
        total: 0,
        pageNum: 1,
        pageSize: 10,
        initPage: 1
      }
    },
    methods: {
      refresh(param) {
        this.queryParam = param;
        this.getData(this.initPage)
      },
      getData(pageNum) {
        if(!this.url) {
          return;
        }
        let data;
        if(this.queryParam) {
          data = Object.assign({}, this.getPagingInfo(pageNum), this.queryParam);
        }else {
          data = this.getPagingInfo(pageNum);
        }
        this.loading = true
        axios.request({
          url: this.url,
          data: data,
          method: 'get'
        }).then(res => {
          this.handleTableData(res.data.data)
          this.total = res.data.total
          this.loading = false
        })
      },
      getPagingInfo(pageNum) {
        const param = {
          pageNum: pageNum,
          pageSize: this.pageSize
        }
        return param
      },
      suportEdit (item, index) {
        item.render = (h, params) => {
          return h(TablesEdit, {
            props: {
              params: params,
              value: this.insideTableData[params.index][params.column.key],
              edittingCellId: this.edittingCellId,
              editable: this.editable
            },
            on: {
              'input': val => {
                this.edittingText = val
              },
              'on-start-edit': (params) => {
                this.edittingCellId = `editting-${params.index}-${params.column.key}`
                this.$emit('on-start-edit', params)
              },
              'on-cancel-edit': (params) => {
                this.edittingCellId = ''
                this.$emit('on-cancel-edit', params)
              },
              'on-save-edit': (params) => {
                this.value[params.row.initRowIndex][params.column.key] = this.edittingText
                this.$emit('input', this.value)
                this.$emit('on-save-edit', Object.assign(params, { value: this.edittingText }))
                this.edittingCellId = ''
              }
            }
          })
        }
        return item
      },
      surportHandle (item) {
        let options = item.options || []
        let insideBtns = []
        options.forEach(item => {
          if (handleBtns[item]) insideBtns.push(handleBtns[item])
        })
        let btns = item.button ? [].concat(insideBtns, item.button) : insideBtns
        item.render = (h, params) => {
          params.tableData = this.value
          return h('div', btns.map(item => item(h, params, this)))
        }
        return item
      },
      handleColumns (columns) {
        this.insideColumns = columns.map((item, index) => {
          let res = item
          if (res.editable) res = this.suportEdit(res, index)
          if (res.key === 'handle') res = this.surportHandle(res)
          return res
        })
        if (this.checkBox) {
          this.insideColumns.unshift({
            type: 'selection',
            width: 60,
            align: 'center'
          })
        }
      },
      handleClear (e) {
        if (e.target.value === '') this.insideTableData = this.value
      },
      handleTableData (data) {
        if(!data && data.length > 0) {
          return
        }
        this.insideTableData = data.map((item, index) => {
          let res = item
          res.initRowIndex = index
          return res
        })
        this.total = this.insideTableData.length
      },
      exportCsv (params) {
        this.$refs.dataTablesMain.exportCsv(params)
      },
      clearCurrentRow () {
        this.$refs.dataTablesMain.clearCurrentRow()
      },
      onCurrentChange (currentRow, oldCurrentRow) {
        this.$emit('on-current-change', currentRow, oldCurrentRow)
      },
      onSelect (selection, row) {
        this.$emit('on-select', selection, row)
      },
      onSelectCancel (selection, row) {
        this.$emit('on-select-cancel', selection, row)
      },
      onSelectAll (selection) {
        this.$emit('on-select-all', selection)
      },
      onSelectionChange (selection) {
        this.$emit('on-selection-change', selection)
      },
      onSortChange (column, key, order) {
        this.$emit('on-sort-change', column, key, order)
      },
      onFilterChange (row) {
        this.$emit('on-filter-change', row)
      },
      onRowClick (row, index) {
        this.$emit('on-row-click', row, index)
      },
      onRowDblclick (row, index) {
        this.$emit('on-row-dblclick', row, index)
      },
      onExpand (row, status) {
        this.$emit('on-expand', row, status)
      },
      onPageChange(pageNum) {
        this.getData(pageNum)
      },
      onPageSizeChange(pageSize) {
        this.pageSize = pageSize
        if(this.pageNum !== 1) {
          this.pageNum = 1
        }else {
          this.getData(this.pageNum)
        }

      }
    },
    watch: {
      columns (columns) {
        this.handleColumns(columns)
      },
      value (val) {
        this.handleTableData(this.value)
      }
    },
    mounted() {
      this.handleColumns(this.columns)
      // this.handleTableData(this.value)
      this.getData(this.initPage)
    }
  }
</script>
<style lang="less">
  .search-con{
    padding: 10px 0;
    .search{
      &-col{
        display: inline-block;
        width: 200px;
      }
      &-input{
        display: inline-block;
        width: 200px;
        margin-left: 2px;
      }
      &-btn{
        margin-left: 2px;
      }
    }
  }
  .tablePage{
    padding-bottom: 40px;
  }
</style>
