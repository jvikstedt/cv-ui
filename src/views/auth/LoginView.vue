<template>
  <div>
    <v-text-field v-model="username" label="Username" />
    <v-text-field v-model="password" label="Password" type="password" />
    <v-btn color="green darken-1" text @click="onSignIn">
      Login
    </v-btn>
    <GoogleSignInButton />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { namespace } from "vuex-class";
import GoogleSignInButton from "@/views/auth/GoogleSignInButton.vue";
import { AuthCredentialsDto } from "@/model/user";

const AuthStore = namespace("AuthStore");

@Component({
  components: {
    GoogleSignInButton
  }
})
export default class LoginView extends Vue {
  public username = "";
  public password = "";

  @AuthStore.Action
  public signIn!: (authCredentialsDto: AuthCredentialsDto) => Promise<void>;

  public async onSignIn() {
    const authCredentialsDto: AuthCredentialsDto = {
      username: this.username,
      password: this.password
    };

    await this.signIn(authCredentialsDto);
    this.$router.push("/");
  }
}
</script>
