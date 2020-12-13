<template>
  <v-container style="max-width: 1024px">
    <SkillSubjectList />
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import SkillSubjectList from "./components/SkillSubjectList.vue";

@Component({
  components: {
    SkillSubjectList,
  },
})
export default class SkillSubjectListView extends Vue {}
</script>
