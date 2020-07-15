<template>
  <v-card>
    <v-card-title class="headline">New Education</v-card-title>

    <v-card-text>
      <v-autocomplete
        name="school"
        v-model="school"
        :items="schools"
        :search-input.sync="search"
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
import * as R from "ramda";
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { namespace } from "vuex-class";
import { Education, CreateEducationDto, School } from "@/model/education";
import { SearchSchools } from "@/api/school";
import NewSchoolDialog from "@/views/school/components/NewSchoolDialog.vue";
import { DialogComponent } from "@/dialog";

const CVShowStore = namespace("CVShowStore");
const DialogStore = namespace("DialogStore");

@Component({
  components: {
    NewSchoolDialog
  }
})
export default class NewEducationDialog extends Vue {
  @Prop({ required: true }) readonly id!: number;

  private search = "";
  private schools: School[] = [];
  private school: School | null = null;

  private degree = "";
  private fieldOfStudy = "";
  private description = "";
  private startYear = 2010;
  private endYear = 2014;

  @CVShowStore.Getter
  public getCVEducations!: (id: number) => Education[];

  @CVShowStore.Action
  public createEducation!: (
    createEducationDto: CreateEducationDto
  ) => Promise<void>;

  @DialogStore.Mutation
  public popDialogComponent!: () => void;

  @DialogStore.Mutation
  public pushDialogComponent!: (dialogComponent: DialogComponent) => void;

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

  private async onSave() {
    if (this.school && this.startYear) {
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

  private async onCancel() {
    this.popDialogComponent();
  }

  private async newSchool() {
    this.pushDialogComponent({
      component: NewSchoolDialog,
      props: { afterCreate: this.afterSchoolCreate }
    });
  }

  private async afterSchoolCreate(school: School) {
    this.schools = [...this.schools, school];
    this.school = school;
  }
}
</script>
