import {defineStore} from "pinia";
import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const useDataStore = defineStore('data', {
  state: () => ({
    cars: [],
    cars_total: null,
    clients: [],
    clients_total: null,
    items: [],
    errorCode: "",
    errorMessage: "",
  }),
  actions: {
    async get_cars(page = 0, perpage = 5, search = "") {
      this.errorMessage = "";
      try {
        const response = await axios.get(backendUrl + '/cars', {
          params: {
            page: page,
            perpage: perpage,
            search: search
          }
        });
        this.cars = response.data;
      } catch (error) {
        if (error.response) {
          this.errorCode = 1;
          this.errorMessage = error.response.data.message;
          console.log(error);
        } else if (error.request) {
          this.errorCode = 2;
          this.errorMessage = error.message;
          console.log(error);
        } else {
          this.errorCode = 3;
          console.log(error);
        }
      }
    },
    async get_cars_total(search = "") {
      this.errorMessage = "";
      try {
        const response = await axios.get(backendUrl + '/cars_total', {
          params: {
            search: search
          }
        });
        this.cars_total = response.data;
      } catch (error) {
        if (error.response) {
          this.errorCode = 1;
          this.errorMessage = error.response.data.message;
          console.log(error);
        } else if (error.request) {
          this.errorCode = 2;
          this.errorMessage = error.message;
          console.log(error);
        } else {
          this.errorCode = 3;
          console.log(error);
        }
      }
    },
    async get_clients(page = 0, perpage = 5) {
      this.errorMessage = "";
      try {
        const response = await axios.get(backendUrl + '/clients', {
          params: {
            page: page,
            perpage: perpage
          }
        });
        this.clients = response.data;
      } catch (error) {
        if (error.response) {
          this.errorMessage = error.response.data.message;
          console.log(error);
        } else if (error.request) {
          this.errorMessage = error.message;
          console.log(error);
        } else {
          console.log(error);
        }
      }
    },
    async get_clients_total() {
      this.errorMessage = "";
      try {
        const response = await axios.get(backendUrl + '/clients_total');
        this.clients_total = response.data;
      } catch (error) {
        if (error.response) {
          this.errorMessage = error.response.data.message;
          console.log(error);
        } else if (error.request) {
          this.errorMessage = error.message;
          console.log(error);
        } else {
          console.log(error);
        }
      }
    },
    async create_car(formData) {
      this.errorMessage = "";
      try {
        const response = await axios.post(backendUrl + '/car', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: 'Bearer ' + localStorage.getItem('token')
            },
          }
        );
        this.errorCode = response.data.code;
        this.errorMessage = response.data.message;
      } catch (error) {
        if (error.response) {
          this.errorCode = 11;
          this.errorMessage = error.response.data.message;
          console.log(error);
        } else if (error.request) {
          this.errorCode = 12;
          this.errorMessage = error.message;
          console.log(error);
        } else {
          this.errorCode = 13;
          console.log(error);
        }
      }
    },
    async create_rentalOrder(formData) {
      this.errorMessage = "";
      try {
        const response = await axios.post(backendUrl + '/rental_order', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: 'Bearer ' + localStorage.getItem('token')
            },
          }
        );
        this.errorCode = response.data.code;
        this.errorMessage = response.data.message;
      } catch (error) {
        if (error.response) {
          this.errorCode = 11;
          this.errorMessage = error.response.data.message;
          console.log(error);
        } else if (error.request) {
          this.errorCode = 12;
          this.errorMessage = error.message;
          console.log(error);
        } else {
          this.errorCode = 13;
          console.log(error);
        }
      }
    },
    async delete_car(id) {
      this.errorMessage = "";
      this.errorCode = 0;
      try {
        const response = await axios.delete(backendUrl + '/car/' + id, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: 'Bearer ' + localStorage.getItem('token')
          },
        });
        this.errorCode = response.data.code;
        this.errorMessage = response.data.error;
      } catch (error) {
        if (error.response) {
          this.errorCode = 11;
          this.errorMessage = error.response.data.message;
          console.log(error);
        } else if (error.request) {
          this.errorCode = 12;
          this.errorMessage = error.message;
          console.log(error);
        } else {
          this.errorCode = 13;
          console.log(error);
        }
      }
    },
    async update_car(formData, id) {
      this.errorMessage = "";
      try {
        console.log(formData);
        const response = await axios.post(backendUrl + '/car/' + id, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: 'Bearer ' + localStorage.getItem('token')
          },
        });
        this.errorCode = response.data.code;
        this.errorMessage = response.data.message;
      } catch (error) {
        if (error.response) {
          this.errorCode = 11;
          this.errorMessage = error.response.data.message;
          console.log(error);
        } else if (error.request) {
          this.errorCode = 12;
          this.errorMessage = error.message;
          console.log(error);
        } else {
          this.errorCode = 13;
          console.log(error);
        }
      }
    }
  },
});


