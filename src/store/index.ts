import Vue from "vue";
import Vuex from "vuex";

import { AuthStore } from "@/views/auth";

import { CVShowStore } from "@/views/cv/show";
import { CVSearchStore } from "@/views/cv/search";
import { CVPDFStore } from "@/views/cv/pdf";

import { DialogStore } from "@/dialog";

import { SkillSubjectStore } from "@/views/skill_subject";
import { SkillGroupStore } from "@/views/skill_group";

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    AuthStore,
    CVShowStore,
    CVSearchStore,
    CVPDFStore,
    DialogStore,
    SkillSubjectStore,
    SkillGroupStore
  }
});
export default store;
