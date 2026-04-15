<script>
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import {useDataStore} from "@/stores/dataStore";
import Button from "primevue/button";
import {useAuthStore} from "@/stores/authStore.js";


export default {
  name: "Cars",
  components: {DataTable, Column, Button},
  data() {
    return {
      dataStore: useDataStore(),
      authStore: useAuthStore(),
      perpage: 5,
      offset: 0,
    }
  },
  computed: {
    cars() {
      return this.dataStore.cars;
    },
    cars_total() {
      return this.dataStore.cars_total;
    }
  },
  mounted() {
    console.log('Cars component MOUNTED!');
    this.dataStore.get_cars();
    this.dataStore.get_cars_total();
    console.log('Cars=', this.cars);
  },
  methods: {
    onPageChange(event) {
      this.offset = event.first;
      this.perpage = event.rows;
      this.dataStore.get_cars(this.offset / this.perpage, this.perpage);
    }
  }
}
</script>

<template>
  <DataTable
    :value="cars"
    :lazy="true"
    :loading="dataStore.loading"
    :paginator="true"
    :rows="perpage"
    :rowsPerPageOptions="[2, 5, 10]"
    :totalRecords=cars_total
    @page="onPageChange"
    responsiveLayout="scroll"
    :first="offset"
  >
    <Column field="id" header="№"/>
    <Column field="brand" header="Марка"/>
    <Column field="model" header="Модель"/>
    <Column field="status" header="Статус">
      <template #body="slotProps">
        {{ slotProps.data.status ? 'Свободно' : 'Занято' }}
      </template>
    </Column>
    <Column field="price" header="Цена руб./сутки"/>
    <Column field="image" header="Фото">
      <template #body="slotProps">
        <div class="image-wrapper">
          <img
            v-if="slotProps.data.image"
            :src="slotProps.data.image"
            alt="Фото автомобиля"
            class="car-image"

          />
          <span v-else class="no-image">Нет фото</span>
        </div>

      </template>
    </Column>
    <template #footer>
      <div v-if="authStore.user && authStore.user.is_admin" class="text-end">
        <Button type="button" @click="this.$router.push('/createCar')" icon="pi pi-plus"
                label="Добавить автомобиль"/>
      </div>
    </template>
  </DataTable>
</template>


<style scoped>
.image-wrapper {
  width: 140px;
  height: 90px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 10px;
  border: 1px solid #dcdcdc;
  background-color: #f7f7f7;
}

.car-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.no-image {
  font-size: 12px;
  color: #777;
}
</style>
