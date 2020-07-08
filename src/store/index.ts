import Vue from "vue";
import Vuex from "vuex";

import { CVShowStore } from "@/views/cv/show";
import { CVSearchStore } from "@/views/cv/search";
import { CVPDFStore } from "@/views/cv/pdf";

import { DialogStore } from "@/dialog";

import { SkillSubjectStore } from "@/views/skill_subject";

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    CVShowStore,
    CVSearchStore,
    CVPDFStore,
    DialogStore,
    SkillSubjectStore
  }
});
export default store;
