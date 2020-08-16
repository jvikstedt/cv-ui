import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Dashboard from "@/views/Dashboard.vue";
import store from "@/store";

import { CVShowView } from "@/views/cv/show";
import { CVExportView } from "@/views/cv/export";
import { LoginView } from "@/views/auth";
import { SkillSubjectListView } from "@/views/skill_subject";

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
    name: "Dashboard",
    component: Dashboard,
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
    path: "/cv/:id/export",
    name: "CVExportView",
    component: CVExportView,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/skill_subjects",
    name: "SkillSubjectListView",
    component: SkillSubjectListView,
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
