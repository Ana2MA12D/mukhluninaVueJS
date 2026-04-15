<script>
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import {useDataStore} from "@/stores/dataStore.js";
import Toast from "primevue/toast";

export default {
  name: "CreateCar",
  components: {InputText, Button, Toast},
  data() {
    return {
      dataStore: useDataStore(),
      carBrand: '',
      carModel: '',
      carGov_number: '',
      carStatus: '',
      carPrice: '',
      carImage: null,
    }
  },
  computed: {
    errorMessage() {
      return this.dataStore.errorMessage
    },
    errorCode() {
      return this.dataStore.errorCode
    }
  },

  methods: {
    changeCaption(event) {
      const file = event.target.files[0];
      if (file) {
        document.getElementById('file-label').innerHTML = '<span class="pi pi-file mx-3"></span>' + file.name;
        this.carImage = file;
      } else {
        document.getElementById('file-label').innerHtml = '<span class="pi pi-upload mx-3"></span>Выбрать изображение';
        this.carImage = null;
      }
    },

    async createCar() {
      const formData = new FormData();
      formData.append('brand', this.carBrand);
      formData.append('model', this.carModel);
      formData.append('gov_number', this.carGov_number);
      formData.append('status', this.carStatus);
      formData.append('price', this.carPrice);
      formData.append('image', this.carImage);
      await this.dataStore.create_car(formData);
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
  }
}
</script>

<template>
  <div class="flex justify-center">
    <form v-on:submit.prevent="createCar" class="w-1/2 p-6">
      <h2 class="text-2xl mb-4 text-center" style="color: dimgray">Добавление автомобиля</h2>
      <div class="flex flex-col mt-4">
        <InputText type="text" placeholder="Введите марку авто" v-model="this.carBrand"/>
      </div>
      <div class="flex flex-col mt-4">
        <InputText type="text" placeholder="Введите модель авто" v-model="this.carModel"/>
      </div>
      <div class="flex flex-col mt-4">
        <InputText type="text" placeholder="Введите номер авто" v-model="this.carGov_number"/>
      </div>
      <div class="flex flex-col mt-4">
        <InputText type="text" placeholder="Введите цену авто" v-model="this.carPrice"/>
      </div>
      <div class="mt-4">
        <span class="block mb-2 text-gray-600">Статус автомобиля</span>
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-2">
            <input type="radio" id="status-free" value="true" v-model="this.carStatus" name="carStatus"/>
            <label for="status-free">Свободно</label>
          </div>
          <div class="flex items-center gap-2">
            <input type="radio" id="status-busy" value="false" v-model="this.carStatus" name="carStatus"/>
            <label for="status-busy">Занято</label>
          </div>
        </div>
      </div>
      <div class="mb-4 mt-4">
        <label for="file" id="file-label"
               class="block text-md font-medium text-gray-500 border border-gray-300 rounded-md p-2">
          <span class="pi pi-upload mx-3"></span>Выбрать изображение</label>
        <input type="file" hidden id="file" name="file" v-on:change="changeCaption" required
               accept="image/*">
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
