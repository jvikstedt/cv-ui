<template>
  <v-card class="mt-5" color="grey lighten-1">
    <v-card-title class="headline">
      <v-icon left>mdi-code-braces</v-icon>
      Skills
    </v-card-title>

    <v-card-text>
      <v-subheader class="pa-0">Highlighted skills</v-subheader>
      <v-chip
        :key="skill.id"
        class="ma-2"
        :style="getChipStyle(skill)"
        text-color="blue-grey darken-4"
        v-for="skill in getCVHighlightedSkills(id)"
        v-on="canEdit ? { click: () => onSkillClick(skill) } : {}"
      >
        <v-avatar left class="">
          {{ skill.experienceInYears }}
        </v-avatar>
        {{ skill.skillSubject.name }}
        <v-icon v-if="skill.highlight" right>mdi-star</v-icon>
      </v-chip>

      <v-subheader class="pa-0">Skill categories</v-subheader>
      <v-expansion-panels v-model="panel">
        <v-expansion-panel
          v-for="(skillGroupName, i) in skillGroups()"
          :key="i"
        >
          <v-expansion-panel-header>{{
            `${skillGroupName} (${skillsBySkillGroup(skillGroupName).length})`
          }}</v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-chip
              :key="skill.id"
              class="ma-2"
              :style="getChipStyle(skill)"
              text-color="blue-grey darken-4"
              v-for="skill in skillsBySkillGroup(skillGroupName)"
              v-on="canEdit ? { click: () => onSkillClick(skill) } : {}"
            >
              <v-avatar left class="">
                {{ skill.experienceInYears }}
              </v-avatar>
              {{ skill.skillSubject.name }}
              <v-icon v-if="skill.highlight" right>mdi-star</v-icon>
            </v-chip>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card-text>
    <v-card-actions>
      <v-btn v-if="canEdit" color="primary" @click="newSkill">New Skill</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import * as R from "ramda";
import { Component, Vue, Prop } from "vue-property-decorator";
import { namespace } from "vuex-class";
import { Skill } from "@/model/skill";
import { DialogComponent } from "@/dialog";
import EditSkillDialog from "./components/EditSkillDialog.vue";
import NewSkillDialog from "./components/NewSkillDialog.vue";

const CVShowStore = namespace("CVShowStore");
const DialogStore = namespace("DialogStore");

@Component
export default class CVSkills extends Vue {
  @Prop({ required: true }) readonly id!: number;
  @Prop({ required: true }) readonly canEdit!: boolean;

  panel: number | null = null;

  @CVShowStore.Getter
  getCVSkillsGrouped!: (id: number) => { [key: string]: Skill[] };

  @CVShowStore.Getter
  getCVHighlightedSkills!: (id: number) => Skill[];

  @DialogStore.Mutation
  pushDialogComponent!: (dialogComponent: DialogComponent) => void;

  getChipStyle(skill: Skill): string {
    return `background-color: rgb(76,175,80, ${skill.interestLevel * (1 / 3)})`;
  }

  skillGroups(): string[] {
    return R.sort(
      (a, b) => a.localeCompare(b),
      Object.keys(this.getCVSkillsGrouped(this.id))
    );
  }

  skillsBySkillGroup(skillGroupName: string): Skill[] {
    return this.getCVSkillsGrouped(this.id)[skillGroupName] || [];
  }

  async onSkillClick(skill: Skill) {
    this.pushDialogComponent({
      component: EditSkillDialog,
      props: { skillId: skill.id }
    });
  }

  async newSkill() {
    this.pushDialogComponent({
      component: NewSkillDialog,
      props: {
        id: this.id,
        afterCreate: this.afterSkillCreate
      }
    });
  }

  async afterSkillCreate(skill: Skill) {
    const skillGroups = this.skillGroups();
    const index = R.findIndex(R.equals(skill.skillSubject.skillGroup.name))(
      skillGroups
    );
    this.panel = index != -1 ? index : null;
  }
}
</script>
