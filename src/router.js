import { createRouter, createWebHistory } from "vue-router";
import Home from '@/components/Home.vue'
import Cars from '@/components/Cars.vue'
import Contacts from '@/components/Contacts.vue'
const routes = [
  {
    path: '/',
    component: Home,
  },
  {
    path: '/cars',
    component: Cars,
  },
  {
    path: '/contacts',
    component: Contacts,
  },
];
const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
