<template>
  <v-card>
    <v-card-title class="headline">New Education</v-card-title>

    <v-form ref="form" v-model="valid" lazy-validation @submit.prevent="onSave">
      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn color="red darken-1" text @click="onCancel"> Cancel </v-btn>

        <v-btn color="green darken-1" text type="submit"> Save </v-btn>
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
import { Component, Prop, Watch, Mixins } from "vue-property-decorator";
import NewSchoolDialog from "@/views/school/components/NewSchoolDialog.vue";
import { DialogFormMixin } from "@/mixins";
import SchoolModule, { School } from "@/store/modules/school";
import { ServiceManager, EducationService } from "@/services";
import { InputValidationRules } from "vuetify";
import { DateAfter, DateBefore, IsRequired } from "@/helpers/validator";
import { DateTime } from "luxon";

@Component({
  components: {
    NewSchoolDialog,
  },
})
export default class NewEducationDialog extends Mixins(DialogFormMixin) {
  @Prop({ required: true }) readonly cvId!: number;

  search = "";
  school: School | null = null;

  degree = "";
  fieldOfStudy = "";
  description = "";
  startYear: number | null = null;
  endYear: number | null = null;
  highlight = false;

  startYearRules: InputValidationRules = [
    IsRequired(),
    DateBefore(DateTime.local(), "yyyy"),
  ];
  endYearRules: InputValidationRules = [];

  get schools(): School[] {
    return SchoolModule.list;
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

  async onSave(): Promise<void> {
    if (this.form.validate() && this.school && this.startYear) {
      const createEducationDto: EducationService.CreateEducationDto = {
        cvId: this.cvId,
        schoolId: this.school.id,
        degree: this.degree,
        fieldOfStudy: this.fieldOfStudy,
        description: this.description,
        startYear: this.startYear,
        endYear: R.isEmpty(this.endYear) ? null : this.endYear,
        highlight: this.highlight,
      };
      await ServiceManager.education.createEducation(createEducationDto);
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
