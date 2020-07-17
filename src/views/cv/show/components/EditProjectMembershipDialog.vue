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
          :rules="descriptionRules"
          label="Description"
          required
        ></v-text-field>

        <v-text-field
          v-model.number="startYear"
          label="Start year"
          :rules="startYearRules"
          type="number"
          required
        ></v-text-field>

        <v-text-field
          v-model.number="startMonth"
          label="Start month"
          :rules="startMonthRules"
          type="number"
          required
        ></v-text-field>

        <v-text-field
          v-model.number="endYear"
          label="End year"
          :rules="endYearRules"
          type="number"
        ></v-text-field>

        <v-text-field
          v-model.number="endMonth"
          label="End month"
          :rules="endMonthRules"
          type="number"
        ></v-text-field>
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
import { Component, Vue, Prop } from "vue-property-decorator";
import { namespace } from "vuex-class";
import {
  ProjectMembership,
  PatchProjectMembershipDto,
  DeleteProjectMembershipDto
} from "@/model/project";
import { VForm } from "@/types";

const CVShowStore = namespace("CVShowStore");
const DialogStore = namespace("DialogStore");

@Component
export default class EditProjectMembershipDialog extends Vue {
  @Prop({ required: true }) readonly projectMembershipId!: number;

  valid = false;
  description = "";
  descriptionRules = [(v: string) => !!v || "Description is required"];
  startYear = 2010;
  startYearRules = [(v: number) => !!v || "Start year is required"];
  startMonth = 1;
  startMonthRules = [(v: number) => !!v || "Start month is required"];
  endYear = 2014;
  endYearRules = [(v: number) => !!v || "End year is required"];
  endMonth = 12;
  endMonthRules = [(v: number) => !!v || "End month is required"];

  @CVShowStore.Action
  patchProjectMembership!: (
    patchProjectMembershipDto: PatchProjectMembershipDto
  ) => Promise<void>;

  @DialogStore.Mutation
  popDialogComponent!: () => void;

  @CVShowStore.Getter
  getProjectMembership!: (projectMembershipId: number) => ProjectMembership;

  @CVShowStore.Action
  deleteProjectMembership!: (
    deleteProjectMembershipDto: DeleteProjectMembershipDto
  ) => Promise<void>;

  get projectMembership(): ProjectMembership {
    return this.getProjectMembership(this.projectMembershipId);
  }

  get form(): VForm {
    return this.$refs.form as VForm;
  }

  created() {
    this.description = this.projectMembership.description;
    this.startYear = this.projectMembership.startYear;
    this.startMonth = this.projectMembership.startMonth;
    this.endYear = this.projectMembership.endYear;
    this.endMonth = this.projectMembership.endMonth;
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
          endYear: this.endYear,
          endMonth: this.endMonth
        }
      };
      await this.patchProjectMembership(patchProjectMembershipDto);

      this.popDialogComponent();
    }
  }

  async onCancel() {
    this.popDialogComponent();
  }
}
</script>
