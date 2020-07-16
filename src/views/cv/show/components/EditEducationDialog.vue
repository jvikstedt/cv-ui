<template>
  <v-card>
    <v-card-title class="headline">{{ education.school.name }}</v-card-title>

    <v-form ref="form" v-model="valid" lazy-validation @submit.prevent="onSave">
      <v-card-text>
        <v-text-field
          v-model="degree"
          :counter="255"
          :rules="degreeRules"
          label="Degree"
          required
        ></v-text-field>

        <v-text-field
          v-model="fieldOfStudy"
          :counter="255"
          :rules="fieldOfStudyRules"
          label="Field of study"
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
          v-model.number="endYear"
          label="End year"
          :rules="endYearRules"
          type="number"
        ></v-text-field>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn color="red darken-1" text @click="onEducationDelete">
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
  Education,
  PatchEducationDto,
  DeleteEducationDto
} from "@/model/education";
import { VForm } from "@/types";

const CVShowStore = namespace("CVShowStore");
const DialogStore = namespace("DialogStore");

@Component
export default class EditEducationDialog extends Vue {
  @Prop({ required: true }) readonly educationId!: number;

  valid = false;
  degree = "";
  degreeRules = [(v: string) => !!v || "Degree is required"];
  fieldOfStudy = "";
  fieldOfStudyRules = [(v: string) => !!v || "Field of study is required"];
  description = "";
  descriptionRules = [(v: string) => !!v || "Description is required"];
  startYear = 2010;
  startYearRules = [(v: number) => !!v || "Start year is required"];
  endYear = 2014;
  endYearRules = [(v: number) => !!v || "End year is required"];

  @CVShowStore.Action
  patchEducation!: (patchEducationDto: PatchEducationDto) => Promise<void>;

  @DialogStore.Mutation
  popDialogComponent!: () => void;

  @CVShowStore.Getter
  getEducation!: (educationId: number) => Education;

  @CVShowStore.Action
  deleteEducation!: (deleteEducationDto: DeleteEducationDto) => Promise<void>;

  get education(): Education {
    return this.getEducation(this.educationId);
  }

  get form(): VForm {
    return this.$refs.form as VForm;
  }

  created() {
    this.degree = this.education.degree;
    this.fieldOfStudy = this.education.fieldOfStudy;
    this.description = this.education.description;
    this.startYear = this.education.startYear;
    this.endYear = this.education.endYear;
  }

  async onEducationDelete() {
    this.popDialogComponent();

    const education = this.getEducation(this.educationId);

    const deleteEducationDto = {
      cvId: education.cvId,
      educationId: education.id
    };

    await this.deleteEducation(deleteEducationDto);
  }

  async onSave() {
    if (this.form.validate()) {
      const education = this.getEducation(this.educationId);

      const patchEducationDto: PatchEducationDto = {
        cvId: education.cvId,
        educationId: education.id,
        data: {
          degree: this.degree,
          fieldOfStudy: this.fieldOfStudy,
          description: this.description,
          startYear: this.startYear,
          endYear: this.endYear
        }
      };
      await this.patchEducation(patchEducationDto);

      this.popDialogComponent();
    }
  }

  async onCancel() {
    this.popDialogComponent();
  }
}
</script>
