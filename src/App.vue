<template>
  <v-app id="inspire">
    <Dialog />
    <v-navigation-drawer
      v-model="drawer"
      app
      clipped
      v-if="isLoggedIn"
      style="background-color: #E3E3E3"
    >
      <v-list>
        <v-list-item link router to="/skill_subjects">
          <v-list-item-action>
            <v-icon>mdi-settings</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>
              <v-icon left>mdi-code-braces</v-icon>
              Skills
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app clipped-left color="teal lighten-1">
      <v-app-bar-nav-icon
        @click.stop="drawer = !drawer"
        v-if="isLoggedIn"
        dark
      ></v-app-bar-nav-icon>
      <v-toolbar-title
        @click="onLogoClick"
        style="cursor: pointer; color: white;"
        >CV</v-toolbar-title
      >
      <v-toolbar-title class="ml-2 d-none d-sm-flex" v-if="isLoggedIn">
        <v-divider dark class="mx-4" vertical></v-divider>
        <CVSearchBar />
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        icon
        dark
        @click="search"
        class="d-flex d-sm-none"
        v-if="isLoggedIn"
      >
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
      <v-btn id="logout-btn" icon dark @click="logout" v-if="isLoggedIn">
        <v-icon>mdi-exit-to-app</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main style="background-color: #E3E3E3">
      <v-container fluid>
        <v-row align="center" justify="center">
          <Alert />
          <router-view />
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import axios from "axios";
import { Component, Vue } from "vue-property-decorator";
import { namespace } from "vuex-class";
import { Dialog, DialogComponent } from "@/dialog";
import { CVSearchView, CVSearchBar } from "@/views/cv/search";
import { Alert } from "@/alert";
import { AlertInfo } from "@/alert/store";

const DialogStore = namespace("DialogStore");
const AuthStore = namespace("AuthStore");
const AlertStore = namespace("AlertStore");

@Component({
  components: {
    CVSearchBar,
    Dialog,
    Alert
  }
})
export default class App extends Vue {
  drawer = null;

  @AlertStore.Mutation
  setAlert!: (alert: AlertInfo) => void;

  @DialogStore.Mutation
  pushDialogComponent!: (dialogComponent: DialogComponent) => void;

  @AuthStore.Action
  logoutAction!: () => Promise<void>;

  @AuthStore.Getter
  isLoggedIn!: boolean;

  async created() {
    this.$vuetify.theme.dark = false;

    axios.interceptors.response.use(
      response => response,
      error => {
        return new Promise((resolve, reject) => {
          let responseData = error.response.data;

          // When dealing with arraybuffer response, error message has to be
          // manually parsed
          if (
            error.request.responseType === "arraybuffer" &&
            responseData.toString() === "[object ArrayBuffer]"
          ) {
            responseData = JSON.parse(
              Buffer.from(responseData).toString("utf8")
            );
          }
          this.setAlert(
            new AlertInfo({
              message: error.toString(),
              color: "error",
              details: JSON.stringify(responseData, null, 2)
            })
          );
          if (error.response.status === 401) {
            this.$router.push("/login");
            resolve(this.logoutAction());
          }
          reject(error);
        });
      }
    );
  }

  async logout() {
    this.$router.push("/login");
    await this.logoutAction();
  }

  onLogoClick() {
    this.$router.push("/");
  }

  search() {
    this.pushDialogComponent({
      component: CVSearchView,
      props: {}
    });
  }
}
</script>
