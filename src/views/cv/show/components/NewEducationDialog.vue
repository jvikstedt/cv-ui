<template>
  <v-card>
    <v-card-title class="headline">New Education</v-card-title>

    <v-form ref="form" v-model="valid" lazy-validation @submit.prevent="onSave">
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

        <v-btn color="red darken-1" text @click="onCancel">
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
import * as R from "ramda";
import { Component, Prop, Watch, Mixins } from "vue-property-decorator";
import { namespace } from "vuex-class";
import { Education, CreateEducationDto } from "@/model/education";
import { School } from "@/model/school";
import { SearchSchools } from "@/api/school";
import NewSchoolDialog from "@/views/school/components/NewSchoolDialog.vue";
import { DialogFormMixin } from "@/mixins";

const CVShowStore = namespace("CVShowStore");

@Component({
  components: {
    NewSchoolDialog
  }
})
export default class NewEducationDialog extends Mixins(DialogFormMixin) {
  @Prop({ required: true }) readonly id!: number;

  search = "";
  schools: School[] = [];
  school: School | null = null;

  degree = "";
  fieldOfStudy = "";
  description = "";
  startYear: number | null = null;
  endYear: number | null = null;
  highlight = false;

  @CVShowStore.Getter
  getCVEducations!: (id: number) => Education[];

  @CVShowStore.Action
  createEducation!: (createEducationDto: CreateEducationDto) => Promise<void>;

  @Watch("search")
  async searchChanged(keyword: string) {
    const schools = await SearchSchools({
      name: keyword || "",
      limit: 10
    });
    this.schools = R.reject(
      (school: School) =>
        !!R.find(
          (education: Education) => R.equals(school.id, education.school.id),
          this.getCVEducations(this.id)
        ),
      schools
    );
  }

  async onSave() {
    if (this.form.validate() && this.school && this.startYear) {
      const createEducationDto: CreateEducationDto = {
        cvId: this.id,
        schoolId: this.school.id,
        degree: this.degree,
        fieldOfStudy: this.fieldOfStudy,
        description: this.description,
        startYear: this.startYear,
        endYear: R.isEmpty(this.endYear) ? null : this.endYear,
        highlight: this.highlight
      };
      await this.createEducation(createEducationDto);
      this.popDialogComponent();
    }
  }

  async newSchool() {
    this.pushDialogComponent({
      component: NewSchoolDialog,
      props: { afterCreate: this.afterSchoolCreate }
    });
  }

  async afterSchoolCreate(school: School) {
    this.schools = [...this.schools, school];
    this.school = school;
  }
}
</script>
