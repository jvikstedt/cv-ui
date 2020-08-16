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
          :rules="isRequiredRule"
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
          :rules="isRequiredRule"
          label="Job title"
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
          v-model.number="startMonth"
          label="Start month"
          :rules="isRequiredRule"
          type="number"
          required
        ></v-text-field>

        <v-text-field
          v-model.number="endYear"
          label="End year"
          type="number"
        ></v-text-field>

        <v-text-field
          v-model.number="endMonth"
          label="End month"
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
import { Component, Prop, Watch, Mixins } from "vue-property-decorator";
import { namespace } from "vuex-class";
import { SearchCompanies } from "@/api/company";
import {
  WorkExperience,
  CreateWorkExperienceDto
} from "@/model/work_experience";
import { Company } from "@/model/company";
import NewCompanyDialog from "@/views/company/components/NewCompanyDialog.vue";
import { DialogFormMixin } from "@/mixins";

const CVShowStore = namespace("CVShowStore");

@Component
export default class NewWorkExperienceDialog extends Mixins(DialogFormMixin) {
  @Prop({ required: true }) readonly id!: number;

  search = "";
  companies: Company[] = [];
  company: Company | null = null;

  jobTitle = "";
  description = "";
  startYear: number | null = null;
  startMonth: number | null = null;
  endYear: number | null = null;
  endMonth: number | null = null;

  @CVShowStore.Getter
  getCVWorkExperiences!: (id: number) => WorkExperience[];

  @CVShowStore.Action
  createWorkExperience!: (
    createWorkExperienceDto: CreateWorkExperienceDto
  ) => Promise<void>;

  @Watch("search")
  async searchChanged(keyword: string) {
    this.companies = await SearchCompanies({
      name: keyword || "",
      limit: 10
    });
  }

  async onSave() {
    if (
      this.form.validate() &&
      this.company &&
      this.startYear &&
      this.startMonth
    ) {
      const createWorkExperienceDto: CreateWorkExperienceDto = {
        cvId: this.id,
        companyId: this.company.id,
        jobTitle: this.jobTitle,
        description: this.description,
        startYear: this.startYear,
        startMonth: this.startMonth,
        endYear: R.isEmpty(this.endYear) ? null : this.endYear,
        endMonth: R.isEmpty(this.endMonth) ? null : this.endMonth
      };
      await this.createWorkExperience(createWorkExperienceDto);
      this.popDialogComponent();
    }
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
