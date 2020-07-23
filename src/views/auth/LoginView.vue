<template>
  <div>
    <v-form
      ref="form"
      v-model="valid"
      lazy-validation
      @submit.prevent="onSignIn"
    >
      <v-text-field
        v-model="username"
        name="username"
        label="Username"
        :rules="usernameRules"
      />
      <v-text-field
        v-model="password"
        name="password"
        label="Password"
        :rules="passwordRules"
        type="password"
      />
      <v-btn color="green darken-1" text type="login">
        Login
      </v-btn>
      <GoogleSignInButton />
    </v-form>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { namespace } from "vuex-class";
import GoogleSignInButton from "@/views/auth/GoogleSignInButton.vue";
import { AuthCredentialsDto } from "@/model/user";
import { VForm } from "@/types";

const AuthStore = namespace("AuthStore");

@Component({
  components: {
    GoogleSignInButton
  }
})
export default class LoginView extends Vue {
  valid = false;
  username = "";
  usernameRules = [(v: string) => !!v || "Username is required"];
  password = "";
  passwordRules = [(v: string) => !!v || "Password is required"];

  @AuthStore.Action
  signIn!: (authCredentialsDto: AuthCredentialsDto) => Promise<void>;

  get form(): VForm {
    return this.$refs.form as VForm;
  }

  async onSignIn() {
    if (this.form.validate()) {
      const authCredentialsDto: AuthCredentialsDto = {
        username: this.username,
        password: this.password
      };

      await this.signIn(authCredentialsDto);
      this.$router.push("/");
    }
  }
}
</script>
