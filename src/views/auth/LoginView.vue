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
      <v-btn color="green darken-1" text type="login"> Login </v-btn>
      <GoogleSignInButton />
    </v-form>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import GoogleSignInButton from "@/views/auth/GoogleSignInButton.vue";
import { AuthCredentialsDto } from "@/store/modules/auth";
import { VForm } from "@/types";
import AuthModule from "@/store/modules/auth";
import { IsRequired } from "@/helpers/validator";

@Component({
  components: {
    GoogleSignInButton,
  },
})
export default class LoginView extends Vue {
  valid = false;
  username = "";
  usernameRules = [IsRequired()];
  password = "";
  passwordRules = [IsRequired()];

  get form(): VForm {
    return this.$refs.form as VForm;
  }

  async onSignIn(): Promise<void> {
    if (this.form.validate()) {
      const authCredentialsDto: AuthCredentialsDto = {
        username: this.username,
        password: this.password,
      };

      await AuthModule.signIn(authCredentialsDto);
      this.$router.push("/");
    }
  }
}
</script>
