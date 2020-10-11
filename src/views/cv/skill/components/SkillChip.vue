<template>
  <v-chip
    :key="skill.id"
    class="ma-2"
    :style="getChipStyle(skill)"
    text-color="blue-grey darken-4"
    v-on="canEdit ? { click: () => onSkillClick(skill) } : {}"
  >
    <v-avatar left class="">
      {{ Math.ceil(skillExperience.totalExperience) }}
    </v-avatar>
    {{ skill.skillSubject.name }}
    <v-icon v-if="skill.highlight" right>mdi-star</v-icon>
  </v-chip>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import EditSkillDialog from "./EditSkillDialog.vue";
import DialogModule from "@/store/modules/dialog";
import SkillModule, { Skill, SkillExperience } from "@/store/modules/skill";

@Component
export default class SkillChip extends Vue {
  @Prop({ required: true }) readonly skill!: Skill;
  @Prop({ required: true }) readonly canEdit!: boolean;

  get skillExperience(): SkillExperience | undefined {
    return SkillModule.skillExperience(this.skill.id);
  }

  getChipStyle(skill: Skill): string {
    return `background-color: rgb(76,175,80, ${skill.interestLevel * (1 / 3)})`;
  }

  onSkillClick(skill: Skill): void {
    DialogModule.pushDialogComponent({
      component: EditSkillDialog,
      props: {
        skill,
      },
    });
  }
}
</script>
