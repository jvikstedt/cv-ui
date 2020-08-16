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
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn color="red darken-1" text @click="onProjectMembershipDelete">
          Delete
        </v-btn>

        <v-btn color="green darken-1" text @click="onCancel">
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
import { Component, Prop, Mixins } from "vue-property-decorator";
import { namespace } from "vuex-class";
import {
  ProjectMembership,
  PatchProjectMembershipDto,
  DeleteProjectMembershipDto
} from "@/model/project_membership";
import { DialogFormMixin } from "@/mixins";

const CVShowStore = namespace("CVShowStore");

@Component
export default class EditProjectMembershipDialog extends Mixins(
  DialogFormMixin
) {
  @Prop({ required: true }) readonly projectMembershipId!: number;

  description = "";
  startYear = 2010;
  startMonth = 1;
  endYear = 2014;
  endMonth = 12;
  highlight = false;

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

  get projectMembership(): ProjectMembership {
    return this.getProjectMembership(this.projectMembershipId);
  }

  created() {
    this.description = this.projectMembership.description;
    this.startYear = this.projectMembership.startYear;
    this.startMonth = this.projectMembership.startMonth;
    this.endYear = this.projectMembership.endYear;
    this.endMonth = this.projectMembership.endMonth;
    this.highlight = this.projectMembership.highlight;
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
          highlight: this.highlight
        }
      };
      await this.patchProjectMembership(patchProjectMembershipDto);

      this.popDialogComponent();
    }
  }
}
</script>
