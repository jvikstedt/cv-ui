<template>
  <v-card>
    <v-card-title class="headline">{{ education.school.name }}</v-card-title>
    <v-card-text>
      <v-text-field
        v-model="degree"
        :counter="255"
        label="Degree"
        required
      ></v-text-field>

      <v-text-field
        v-model="fieldOfStudy"
        :counter="255"
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
        type="number"
        required
      ></v-text-field>

      <v-text-field
        v-model.number="endYear"
        label="End year"
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

      <v-btn color="green darken-1" text @click="onSave">
        Save
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { namespace } from "vuex-class";
import { PatchCVDto } from "@/model/cv";
import {
  Education,
  PatchEducationDto,
  DeleteEducationDto
} from "@/model/education";

const CVShowStore = namespace("CVShowStore");
const DialogStore = namespace("DialogStore");

@Component
export default class EditEducationDialog extends Vue {
  @Prop({ required: true }) readonly educationId!: number;

  private degree = "";
  private fieldOfStudy = "";
  private description = "";
  private startYear = 2010;
  private endYear = 2014;

  @CVShowStore.Action
  public patchEducation!: (
    patchEducationDto: PatchEducationDto
  ) => Promise<void>;

  @CVShowStore.Action
  public patchCV!: (patchCVDto: PatchCVDto) => Promise<void>;

  @DialogStore.Mutation
  public popDialogComponent!: () => void;

  @CVShowStore.Getter
  public getEducation!: (educationId: number) => Education;

  @CVShowStore.Action
  public deleteEducation!: (
    deleteEducationDto: DeleteEducationDto
  ) => Promise<void>;

  get education(): Education {
    return this.getEducation(this.educationId);
  }

  private created() {
    this.degree = this.education.degree;
    this.fieldOfStudy = this.education.fieldOfStudy;
    this.description = this.education.description;
    this.startYear = this.education.startYear;
    this.endYear = this.education.endYear;
  }

  private async onEducationDelete() {
    this.popDialogComponent();

    const education = this.getEducation(this.educationId);

    const deleteEducationDto = {
      cvId: education.cvId,
      educationId: education.id
    };

    await this.deleteEducation(deleteEducationDto);
  }

  private async onSave() {
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

  private async onCancel() {
    this.popDialogComponent();
  }
}
</script>
