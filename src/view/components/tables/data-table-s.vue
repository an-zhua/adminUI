<template>
  <Card>
    <DataTable stripe :url="url" v-model="data" :checkBox="checkBox" :columns="columns" :showPaging="showPaging" :pagingOption="pagingOption"
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
        // url:'get_user_table_data',
        url:'',
        checkBox:true,
        columns: [
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
      handleDelete (params) {
        console.log(params)
      }
    },
    created() {
      getUserTableData().then(res => {
        this.data = res.data.data
      })
    }
  }
</script>

<style scoped>

</style>
