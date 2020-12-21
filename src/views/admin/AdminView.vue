<template>
  <v-container style="max-width: 1024px">
    <v-card>
      <v-card-title class="headline">Admin tools</v-card-title>

      <v-card-actions>
        <v-btn color="green darken-1" text @click="openPage('/admin/merge')"
          >Merge tool</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class AdminView extends Vue {
  openPage(page: string): void {
    this.$router.push(page);
  }
}
</script>
