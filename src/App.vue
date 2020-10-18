<template>
  <v-app id="inspire">
    <Dialog />
    <v-navigation-drawer
      v-model="drawer"
      app
      clipped
      v-if="isLoggedIn"
      style="background-color: #e3e3e3"
    >
      <v-list>
        <v-list-item link router to="/">
          <v-list-item-action>
            <v-icon>mdi-settings</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>
              <v-icon left>mdi-view-dashboard</v-icon>
              Dashboard
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link router to="/companies">
          <v-list-item-action>
            <v-icon>mdi-settings</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>
              <v-icon left>mdi-domain</v-icon>
              Companies
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link router to="/projects">
          <v-list-item-action>
            <v-icon>mdi-settings</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>
              <v-icon left>mdi-account-group</v-icon>
              Projects
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link router to="/schools">
          <v-list-item-action>
            <v-icon>mdi-settings</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>
              <v-icon left>mdi-school</v-icon>
              Schools
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link router to="/skill_groups">
          <v-list-item-action>
            <v-icon>mdi-settings</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>
              <v-icon left>mdi-group</v-icon>
              Skill Groups
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link router to="/skill_subjects">
          <v-list-item-action>
            <v-icon>mdi-settings</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>
              <v-icon left>mdi-code-braces</v-icon>
              Skill Subjects
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
        style="cursor: pointer; color: white"
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

    <v-main style="background-color: #e3e3e3">
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
import { Dialog } from "@/components/dialog";
import { CVSearchView, CVSearchBar } from "@/components/search";
import { Alert } from "@/components/alert";
import AlertModule, { AlertInfo } from "@/store/modules/alert";
import AuthModule from "@/store/modules/auth";
import DialogModule from "@/store/modules/dialog";

@Component({
  components: {
    CVSearchBar,
    Dialog,
    Alert,
  },
})
export default class App extends Vue {
  drawer = null;

  get isLoggedIn(): boolean {
    return AuthModule.isLoggedIn;
  }

  created(): void {
    this.$vuetify.theme.dark = false;

    axios.interceptors.response.use(
      (response) => response,
      (error) => {
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
          AlertModule.setAlert(
            new AlertInfo({
              message: error.toString(),
              color: "error",
              details: JSON.stringify(responseData, null, 2),
            })
          );
          if (error.response.status === 401) {
            this.$router.push("/login");
            resolve(AuthModule.logoutAction());
          }
          reject(error);
        });
      }
    );
  }

  async logout(): Promise<void> {
    this.$router.push("/login");
    await AuthModule.logoutAction();
  }

  onLogoClick(): void {
    this.$router.push("/");
  }

  search(): void {
    DialogModule.pushDialogComponent({
      component: CVSearchView,
      props: {},
    });
  }
}
</script>
