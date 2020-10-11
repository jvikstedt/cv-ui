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

        <MonthPicker
          v-model="startYearMonth"
          name="startYearMonth"
          :rules="isRequiredRule"
          label="Start year and month"
        />
        <MonthPicker
          v-model="endYearMonth"
          name="endYearMonth"
          label="End year and month"
        />

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
import { MonthPicker } from "@/components/form";
import { YearMonth } from "@/components/form/MonthPicker.vue";

@Component({
  components: {
    MembershipSkillsField,
    MonthPicker,
  },
})
export default class EditProjectMembershipDialog extends Mixins(
  DialogFormMixin
) {
  @Prop({ required: true }) readonly projectMembership!: ProjectMembership;

  description = "";
  startYearMonth = new YearMonth();
  endYearMonth = new YearMonth();
  highlight = false;
  membershipSkills: MembershipSkillDto[] = [];

  created(): void {
    this.description = this.projectMembership.description;
    this.startYearMonth = {
      year: this.projectMembership.startYear,
      month: this.projectMembership.startMonth,
    };
    this.endYearMonth = {
      year: this.projectMembership.endYear,
      month: this.projectMembership.endMonth,
    };
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
    if (
      this.form.validate() &&
      this.startYearMonth.year &&
      this.startYearMonth.month
    ) {
      const patchProjectMembershipDto: PatchProjectMembershipDto = {
        cvId: this.projectMembership.cvId,
        projectMembershipId: this.projectMembership.id,
        data: {
          description: this.description,
          startYear: this.startYearMonth.year,
          startMonth: this.startYearMonth.month,
          endYear: this.endYearMonth.year,
          endMonth: this.endYearMonth.month,
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
