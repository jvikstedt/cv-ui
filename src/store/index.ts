import Vue from "vue";
import Vuex from "vuex";

import { AuthStore } from "@/views/auth";
import { AlertStore } from "@/alert";

import { CVShowStore } from "@/views/cv/show";
import { CVSearchStore } from "@/views/cv/search";
import { CVPDFStore } from "@/views/cv/pdf";

import { DialogStore } from "@/dialog";

import { SkillSubjectStore } from "@/views/skill_subject";
import { SkillGroupStore } from "@/views/skill_group";
import { SchoolStore } from "@/views/school";
import { CompanyStore } from "@/views/company";

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    AuthStore,
    AlertStore,
    CVShowStore,
    CVSearchStore,
    CVPDFStore,
    DialogStore,
    SkillSubjectStore,
    SkillGroupStore,
    SchoolStore,
    CompanyStore
  }
});
export default store;
