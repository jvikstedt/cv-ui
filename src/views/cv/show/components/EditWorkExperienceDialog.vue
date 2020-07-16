<template>
  <v-card>
    <v-card-title class="headline">{{
      workExperience.company.name
    }}</v-card-title>

    <v-form ref="form" v-model="valid" lazy-validation @submit.prevent="onSave">
      <v-card-text>
        <v-text-field
          v-model="jobTitle"
          :counter="255"
          :rules="jobTitleRules"
          label="Job title"
          required
        ></v-text-field>

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

        <v-btn color="red darken-1" text @click="onWorkExperienceDelete">
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
  WorkExperience,
  PatchWorkExperienceDto,
  DeleteWorkExperienceDto
} from "@/model/work_experience";
import { VForm } from "@/types";

const CVShowStore = namespace("CVShowStore");
const DialogStore = namespace("DialogStore");

@Component
export default class EditWorkExperienceDialog extends Vue {
  @Prop({ required: true }) readonly workExperienceId!: number;

  valid = false;
  jobTitle = "";
  jobTitleRules = [(v: string) => !!v || "Job title is required"];
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
  patchWorkExperience!: (
    patchWorkExperienceDto: PatchWorkExperienceDto
  ) => Promise<void>;

  @DialogStore.Mutation
  popDialogComponent!: () => void;

  @CVShowStore.Getter
  getWorkExperience!: (workExperienceId: number) => WorkExperience;

  @CVShowStore.Action
  deleteWorkExperience!: (
    deleteWorkExperienceDto: DeleteWorkExperienceDto
  ) => Promise<void>;

  get workExperience(): WorkExperience {
    return this.getWorkExperience(this.workExperienceId);
  }

  get form(): VForm {
    return this.$refs.form as VForm;
  }

  created() {
    this.jobTitle = this.workExperience.jobTitle;
    this.description = this.workExperience.description;
    this.startYear = this.workExperience.startYear;
    this.startMonth = this.workExperience.startMonth;
    this.endYear = this.workExperience.endYear;
    this.endMonth = this.workExperience.endMonth;
  }

  async onWorkExperienceDelete() {
    this.popDialogComponent();

    const workExperience = this.getWorkExperience(this.workExperienceId);

    const deleteWorkExperienceDto = {
      cvId: workExperience.cvId,
      workExperienceId: workExperience.id
    };

    await this.deleteWorkExperience(deleteWorkExperienceDto);
  }

  async onSave() {
    if (this.form.validate()) {
      const workExperience = this.getWorkExperience(this.workExperienceId);

      const patchWorkExperienceDto: PatchWorkExperienceDto = {
        cvId: workExperience.cvId,
        workExperienceId: workExperience.id,
        data: {
          jobTitle: this.jobTitle,
          description: this.description,
          startYear: this.startYear,
          startMonth: this.startMonth,
          endYear: this.endYear,
          endMonth: this.endMonth
        }
      };
      await this.patchWorkExperience(patchWorkExperienceDto);

      this.popDialogComponent();
    }
  }

  async onCancel() {
    this.popDialogComponent();
  }
}
</script>
