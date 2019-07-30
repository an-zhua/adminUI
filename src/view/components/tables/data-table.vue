<template>
  <Card>
    <DataTable stripe :url="url" :checkBox="checkBox" :columns="columns" :showPaging="showPaging" :pagingOption="pagingOption"
               @on-selection-change="handleSelection">
    </DataTable>
  </Card>
</template>

<script>
  import DataTable from '_c/tables/data-table'
  import { getUserTableData } from '@/api/data'
  import { mapGetters } from "vuex";
  export default {
    name: "data_table",
    components: {
      DataTable
    },
    data () {
      return {
        url:'get_user_table_data',
        checkBox:true,
        columns: [
          { title: '序号', type: 'index', width: '60' },
          { title: 'Name', key: 'name', sortable: true },
          { title: 'Email', key: 'email' },
          { title: 'Create-Time', key: 'createTime' }
        ],
        showPaging: true,
        pagingOption: {
          showTotal: true,
          showElevator: true,
          showSizer: true
        },
        data: [],
        selectionData: [],
      }
    },
    computed: {
      ...mapGetters(["permissions"])
    },
    methods: {
      handleSelection(data) {
        this.selectionData = data
      },
      handleOper (params) {
        console.log(params)
      }
    },
    created() {
    }
  }
</script>

<style scoped>

</style>
