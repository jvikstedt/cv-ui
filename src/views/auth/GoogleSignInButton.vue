<template>
  <g-signin-button
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

@Component
export default class GoogleSignInButton extends Vue {
  private googleSignInParams = {
    ["client_id"]:
      "433163468571-bqv3tk03pq1044qvir0qqkp3qunb3niu.apps.googleusercontent.com"
  };

  @AuthStore.Action
  public googleSignIn!: (idToken: string) => Promise<void>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async onSignInSuccess(authData: any) {
    await this.googleSignIn(authData.wc.id_token);
    this.$router.push("/");
  }

  private async onSignInError(err: Error) {
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
