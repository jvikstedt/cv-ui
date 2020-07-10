import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import i18n from "./i18n";

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import GSignInButton from "vue-google-signin-button";

import "jsoneditor/dist/jsoneditor.min.css";

Vue.use(GSignInButton);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  i18n,
  render: h => h(App)
}).$mount("#app");
