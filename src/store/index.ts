import Vue from "vue";
import Vuex from "vuex";
import { ORMDatabase } from "vuex-orm-decorators";

Vue.use(Vuex);

const store = new Vuex.Store({
  plugins: [ORMDatabase.install()]
});
export default store;
