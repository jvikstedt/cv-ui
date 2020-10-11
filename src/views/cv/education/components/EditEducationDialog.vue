<template>
  <v-card>
    <v-card-title class="headline">{{ education.school.name }}</v-card-title>

    <v-form ref="form" v-model="valid" lazy-validation @submit.prevent="onSave">
      <v-card-text>
        <v-text-field
          v-model="degree"
          :counter="255"
          :rules="isRequiredRule"
          label="Degree"
          required
        ></v-text-field>

        <v-text-field
          v-model="fieldOfStudy"
          :counter="255"
          :rules="isRequiredRule"
          label="Field of study"
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
          v-model.number="endYear"
          label="End year"
          type="number"
        ></v-text-field>

        <v-checkbox v-model="highlight" label="Highlight"></v-checkbox>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn color="red darken-1" text @click="onEducationDelete">
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
import EducationModule, {
  Education,
  PatchEducationDto,
} from "@/store/modules/education";

@Component
export default class EditEducationDialog extends Mixins(DialogFormMixin) {
  @Prop({ required: true }) readonly education!: Education;

  degree = "";
  fieldOfStudy = "";
  description = "";
  startYear!: number;
  endYear: number | null = null;
  highlight = false;

  created(): void {
    this.degree = this.education.degree;
    this.fieldOfStudy = this.education.fieldOfStudy;
    this.description = this.education.description;
    this.startYear = this.education.startYear;
    this.endYear = this.education.endYear;
    this.highlight = this.education.highlight;
  }

  async onEducationDelete(): Promise<void> {
    this.popDialogComponent();

    const deleteEducationDto = {
      cvId: this.education.cvId,
      educationId: this.education.id,
    };

    await EducationModule.deleteEducation(deleteEducationDto);
  }

  async onSave(): Promise<void> {
    if (this.form.validate()) {
      const patchEducationDto: PatchEducationDto = {
        cvId: this.education.cvId,
        educationId: this.education.id,
        data: {
          degree: this.degree,
          fieldOfStudy: this.fieldOfStudy,
          description: this.description,
          startYear: this.startYear,
          endYear: R.isEmpty(this.endYear) ? null : this.endYear,
          highlight: this.highlight,
        },
      };
      await EducationModule.patchEducation(patchEducationDto);

      this.popDialogComponent();
    }
  }
}
</script>
