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
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn color="red darken-1" text @click="onWorkExperienceDelete">
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
import { DialogFormMixin } from "@/mixins";
import WorkExperienceModule, {
  WorkExperience,
  PatchWorkExperienceDto,
} from "@/store/modules/work_experience";

@Component
export default class EditWorkExperienceDialog extends Mixins(DialogFormMixin) {
  @Prop({ required: true }) readonly workExperience!: WorkExperience;

  jobTitle = "";
  description = "";
  startYear!: number;
  startMonth!: number;
  endYear: number | null = null;
  endMonth: number | null = null;

  created(): void {
    this.jobTitle = this.workExperience.jobTitle;
    this.description = this.workExperience.description;
    this.startYear = this.workExperience.startYear;
    this.startMonth = this.workExperience.startMonth;
    this.endYear = this.workExperience.endYear;
    this.endMonth = this.workExperience.endMonth;
  }

  async onWorkExperienceDelete(): Promise<void> {
    this.popDialogComponent();

    const deleteWorkExperienceDto = {
      cvId: this.workExperience.cvId,
      workExperienceId: this.workExperience.id,
    };

    await WorkExperienceModule.deleteWorkExperience(deleteWorkExperienceDto);
  }

  async onSave(): Promise<void> {
    if (this.form.validate()) {
      const patchWorkExperienceDto: PatchWorkExperienceDto = {
        cvId: this.workExperience.cvId,
        workExperienceId: this.workExperience.id,
        data: {
          jobTitle: this.jobTitle,
          description: this.description,
          startYear: this.startYear,
          startMonth: this.startMonth,
          endYear: R.isEmpty(this.endYear) ? null : this.endYear,
          endMonth: R.isEmpty(this.endMonth) ? null : this.endMonth,
        },
      };
      await WorkExperienceModule.patchWorkExperience(patchWorkExperienceDto);

      this.popDialogComponent();
    }
  }
}
</script>
