import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Home from "@/views/Home.vue";
import store from "@/store";

import { CVShowView } from "@/views/cv/show";
import { CVPDFView } from "@/views/cv/pdf";
import { LoginView } from "@/views/auth";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/login",
    name: "LoginView",
    component: LoginView,
    meta: {
      requiresAuth: false
    }
  },
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/cv/:id",
    name: "CVShowView",
    component: CVShowView,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/cv/:id/pdf",
    name: "CVPDFView",
    component: CVPDFView,
    meta: {
      requiresAuth: true
    }
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (store.getters["AuthStore/isLoggedIn"]) {
      next();
      return;
    }
    next("/login");
  } else {
    next();
  }
});

export default router;
