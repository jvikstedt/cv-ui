<template>
  <v-card>
    <v-card-title class="headline">{{
      projectMembership.project.name
    }}</v-card-title>

    <v-form
      ref="form"
      v-model="valid"
      lazy-validation
      :readonly="!canEdit"
      @submit.prevent="onSave"
    >
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
        <v-autocomplete
          name="project"
          v-model="project"
          :items="projects"
          :search-input.sync="search"
          :rules="isRequiredRule"
          item-text="name"
          item-value="id"
          label="Project"
          placeholder="Start typing to search"
          return-object
        >
          <template slot="selection" slot-scope="data">
            {{ data.item.name }} ({{ data.item.company.name }})
          </template>
          <template slot="item" slot-scope="data">
            {{ data.item.name }} ({{ data.item.company.name }})
          </template>
          <template v-slot:append-outer>
            <v-btn @click="newProject">New</v-btn>
          </template>
        </v-autocomplete>
      </v-card-text>
      <v-card-text>
        <v-text-field
          v-model="description"
          :counter="255"
          :rules="isRequiredRule"
          label="Description"
          required
        ></v-text-field>

        <v-text-field
          v-model="role"
          :counter="255"
          :rules="isRequiredRule"
          label="Role"
          required
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

        <v-checkbox v-model="highlight" label="Highlight"></v-checkbox>

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
import ProjectModule, { Project } from "@/store/modules/project";
import NewProjectDialog from "@/views/project/components/NewProjectDialog.vue";

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

  search = "";
  project: Project | null = null;

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

  created(): void {
    this.project = this.projectMembership.project || null;
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

  @Watch("startYearMonth")
  async startYearMonthChanged(ym: YearMonth): Promise<void> {
    this.endYearMonthRules = [
      DateAfter(DateTime.fromFormat(`${ym.year}-${ym.month}`, "yyyy-M")),
    ];
  }

  @Watch("search")
  async searchChanged(keyword: string): Promise<void> {
    await ServiceManager.project.searchProjects({
      name: keyword || "",
    });
  }

  get projects(): Project[] {
    return ProjectModule.list;
  }

  async onProjectMembershipDelete(): Promise<void> {
    if (confirm("Are you sure you want to delete?")) {
      const deleteProjectMembershipDto = {
        cvId: this.projectMembership.cvId,
        projectMembershipId: this.projectMembership.id,
      };

      await ServiceManager.projectMembership.deleteProjectMembership(
        deleteProjectMembershipDto
      );
      this.popDialogComponent();
    }
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
          projectId: this.project?.id,
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

  newProject(): void {
    this.pushDialogComponent({
      component: NewProjectDialog,
      props: { afterCreate: this.afterProjectCreate },
    });
  }

  afterProjectCreate(project: Project): void {
    this.project = project;
  }
}
</script>
