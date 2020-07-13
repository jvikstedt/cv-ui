<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <HelloWorld />
    <v-btn color="primary" @click="openMyCV">
      My CV
    </v-btn>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import HelloWorld from "@/components/HelloWorld.vue";
import { namespace } from "vuex-class";
import { TokenData } from "@/model/user";

const AuthStore = namespace("AuthStore");

@Component({
  components: {
    HelloWorld
  }
})
export default class Home extends Vue {
  @AuthStore.Getter
  public user!: TokenData;

  public async openMyCV() {
    const cvId = this.user.cvIds[0];
    this.$router.push(`/cv/${cvId}`);
  }
}
</script>
