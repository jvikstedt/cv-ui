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
import { Component, Vue } from "vue-property-decorator";
import { namespace } from "vuex-class";

const AuthStore = namespace("AuthStore");

const GOOGLE_CLIENT_ID = process.env.VUE_APP_GOOGLE_CLIENT_ID;

@Component
export default class GoogleSignInButton extends Vue {
  googleSignInParams = {
    ["client_id"]: GOOGLE_CLIENT_ID
  };

  @AuthStore.Action
  googleSignIn!: (idToken: string) => Promise<void>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async onSignInSuccess(authData: any) {
    await this.googleSignIn(authData.wc.id_token);
    this.$router.push("/");
  }

  get isReady(): boolean {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return !!(window as any).gapi;
  }

  async onSignInError(err: Error) {
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
