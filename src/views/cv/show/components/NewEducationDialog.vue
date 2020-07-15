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
          :rules="schoolRules"
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
import * as R from "ramda";
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { namespace } from "vuex-class";
import { Education, CreateEducationDto, School } from "@/model/education";
import { SearchSchools } from "@/api/school";
import NewSchoolDialog from "@/views/school/components/NewSchoolDialog.vue";
import { DialogComponent } from "@/dialog";
import { VForm } from "@/types";

const CVShowStore = namespace("CVShowStore");
const DialogStore = namespace("DialogStore");

@Component({
  components: {
    NewSchoolDialog
  }
})
export default class NewEducationDialog extends Vue {
  @Prop({ required: true }) readonly id!: number;

  valid = false;
  search = "";
  schools: School[] = [];
  school: School | null = null;
  schoolRules = [(school: School) => !!school || "School is required"];

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

  @CVShowStore.Getter
  getCVEducations!: (id: number) => Education[];

  @CVShowStore.Action
  createEducation!: (createEducationDto: CreateEducationDto) => Promise<void>;

  @DialogStore.Mutation
  popDialogComponent!: () => void;

  @DialogStore.Mutation
  pushDialogComponent!: (dialogComponent: DialogComponent) => void;

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

  get form(): VForm {
    return this.$refs.form as VForm;
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
        endYear: this.endYear
      };
      await this.createEducation(createEducationDto);
      this.popDialogComponent();
    }
  }

  async onCancel() {
    this.popDialogComponent();
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
