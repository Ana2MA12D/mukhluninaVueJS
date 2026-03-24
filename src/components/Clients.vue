<script>
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import {useDataStore} from "@/stores/dataStore";

export default {
  name: "Clients",
  components: {DataTable, Column},
  data() {
    return {
      dataStore: useDataStore(),
      perpage: 5,
      offset: 0,
    }
  },
  computed: {
    clients() {
      return this.dataStore.clients;
    },
    clients_total() {
      return this.dataStore.clients_total;
    }
  },
  mounted() {
    console.log('Clients component MOUNTED!');
    this.dataStore.get_clients();
    this.dataStore.get_clients_total();
    console.log('Clients=', this.clients);
  },
  methods: {
    onPageChange(event) {
      this.offset = event.first;
      this.perpage = event.rows;
      this.dataStore.get_clients(this.offset / this.perpage, this.perpage);
    }
  }
}
</script>

<template>
  <DataTable
    :value="clients"
    :lazy="true"
    :loading="dataStore.loading"
    :paginator="true"
    :rows="perpage"
    :rowsPerPageOptions="[2, 5, 10]"
    :totalRecords=clients_total
    @page="onPageChange"
    responsiveLayout="scroll"
    :first="offset"
  >
    <Column field="id" header="№"/>
    <Column field="name" header="Марка"/>
    <Column field="lastName" header="Модель"/>
    <Column field="phone" header="Цена руб./сутки"/>
  </DataTable>
</template>

<style scoped>

</style>
