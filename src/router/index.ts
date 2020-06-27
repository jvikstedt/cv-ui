import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Home from "@/views/Home.vue";
import SkillSubjectsListView from "@/views/skill_subjects/SkillSubjectsListView.vue";
import SkillSubjectsNewView from "@/views/skill_subjects/SkillSubjectsNewView.vue";
import SkillSubjectsEditView from "@/views/skill_subjects/SkillSubjectsEditView.vue";
import CVShowView from "@/views/cv/CVShowView.vue";
import PDFView from "@/views/PDFView.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/skill_subjects",
    name: "SkillSubjectsListView",
    component: SkillSubjectsListView
  },
  {
    path: "/skill_subjects/new",
    name: "SkillSubjectsNewView",
    component: SkillSubjectsNewView
  },
  {
    path: "/skill_subjects/:id/edit",
    name: "SkillSubjectsEditView",
    component: SkillSubjectsEditView
  },
  {
    path: "/cv/:id",
    name: "CVShowView",
    component: CVShowView
  },
  {
    path: "/cv/:id/pdf",
    name: "PDFView",
    component: PDFView
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
