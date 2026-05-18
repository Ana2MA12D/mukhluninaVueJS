<script>
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import {useDataStore} from "@/stores/dataStore";
import Button from "primevue/button";
import {useAuthStore} from "@/stores/authStore.js";
import InputText from "primevue/inputtext";
import ConfirmPopup from "primevue/confirmpopup";
import Toast from "primevue/toast";

export default {
  name: "Cars",
  components: {DataTable, Column, Button, InputText, ConfirmPopup, Toast},
  data() {
    return {
      dataStore: useDataStore(),
      authStore: useAuthStore(),
      perpage: 5,
      offset: 0,
      search: "",
    }
  },
  computed: {
    cars() {
      return this.dataStore.cars;
    },
    cars_total() {
      return this.dataStore.cars_total;
    },
    error_code() {
      return this.dataStore.errorCode;
    },
    error_message() {
      return this.dataStore.errorMessage;
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
    },
    onPushSearchButton(event) {
      this.dataStore.get_cars_total(this.search);
      this.dataStore.get_cars(undefined, undefined, this.search);
    },
    openPopupConfirm(event, data) {
      this.$confirm.require({
        message: 'Вы уверены, что хотите удалить автомобиль ' + data.id + '?',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Да',
        rejectLabel: 'Нет',
        accept: () => {
          this.deleteCar(data.id);
        },
      })
    },
    selectRow(data) {
      this.$router.push('/createCar/' + data.id);
    },
    async deleteCar(id) {
      await this.dataStore.delete_car(id);
      if (this.error_code > 0)
        this.$toast.add({
          severity: 'error',
          summary: "Ошибка удаления автомобиля " + id,
          detail: this.error_message + " " + this.error_code,
          life: 4000
        });
      else
        this.$toast.add({
          severity: 'success',
          summary: "Автомобиль " + id + " успешно удален",
          detail: this.error_message,
          life: 4000
        });
      this.dataStore.get_cars(this.offset / this.perpage, this.perpage, this.search);
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
    <template #header>
      <InputText
        v-model="search"
        type="text" id="search"
        required
        placeholder="Название"
        class="m-2 sm:w-auto"/>
      <Button type="button"
              @click="onPushSearchButton()"
              icon="pi pi-search"
              label="Найти"/>
    </template>
    <Column class="w-24 !text-end" header="Действия">
      <template #body="{ data }">
        <div class="flex justify-between gap-2">
          <Button icon="pi pi-times-circle" @click="openPopupConfirm($event, data)"
                  severity="secondary" rounded></Button>
          <Button icon="pi pi-file-edit" @click="selectRow(data)" severity="secondary"
                  rounded></Button>
        </div>
      </template>
    </Column>
    <Column field="id" header="№"/>
    <Column field="brand" header="Марка"/>
    <Column field="model" header="Модель"/>
    <Column field="status" header="Детское кресло">
      <template #body="slotProps">
        {{ slotProps.data.status ? 'Есть' : 'Нет' }}
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
  <ConfirmPopup></ConfirmPopup>
  <Toast></Toast>
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
