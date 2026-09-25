import { createRouter, createWebHistory } from "vue-router";
import MainRoutes from "./MainRoutes";
import { useAuthStore } from "@/stores/auth";
export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [

    {
      path: "/auth/login2",
      component: () => import("@/views/authentication/auth2/Login.vue"),
      meta: { requiresAuth: false },
    },

    {
      path: "/auth/register2",
      component: () => import("@/views/authentication/auth2/Register.vue"),
      meta: { requiresAuth: false },
    },





    ...MainRoutes,

  ],
});

router.beforeEach((to) => {
  const auth = useAuthStore();
  const roles = to.meta.roles as string[] | undefined;
  if (roles && !roles.includes(auth.user.role)) return { path: '/' };
  return true;
});
