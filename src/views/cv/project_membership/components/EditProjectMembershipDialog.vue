<template>
  <v-card>
    <v-card-title class="headline">{{
      projectMembership.project.name
    }}</v-card-title>

    <v-form ref="form" v-model="valid" lazy-validation @submit.prevent="onSave">
      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn
          v-if="canEdit"
          color="red darken-1"
          text
          @click="onProjectMembershipDelete"
        >
          Delete
        </v-btn>

        <v-btn color="red darken-1" text @click="onCancel"> Cancel </v-btn>

        <v-btn v-if="canEdit" color="green darken-1" text type="submit">
          Save
        </v-btn>
      </v-card-actions>
      <v-card-text>
        <v-text-field
          v-model="description"
          :counter="255"
          :rules="isRequiredRule"
          label="Description"
          required
          :readonly="!canEdit"
        ></v-text-field>

        <v-text-field
          v-model="role"
          :counter="255"
          :rules="isRequiredRule"
          label="Role"
          required
          :readonly="!canEdit"
        ></v-text-field>

        <MonthPicker
          v-model="startYearMonth"
          name="startYearMonth"
          :rules="startYearMonthRules"
          label="Start year and month"
          :readonly="!canEdit"
        />
        <MonthPicker
          v-model="endYearMonth"
          name="endYearMonth"
          label="End year and month"
          :rules="endYearMonthRules"
          :readonly="!canEdit"
        />

        <v-checkbox
          :readonly="!canEdit"
          v-model="highlight"
          label="Highlight"
        ></v-checkbox>

        <MembershipSkillsField
          :readonly="!canEdit"
          v-model="membershipSkills"
        />
      </v-card-text>
    </v-form>
  </v-card>
</template>

<script lang="ts">
import * as R from "ramda";
import { Component, Prop, Mixins, Watch } from "vue-property-decorator";
import { ProjectMembership } from "@/store/modules/project_membership";
import { MembershipSkillDto } from "@/store/modules/membership_skill";
import { DialogFormMixin } from "@/mixins";
import MembershipSkillsField from "./MembershipSkillsField.vue";
import { MonthPicker } from "@/components/form";
import { YearMonth } from "@/components/form/MonthPicker.vue";
import { ServiceManager, ProjectMembershipService } from "@/services";
import { DateAfter, DateBefore, IsRequired } from "@/helpers/validator";
import { DateTime } from "luxon";
import { InputValidationRules } from "vuetify";

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
  @Prop({ required: false }) readonly canEdit!: boolean;

  description = "";
  role = "";
  startYearMonth = new YearMonth();
  endYearMonth = new YearMonth();
  highlight = false;
  membershipSkills: MembershipSkillDto[] = [];

  startYearMonthRules: InputValidationRules = [
    IsRequired(),
    DateBefore(DateTime.local()),
  ];
  endYearMonthRules: InputValidationRules = [];

  @Watch("startYearMonth")
  async startYearMonthChanged(ym: YearMonth): Promise<void> {
    this.endYearMonthRules = [
      DateAfter(DateTime.fromFormat(`${ym.year}-${ym.month}`, "yyyy-M")),
    ];
  }

  created(): void {
    this.description = this.projectMembership.description;
    this.role = this.projectMembership.role;
    this.startYearMonth = {
      year: this.projectMembership.startYear,
      month: this.projectMembership.startMonth,
    };
    this.endYearMonth = {
      year: this.projectMembership.endYear || null,
      month: this.projectMembership.endMonth || null,
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

    await ServiceManager.projectMembership.deleteProjectMembership(
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
      const patchProjectMembershipDto: ProjectMembershipService.PatchProjectMembershipDto = {
        cvId: this.projectMembership.cvId,
        projectMembershipId: this.projectMembership.id,
        data: {
          description: this.description,
          role: this.role,
          startYear: this.startYearMonth.year,
          startMonth: this.startYearMonth.month,
          endYear: this.endYearMonth.year,
          endMonth: this.endYearMonth.month,
          highlight: this.highlight,
          membershipSkills: this.membershipSkills,
        },
      };
      await ServiceManager.projectMembership.patchProjectMembership(
        patchProjectMembershipDto
      );

      this.popDialogComponent();
    }
  }
}
</script>
