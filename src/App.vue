<template>
  <v-app id="inspire">
    <Dialog />
    <v-navigation-drawer v-model="drawer" app clipped v-if="isLoggedIn">
      <v-list dense>
        <v-list-item link router to="/skill_subjects">
          <v-list-item-action>
            <v-icon>mdi-settings</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Skill subjects</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app clipped-left>
      <v-app-bar-nav-icon
        @click.stop="drawer = !drawer"
        v-if="isLoggedIn"
      ></v-app-bar-nav-icon>
      <v-toolbar-title>Application</v-toolbar-title>
      <v-toolbar-title class="ml-2 d-none d-sm-flex" v-if="isLoggedIn">
        <v-divider class="mx-4" vertical></v-divider>
        <CVSearchBar />
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="search" class="d-flex d-sm-none" v-if="isLoggedIn">
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
      <v-btn icon @click="logout" v-if="isLoggedIn">
        <v-icon>mdi-exit-to-app</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <v-row align="center" justify="center">
          <Alert />
          <router-view />
        </v-row>
      </v-container>
    </v-main>

    <v-footer app>
      <span>&copy; 2020</span>
    </v-footer>
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
  private drawer = null;

  @AlertStore.Mutation
  public setAlert!: (alert: AlertInfo) => void;

  @DialogStore.Mutation
  public pushDialogComponent!: (dialogComponent: DialogComponent) => void;

  @AuthStore.Action
  public logoutAction!: () => Promise<void>;

  @AuthStore.Getter
  public isLoggedIn!: boolean;

  private async created() {
    this.$vuetify.theme.dark = false;

    axios.interceptors.response.use(
      response => response,
      error => {
        return new Promise((resolve, reject) => {
          this.setAlert(
            new AlertInfo({
              message: error.toString(),
              color: "error",
              details: JSON.stringify(error.response.data)
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

  private async logout() {
    this.$router.push("/login");
    await this.logoutAction();
  }

  public search() {
    this.pushDialogComponent({
      component: CVSearchView,
      props: {}
    });
  }
}
</script>
