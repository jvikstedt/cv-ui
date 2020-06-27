<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12">
        <p>{{ $t("message") }}</p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class HelloWorld extends Vue {}
</script>
