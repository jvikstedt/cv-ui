<template>
  <v-card>
    <v-card-title class="headline">{{
      projectMembership.project.name
    }}</v-card-title>

    <v-form ref="form" v-model="valid" lazy-validation @submit.prevent="onSave">
      <v-card-text>
        <v-text-field
          v-model="description"
          :counter="255"
          :rules="isRequiredRule"
          label="Description"
          required
        ></v-text-field>

        <v-text-field
          v-model.number="startYear"
          label="Start year"
          :rules="isRequiredRule"
          type="number"
          required
        ></v-text-field>

        <v-text-field
          v-model.number="startMonth"
          label="Start month"
          :rules="isRequiredRule"
          type="number"
          required
        ></v-text-field>

        <v-text-field
          v-model.number="endYear"
          label="End year"
          type="number"
        ></v-text-field>

        <v-text-field
          v-model.number="endMonth"
          label="End month"
          type="number"
        ></v-text-field>

        <v-checkbox v-model="highlight" label="Highlight"></v-checkbox>

        <MembershipSkillsField v-model="membershipSkills" />
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn color="red darken-1" text @click="onProjectMembershipDelete">
          Delete
        </v-btn>

        <v-btn color="red darken-1" text @click="onCancel"> Cancel </v-btn>

        <v-btn color="green darken-1" text type="submit"> Save </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script lang="ts">
import * as R from "ramda";
import { Component, Prop, Mixins } from "vue-property-decorator";
import ProjectMembershipModule, {
  ProjectMembership,
  PatchProjectMembershipDto,
} from "@/store/modules/project_membership";
import { MembershipSkillDto } from "@/store/modules/membership_skill";
import { DialogFormMixin } from "@/mixins";
import MembershipSkillsField from "./MembershipSkillsField.vue";

@Component({
  components: {
    MembershipSkillsField,
  },
})
export default class EditProjectMembershipDialog extends Mixins(
  DialogFormMixin
) {
  @Prop({ required: true }) readonly projectMembership!: ProjectMembership;

  description = "";
  startYear = 2010;
  startMonth = 1;
  endYear = 2014;
  endMonth = 12;
  highlight = false;
  membershipSkills: MembershipSkillDto[] = [];

  created(): void {
    this.description = this.projectMembership.description;
    this.startYear = this.projectMembership.startYear;
    this.startMonth = this.projectMembership.startMonth;
    this.endYear = this.projectMembership.endYear;
    this.endMonth = this.projectMembership.endMonth;
    this.highlight = this.projectMembership.highlight;
    this.membershipSkills = R.map(
      (membershipSkill) => ({
        skillSubjectId: membershipSkill.skill.skillSubjectId,
        automaticCalculation: membershipSkill.automaticCalculation,
        experienceInYears: membershipSkill.experienceInYears,
      }),
      this.projectMembership.membershipSkills || []
    );
  }

  async onProjectMembershipDelete(): Promise<void> {
    const deleteProjectMembershipDto = {
      cvId: this.projectMembership.cvId,
      projectMembershipId: this.projectMembership.id,
    };

    await ProjectMembershipModule.deleteProjectMembership(
      deleteProjectMembershipDto
    );
    this.popDialogComponent();
  }

  async onSave(): Promise<void> {
    if (this.form.validate()) {
      const patchProjectMembershipDto: PatchProjectMembershipDto = {
        cvId: this.projectMembership.cvId,
        projectMembershipId: this.projectMembership.id,
        data: {
          description: this.description,
          startYear: this.startYear,
          startMonth: this.startMonth,
          endYear: R.isEmpty(this.endYear) ? null : this.endYear,
          endMonth: R.isEmpty(this.endMonth) ? null : this.endMonth,
          highlight: this.highlight,
          membershipSkills: this.membershipSkills,
        },
      };
      await ProjectMembershipModule.patchProjectMembership(
        patchProjectMembershipDto
      );

      this.popDialogComponent();
    }
  }
}
</script>
