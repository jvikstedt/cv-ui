import Vue from "vue";
import VueRouter, { Route, RouteConfig, RouteRecord } from "vue-router";
import Dashboard from "@/views/Dashboard.vue";
import store from "@/store";

import { CVShowView } from "@/views/cv";
import { CVExportView } from "@/views/cv/export";
import { LoginView } from "@/views/auth";
import { SkillSubjectListView } from "@/views/skill_subject";
import { CompanyListView } from "@/views/company";
import { ProjectListView } from "@/views/project";
import { SkillGroupListView } from "@/views/skill_group";
import { SchoolListView } from "@/views/school";
import { MergeRequestsView } from "@/views/merge_requests";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/login",
    name: "LoginView",
    component: LoginView,
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: "/",
    name: "Dashboard",
    component: Dashboard,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/cv/:id",
    name: "CVShowView",
    component: CVShowView,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/cv/:id/export",
    name: "CVExportView",
    component: CVExportView,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/skill_subjects",
    name: "SkillSubjectListView",
    component: SkillSubjectListView,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/companies",
    name: "CompanyListView",
    component: CompanyListView,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/projects",
    name: "ProjectListView",
    component: ProjectListView,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/skill_groups",
    name: "SkillGroupListView",
    component: SkillGroupListView,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/schools",
    name: "SchoolListView",
    component: SchoolListView,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/merge_requests",
    name: "MergeRequestsView",
    component: MergeRequestsView,
    meta: {
      requiresAuth: true,
    },
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

const guards = [
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (to: Route, _from: Route, next: any): boolean => {
    if (to.matched.some((record: RouteRecord) => record.meta.requiresAuth)) {
      if (!store.getters["auth/isLoggedIn"]) {
        next("/login");
        return false;
      }
    }
    return true;
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (to: Route, _from: Route, next: any): boolean => {
    return to.matched.every((record: RouteRecord) => {
      const requiredRoles = record.meta.requiredRoles || [];

      if (!store.getters["auth/hasRoles"](requiredRoles)) {
        next("/");
        return false;
      }
      return true;
    });
  },
];

router.beforeEach((to: Route, from: Route, next) => {
  if (guards.every((guard) => guard(to, from, next))) {
    next();
  }
});

export default router;
