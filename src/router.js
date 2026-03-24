import {createRouter, createWebHistory} from "vue-router";
import {useAuthStore} from "@/stores/authStore";
import Home from '@/components/Home.vue'
import Cars from '@/components/Cars.vue'
import Clients from "@/components/Clients.vue";

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
    path: '/clients',
    component: Clients,
    meta: {requiresAdmin: true},
  },
];
const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  if (to.meta.requiresAdmin) {
    if (!authStore.user) {
      return next("/");
    }

    if (!authStore.user.is_admin) {
      return next("/");
    }
  }

  next();
});
export default router;
