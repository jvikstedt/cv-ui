<template>
  <g-signin-button
    v-if="isReady"
    :params="googleSignInParams"
    @success="onSignInSuccess"
    @error="onSignInError"
  >
    Sign in with Google
  </g-signin-button>
</template>

<script lang="ts">
import * as R from "ramda";
import { Component, Vue } from "vue-property-decorator";
import AuthModule from "@/store/modules/auth";

const GOOGLE_CLIENT_ID = process.env.VUE_APP_GOOGLE_CLIENT_ID;

@Component
export default class GoogleSignInButton extends Vue {
  isReady = false;
  interval = 0;
  googleSignInParams = {
    ["client_id"]: GOOGLE_CLIENT_ID,
  };

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
  async onSignInSuccess(authData: any): Promise<void> {
    const key = R.keys(authData).find((e) =>
      R.includes("id_token", R.keys(authData[e]))
    );
    if (key) {
      await AuthModule.googleSignIn(authData[key].id_token);
      this.$router.push("/");
    }
  }

  created(): void {
    this.updateIsReady();

    this.interval = setInterval(() => {
      this.updateIsReady();
      if (this.isReady) {
        clearInterval(this.interval);
      }
    }, 500) as any; // eslint-disable-line @typescript-eslint/no-explicit-any
  }

  updateIsReady(): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((window as any).gapi) {
      this.isReady = true;
    } else {
      this.isReady = false;
    }
  }

  onSignInError(err: Error): void {
    console.log("error", err);
  }
}
</script>

<style>
.g-signin-button {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 3px;
  background-color: #3c82f7;
  color: #fff;
  box-shadow: 0 3px 0 #0f69ff;
  cursor: pointer;
}
</style>
