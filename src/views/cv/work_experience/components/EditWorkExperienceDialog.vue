<template>
  <v-card>
    <v-card-title class="headline">{{
      workExperience.company.name
    }}</v-card-title>

    <v-form ref="form" v-model="valid" lazy-validation @submit.prevent="onSave">
      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn
          v-if="canEdit"
          color="red darken-1"
          text
          @click="onWorkExperienceDelete"
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
          v-model="jobTitle"
          :counter="255"
          :rules="isRequiredRule"
          label="Job title"
          required
          :readonly="!canEdit"
        ></v-text-field>

        <v-text-field
          v-model="description"
          :counter="255"
          label="Description"
          required
          :readonly="!canEdit"
        ></v-text-field>

        <MonthPicker
          v-model="startYearMonth"
          name="startYearMonth"
          :rules="isRequiredRule"
          label="Start year and month"
          :readonly="!canEdit"
        />
        <MonthPicker
          v-model="endYearMonth"
          name="endYearMonth"
          label="End year and month"
          :readonly="!canEdit"
        />
      </v-card-text>
    </v-form>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Mixins } from "vue-property-decorator";
import { DialogFormMixin } from "@/mixins";
import WorkExperienceModule, {
  WorkExperience,
  PatchWorkExperienceDto,
} from "@/store/modules/work_experience";
import { MonthPicker } from "@/components/form";
import { YearMonth } from "@/components/form/MonthPicker.vue";

@Component({
  components: {
    MonthPicker,
  },
})
export default class EditWorkExperienceDialog extends Mixins(DialogFormMixin) {
  @Prop({ required: true }) readonly workExperience!: WorkExperience;

  jobTitle = "";
  description = "";
  startYearMonth = new YearMonth();
  endYearMonth = new YearMonth();

  created(): void {
    this.jobTitle = this.workExperience.jobTitle;
    this.description = this.workExperience.description;
    this.startYearMonth = {
      year: this.workExperience.startYear,
      month: this.workExperience.startMonth,
    };
    this.endYearMonth = {
      year: this.workExperience.endYear,
      month: this.workExperience.endMonth,
    };
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
    if (
      this.form.validate() &&
      this.startYearMonth.year &&
      this.startYearMonth.month
    ) {
      const patchWorkExperienceDto: PatchWorkExperienceDto = {
        cvId: this.workExperience.cvId,
        workExperienceId: this.workExperience.id,
        data: {
          jobTitle: this.jobTitle,
          description: this.description,
          startYear: this.startYearMonth.year,
          startMonth: this.startYearMonth.month,
          endYear: this.endYearMonth.year,
          endMonth: this.endYearMonth.month,
        },
      };
      await WorkExperienceModule.patchWorkExperience(patchWorkExperienceDto);

      this.popDialogComponent();
    }
  }
}
</script>
