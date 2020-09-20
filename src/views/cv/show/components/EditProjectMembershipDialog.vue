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

        <v-autocomplete
          name="skillSubjects"
          v-model="selectedSkillSubjects"
          :items="skillSubjects"
          :search-input.sync="searchSkillSubjects"
          item-text="name"
          item-value="id"
          label="Skills"
          placeholder="Start typing to search"
          multiple
          return-object
          chips
          deletable-chips
          cache-items
          height="100px"
        />
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn color="red darken-1" text @click="onProjectMembershipDelete">
          Delete
        </v-btn>

        <v-btn color="red darken-1" text @click="onCancel">
          Cancel
        </v-btn>

        <v-btn color="green darken-1" text type="submit">
          Save
        </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script lang="ts">
import * as R from "ramda";
import { Component, Prop, Mixins, Watch } from "vue-property-decorator";
import { namespace } from "vuex-class";
import {
  ProjectMembership,
  PatchProjectMembershipDto,
  DeleteProjectMembershipDto
} from "@/model/project_membership";
import { SkillSubject } from "@/model/skill_subject";
import { SearchSkillSubjects } from "@/api/skill_subject";
import { DialogFormMixin } from "@/mixins";
import { Skill } from "@/model/skill";

const CVShowStore = namespace("CVShowStore");

@Component
export default class EditProjectMembershipDialog extends Mixins(
  DialogFormMixin
) {
  @Prop({ required: true }) readonly projectMembershipId!: number;

  searchSkillSubjects = "";
  description = "";
  startYear = 2010;
  startMonth = 1;
  endYear = 2014;
  endMonth = 12;
  highlight = false;
  skillSubjects: SkillSubject[] = [];
  selectedSkillSubjects: SkillSubject[] = [];

  @CVShowStore.Action
  patchProjectMembership!: (
    patchProjectMembershipDto: PatchProjectMembershipDto
  ) => Promise<void>;

  @CVShowStore.Getter
  getProjectMembership!: (projectMembershipId: number) => ProjectMembership;

  @CVShowStore.Action
  deleteProjectMembership!: (
    deleteProjectMembershipDto: DeleteProjectMembershipDto
  ) => Promise<void>;

  @CVShowStore.Getter
  getSkill!: (skillId: number) => Skill;

  get projectMembership(): ProjectMembership {
    return this.getProjectMembership(this.projectMembershipId);
  }

  get getSkills(): Skill[] {
    return R.reject(
      R.isNil,
      R.map(s => this.getSkill(s.id), this.projectMembership.skills)
    );
  }

  created() {
    this.description = this.projectMembership.description;
    this.startYear = this.projectMembership.startYear;
    this.startMonth = this.projectMembership.startMonth;
    this.endYear = this.projectMembership.endYear;
    this.endMonth = this.projectMembership.endMonth;
    this.highlight = this.projectMembership.highlight;
    this.selectedSkillSubjects = this.skillSubjects = R.map(
      s => s.skillSubject,
      this.getSkills
    );
  }

  @Watch("searchSkillSubjects")
  async searchSkillSubjectsChanged(keyword: string) {
    this.skillSubjects = await SearchSkillSubjects({
      name: keyword || "",
      limit: 10
    });
  }

  async onProjectMembershipDelete() {
    this.popDialogComponent();

    const projectMembership = this.getProjectMembership(
      this.projectMembershipId
    );

    const deleteProjectMembershipDto = {
      cvId: projectMembership.cvId,
      projectMembershipId: projectMembership.id
    };

    await this.deleteProjectMembership(deleteProjectMembershipDto);
  }

  async onSave() {
    if (this.form.validate()) {
      const projectMembership = this.getProjectMembership(
        this.projectMembershipId
      );

      const patchProjectMembershipDto: PatchProjectMembershipDto = {
        cvId: projectMembership.cvId,
        projectMembershipId: projectMembership.id,
        data: {
          description: this.description,
          startYear: this.startYear,
          startMonth: this.startMonth,
          endYear: R.isEmpty(this.endYear) ? null : this.endYear,
          endMonth: R.isEmpty(this.endMonth) ? null : this.endMonth,
          highlight: this.highlight,
          skillSubjectIds: R.map(s => s.id, this.selectedSkillSubjects)
        }
      };
      await this.patchProjectMembership(patchProjectMembershipDto);

      this.popDialogComponent();
    }
  }
}
</script>
