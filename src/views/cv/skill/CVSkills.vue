<template>
  <v-card class="mt-5">
    <v-card-title class="headline">
      <v-icon left>mdi-code-braces</v-icon>
      Skills
    </v-card-title>

    <v-card-text>
      <v-subheader class="pa-0">Highlighted skills</v-subheader>
      <SkillChip
        v-for="skill in getCVHighlightedSkills"
        :key="skill.id"
        :skill="skill"
        :canEdit="canEdit"
      />

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
            <SkillChip
              v-for="skill in skillsBySkillGroup(skillGroupName)"
              :key="skill.id"
              :skill="skill"
              :canEdit="canEdit"
            />
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
import NewSkillDialog from "./components/NewSkillDialog.vue";
import DialogModule from "@/store/modules/dialog";
import SkillModule, { Skill } from "@/store/modules/skill";
import SkillChip from "./components/SkillChip.vue";
import { ServiceManager } from "@/services";

@Component({
  components: {
    SkillChip,
  },
})
export default class CVSkills extends Vue {
  @Prop({ required: true }) readonly cvId!: number;
  @Prop({ required: true }) readonly canEdit!: boolean;

  panel: number | null = null;

  get skills(): Skill[] {
    return SkillModule.listByCV(this.cvId);
  }

  get getCVHighlightedSkills(): Skill[] {
    return R.filter((skill: Skill) => skill.highlight, this.skills);
  }

  get getCVSkillsGrouped(): { [key: string]: Skill[] } {
    return R.groupBy(
      (skill: Skill) => skill.skillSubject.skillGroup.name,
      this.skills
    );
  }

  async created(): Promise<void> {
    await ServiceManager.skill.fetchCVSkills(this.cvId);
  }

  skillGroups(): string[] {
    return R.sort(
      (a, b) => a.localeCompare(b),
      Object.keys(this.getCVSkillsGrouped)
    );
  }

  skillsBySkillGroup(skillGroupName: string): Skill[] {
    return this.getCVSkillsGrouped[skillGroupName] || [];
  }

  newSkill(): void {
    DialogModule.pushDialogComponent({
      component: NewSkillDialog,
      props: {
        cvId: this.cvId,
        afterCreate: this.afterSkillCreate,
        existingSkills: this.skills,
      },
    });
  }

  afterSkillCreate(skill: Skill): void {
    const skillGroups = this.skillGroups();
    const index = R.findIndex(R.equals(skill.skillSubject.skillGroup.name))(
      skillGroups
    );
    this.panel = index != -1 ? index : null;
  }
}
</script>
