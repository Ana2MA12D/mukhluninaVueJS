<script>
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import {useDataStore} from "@/stores/dataStore.js";
import Toast from "primevue/toast";
import {Dropdown} from "primevue";
import {Calendar} from "primevue";

export default {
  name: "CreateRentalOrder",
  components: {InputText, Button, Toast, Dropdown, Calendar},
  data() {
    return {
      dataStore: useDataStore(),
      rentalOrderClient_id: '',
      rentalOrderCar_id: '',
      rentalOrderPickup_date: '',
      rentalOrderDropoff_date: '',
      rentalOrderTotal_price: '',

    }
  },
  computed: {
    errorMessage() {
      return this.dataStore.errorMessage
    },
    errorCode() {
      return this.dataStore.errorCode
    },
    clients() {
      return this.dataStore.clients;
    },
    cars() {
      return this.dataStore.cars;
    },

    clientOptions() {
      return this.clients.map(client => ({
        id: client.id,
        fullName: `${client.name} ${client.lastName}`
      }));
    },

    carOptions() {
      return this.cars.map(car => ({
        id: car.id,
        fullTitle: `${car.brand} ${car.model}`
      }));
    },

    selectedCar() {
      return this.cars.find(car => car.id === this.rentalOrderCar_id) || null;
    },

    rentalDays() {
      if (!this.rentalOrderPickup_date || !this.rentalOrderDropoff_date) {
        return 0;
      }

      const pickup = new Date(this.rentalOrderPickup_date);
      const dropoff = new Date(this.rentalOrderDropoff_date);

      const diffTime = dropoff - pickup;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      return diffDays > 0 ? diffDays : 0;
    },

    rentalOrderTotal_price() {
      if (!this.selectedCar) {
        return 0;
      }

      return this.rentalDays * this.selectedCar.price;
    },
  },
  async mounted() {
    await this.dataStore.get_clients(0, 1000);
    await this.dataStore.get_cars(0, 1000);
  },

  methods: {
    formatDate(date) {
      if (!date) return '';

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');

      return `${year}-${month}-${day}`;
    },
    async createRentalOrder() {
      const formData = new FormData();
      formData.append('client_id', this.rentalOrderClient_id);
      formData.append('car_id', this.rentalOrderCar_id);
      formData.append('pickup_date', this.formatDate(this.rentalOrderPickup_date));
      formData.append('dropoff_date', this.formatDate(this.rentalOrderDropoff_date));
      formData.append('total_price', this.rentalOrderTotal_price);
      await this.dataStore.create_rentalOrder(formData);
      if (this.errorCode > 0)
        this.$toast.add({
          severity: 'error',
          summary: "Ошибка добавления данных",
          detail: this.errorMessage,
          life: 4000
        });
      else
        this.$toast.add({
          severity: 'success',
          summary: 'Данные успешно добавлены',
          detail: this.errorMessage,
          life: 4000
        });
    }
  },
}
</script>

<template>
  <div class="flex justify-center">
    <form v-on:submit.prevent="createRentalOrder" class="w-1/2 p-6">
      <h2 class="text-2xl mb-4 text-center" style="color: dimgray">Создать заказ аренды</h2>
      <div class="flex flex-col mt-4">
        <label class="mb-2">Клиент</label>
        <Dropdown v-model="rentalOrderClient_id" :options="clientOptions" optionLabel="fullName" optionValue="id" placeholder="Выберите клиента" class="w-full"/>
      </div>
      <div class="flex flex-col mt-4">
        <label class="mb-2">Автомобиль</label>
        <Dropdown v-model="rentalOrderCar_id" :options="carOptions" optionLabel="fullTitle" optionValue="id" placeholder="Выберите автомобиль" class="w-full"/>
      </div>
      <div class="flex flex-col mt-4">
        <label class="mb-2">Дата начала аренды</label>
        <Calendar v-model="rentalOrderPickup_date" dateFormat="yy-mm-dd" showIcon class="w-full"
        />
      </div>
      <div class="flex flex-col mt-4">
        <label class="mb-2">Дата окончания аренды</label>
        <Calendar v-model="rentalOrderDropoff_date" dateFormat="yy-mm-dd" showIcon class="w-full"/>
      </div>
      <div class="flex flex-col mt-4">
        <label class="mb-2">Стоимость аренды</label>
        <InputText :value="rentalOrderTotal_price + ' ₽'" readonly class="w-full"/>
      </div>
      <div class="flex flex-col mt-6">
        <Button type="submit" label="Создать"/>
      </div>
    </form>
  </div>
  <Toast position="bottom-right"/>
</template>

<style scoped>

</style>
