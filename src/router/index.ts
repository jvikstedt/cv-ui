import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Home from "@/views/Home.vue";

import { CVShowView } from "@/views/cv/show";
import { CVSearchView } from "@/views/cv/search";
import { CVPDFView } from "@/views/cv/pdf";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/cv/search",
    name: "CVSearchView",
    component: CVSearchView
  },
  {
    path: "/cv/:id",
    name: "CVShowView",
    component: CVShowView
  },
  {
    path: "/cv/:id/pdf",
    name: "CVPDFView",
    component: CVPDFView
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
