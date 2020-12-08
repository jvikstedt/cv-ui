<template>
  <v-card>
    <v-card-title class="headline">{{ education.school.name }}</v-card-title>

    <v-form
      ref="form"
      v-model="valid"
      lazy-validation
      :readonly="!canEdit"
      @submit.prevent="onSave"
    >
      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn
          v-if="canEdit"
          color="red darken-1"
          text
          @click="onEducationDelete"
        >
          Delete
        </v-btn>

        <v-btn color="red darken-1" text @click="onCancel"> Cancel </v-btn>

        <v-btn v-if="canEdit" color="green darken-1" text type="submit">
          Save
        </v-btn>
      </v-card-actions>
      <v-card-text>
        <v-autocomplete
          name="school"
          v-model="school"
          :items="schools"
          :search-input.sync="search"
          :rules="isRequiredRule"
          item-text="name"
          item-value="id"
          label="School"
          placeholder="Start typing to search"
          return-object
        >
          <template v-slot:append-outer>
            <v-btn @click="newSchool">New</v-btn>
          </template>
        </v-autocomplete>
      </v-card-text>
      <v-card-text>
        <v-text-field
          name="degree"
          v-model="degree"
          :counter="255"
          :rules="isRequiredRule"
          label="Degree"
          required
        ></v-text-field>

        <v-text-field
          name="fieldOfStudy"
          v-model="fieldOfStudy"
          :counter="255"
          :rules="isRequiredRule"
          label="Field of study"
          required
        ></v-text-field>

        <v-text-field
          name="description"
          v-model="description"
          :counter="255"
          label="Description"
          required
        ></v-text-field>

        <v-text-field
          name="startYear"
          v-model.number="startYear"
          label="Start year"
          :rules="startYearRules"
          type="number"
          required
        ></v-text-field>

        <v-text-field
          name="endYear"
          v-model.number="endYear"
          label="End year"
          :rules="endYearRules"
          type="number"
        ></v-text-field>

        <v-checkbox v-model="highlight" label="Highlight"></v-checkbox>
      </v-card-text>
    </v-form>
  </v-card>
</template>

<script lang="ts">
import * as R from "ramda";
import { Component, Prop, Mixins, Watch } from "vue-property-decorator";
import { DialogFormMixin } from "@/mixins";
import { Education } from "@/store/modules/education";
import { ServiceManager } from "@/services";
import { PatchEducationDto } from "@/services/education";
import { InputValidationRules } from "vuetify";
import { DateAfter, DateBefore, IsRequired } from "@/helpers/validator";
import { DateTime } from "luxon";
import SchoolModule, { School } from "@/store/modules/school";
import NewSchoolDialog from "@/views/school/components/NewSchoolDialog.vue";

@Component
export default class EditEducationDialog extends Mixins(DialogFormMixin) {
  @Prop({ required: true }) readonly education!: Education;
  @Prop({ required: false }) readonly canEdit!: boolean;

  search = "";
  school: School | null = null;

  degree = "";
  fieldOfStudy = "";
  description = "";
  startYear = DateTime.local().year;
  endYear?: number | null = null;
  highlight = false;

  startYearRules: InputValidationRules = [
    IsRequired(),
    DateBefore(DateTime.local(), "yyyy"),
  ];
  endYearRules: InputValidationRules = [];

  created(): void {
    this.school = this.education.school;
    this.degree = this.education.degree;
    this.fieldOfStudy = this.education.fieldOfStudy;
    this.description = this.education.description;
    this.startYear = this.education.startYear;
    this.endYear = this.education.endYear;
    this.highlight = this.education.highlight;

    this.startYearChanged(this.startYear);
  }

  @Watch("startYear")
  async startYearChanged(year: number): Promise<void> {
    this.endYearRules = [
      DateAfter(DateTime.fromFormat(`${year}`, "yyyy"), "yyyy"),
    ];
  }

  @Watch("search")
  async searchChanged(keyword: string): Promise<void> {
    await ServiceManager.school.searchSchools({
      name: keyword || "",
    });
  }

  get schools(): School[] {
    return SchoolModule.list;
  }

  async onEducationDelete(): Promise<void> {
    if (confirm("Are you sure you want to delete?")) {
      const deleteEducationDto = {
        cvId: this.education.cvId,
        educationId: this.education.id,
      };

      await ServiceManager.education.deleteEducation(deleteEducationDto);

      this.popDialogComponent();
    }
  }

  async onSave(): Promise<void> {
    if (this.form.validate()) {
      const patchEducationDto: PatchEducationDto = {
        cvId: this.education.cvId,
        educationId: this.education.id,
        data: {
          schoolId: this.school?.id,
          degree: this.degree,
          fieldOfStudy: this.fieldOfStudy,
          description: this.description,
          startYear: this.startYear,
          endYear: R.isEmpty(this.endYear) ? null : this.endYear,
          highlight: this.highlight,
        },
      };
      await ServiceManager.education.patchEducation(patchEducationDto);

      this.popDialogComponent();
    }
  }

  newSchool(): void {
    this.pushDialogComponent({
      component: NewSchoolDialog,
      props: { afterCreate: this.afterSchoolCreate },
    });
  }

  afterSchoolCreate(school: School): void {
    this.school = school;
  }
}
</script>
