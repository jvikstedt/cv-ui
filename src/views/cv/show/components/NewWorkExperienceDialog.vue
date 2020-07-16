<template>
  <v-card>
    <v-card-title class="headline">New work experience</v-card-title>

    <v-form ref="form" v-model="valid" lazy-validation @submit.prevent="onSave">
      <v-card-text>
        <v-autocomplete
          name="company"
          v-model="company"
          :items="companies"
          :search-input.sync="search"
          :rules="companyRules"
          item-text="name"
          item-value="id"
          label="Company"
          placeholder="Start typing to search"
          return-object
        >
          <template v-slot:append-outer>
            <v-btn @click="newCompany">New</v-btn>
          </template>
        </v-autocomplete>
      </v-card-text>

      <v-card-text>
        <v-text-field
          v-model="jobTitle"
          :counter="255"
          :rules="jobTitleRules"
          label="Job title"
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
          v-model.number="startMonth"
          label="Start month"
          :rules="startMonthRules"
          type="number"
          required
        ></v-text-field>

        <v-text-field
          v-model.number="endYear"
          label="End year"
          :rules="endYearRules"
          type="number"
        ></v-text-field>

        <v-text-field
          v-model.number="endMonth"
          label="End month"
          :rules="endMonthRules"
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
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { namespace } from "vuex-class";
import { DialogComponent } from "@/dialog";
import { VForm } from "@/types";
import { SearchCompanies } from "@/api/company";
import {
  Company,
  WorkExperience,
  CreateWorkExperienceDto
} from "@/model/work_experience";
import NewCompanyDialog from "@/views/company/components/NewCompanyDialog.vue";

const CVShowStore = namespace("CVShowStore");
const DialogStore = namespace("DialogStore");

@Component
export default class NewWorkExperienceDialog extends Vue {
  @Prop({ required: true }) readonly id!: number;

  valid = false;
  search = "";
  companies: Company[] = [];
  company: Company | null = null;
  companyRules = [(company: Company) => !!company || "Company is required"];

  jobTitle = "";
  jobTitleRules = [(v: string) => !!v || "Job title is required"];
  description = "";
  descriptionRules = [(v: string) => !!v || "Description is required"];
  startYear = 2010;
  startYearRules = [(v: number) => !!v || "Start year is required"];
  startMonth = 1;
  startMonthRules = [(v: number) => !!v || "Start month is required"];
  endYear = 2014;
  endYearRules = [(v: number) => !!v || "End year is required"];
  endMonth = 12;
  endMonthRules = [(v: number) => !!v || "End month is required"];

  @CVShowStore.Getter
  getCVWorkExperiences!: (id: number) => WorkExperience[];

  @CVShowStore.Action
  createWorkExperience!: (
    createWorkExperienceDto: CreateWorkExperienceDto
  ) => Promise<void>;

  @DialogStore.Mutation
  popDialogComponent!: () => void;

  @DialogStore.Mutation
  pushDialogComponent!: (dialogComponent: DialogComponent) => void;

  @Watch("search")
  async searchChanged(keyword: string) {
    this.companies = await SearchCompanies({
      name: keyword || "",
      limit: 10
    });
  }

  get form(): VForm {
    return this.$refs.form as VForm;
  }

  async onSave() {
    if (this.form.validate() && this.company) {
      const createWorkExperienceDto: CreateWorkExperienceDto = {
        cvId: this.id,
        companyId: this.company.id,
        jobTitle: this.jobTitle,
        description: this.description,
        startYear: this.startYear,
        startMonth: this.startMonth,
        endYear: this.endYear,
        endMonth: this.endMonth
      };
      await this.createWorkExperience(createWorkExperienceDto);
      this.popDialogComponent();
    }
  }

  async onCancel() {
    this.popDialogComponent();
  }

  async newCompany() {
    this.pushDialogComponent({
      component: NewCompanyDialog,
      props: { afterCreate: this.afterCompanyCreate }
    });
  }

  async afterCompanyCreate(company: Company) {
    this.companies = [...this.companies, company];
    this.company = company;
  }
}
</script>
