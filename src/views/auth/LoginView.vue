<template>
  <div>
    <GoogleSignInButton />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import GoogleSignInButton from "@/views/auth/GoogleSignInButton.vue";

@Component({
  components: {
    GoogleSignInButton
  }
})
export default class LoginView extends Vue {}
</script>
