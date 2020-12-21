<template>
  <v-container style="max-width: 1024px">
    <v-card>
      <v-card-title class="headline">Merge tool</v-card-title>

      <v-card-actions>
        <v-btn
          color="green darken-1"
          text
          @click="openMergeSkillSubjectsDialog"
        >
          Skill subjects
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import MergeSkillSubjectsDialog from "./components/MergeSkillSubjectsDialog.vue";
import DialogModule from "@/store/modules/dialog";

@Component
export default class MergeView extends Vue {
  openMergeSkillSubjectsDialog(): void {
    DialogModule.pushDialogComponent({
      component: MergeSkillSubjectsDialog,
      props: {},
    });
  }
}
</script>
