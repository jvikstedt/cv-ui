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
import AuthModule from "@/store/modules/auth";

const GOOGLE_CLIENT_ID = process.env.VUE_APP_GOOGLE_CLIENT_ID;

interface WC {
  id_token: string;
}

interface AuthData {
  wc: WC;
}

@Component
export default class GoogleSignInButton extends Vue {
  isReady = false;
  interval = 0;
  googleSignInParams = {
    ["client_id"]: GOOGLE_CLIENT_ID,
  };

  async onSignInSuccess(authData: AuthData): Promise<void> {
    await AuthModule.googleSignIn(authData.wc.id_token);
    this.$router.push("/");
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
