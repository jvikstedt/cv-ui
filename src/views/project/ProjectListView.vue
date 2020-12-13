<template>
  <v-container style="max-width: 1024px">
    <ProjectList />
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import ProjectList from "./components/ProjectList.vue";

@Component({
  components: {
    ProjectList,
  },
})
export default class ProjectListView extends Vue {}
</script>
