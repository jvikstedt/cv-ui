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
          :rules="isRequiredRule"
          label="Job title"
          required
        ></v-text-field>

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
          :rules="isRequiredRule"
          type="number"
        ></v-text-field>

        <v-text-field
          v-model.number="endMonth"
          label="End month"
          :rules="isRequiredRule"
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
import { Component, Prop, Mixins } from "vue-property-decorator";
import { namespace } from "vuex-class";
import {
  WorkExperience,
  PatchWorkExperienceDto,
  DeleteWorkExperienceDto
} from "@/model/work_experience";
import { DialogFormMixin } from "@/mixins";

const CVShowStore = namespace("CVShowStore");

@Component
export default class EditWorkExperienceDialog extends Mixins(DialogFormMixin) {
  @Prop({ required: true }) readonly workExperienceId!: number;

  jobTitle = "";
  description = "";
  startYear = 2010;
  startMonth = 1;
  endYear = 2014;
  endMonth = 12;

  @CVShowStore.Action
  patchWorkExperience!: (
    patchWorkExperienceDto: PatchWorkExperienceDto
  ) => Promise<void>;

  @CVShowStore.Getter
  getWorkExperience!: (workExperienceId: number) => WorkExperience;

  @CVShowStore.Action
  deleteWorkExperience!: (
    deleteWorkExperienceDto: DeleteWorkExperienceDto
  ) => Promise<void>;

  get workExperience(): WorkExperience {
    return this.getWorkExperience(this.workExperienceId);
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
}
</script>
