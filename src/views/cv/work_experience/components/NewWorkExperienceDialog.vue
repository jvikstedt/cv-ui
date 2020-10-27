<template>
  <v-card>
    <v-card-title class="headline">New work experience</v-card-title>

    <v-form ref="form" v-model="valid" lazy-validation @submit.prevent="onSave">
      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn color="red darken-1" text @click="onCancel"> Cancel </v-btn>

        <v-btn color="green darken-1" text type="submit"> Save </v-btn>
      </v-card-actions>
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

        <MonthPicker
          v-model="startYearMonth"
          name="startYearMonth"
          :rules="startYearMonthRules"
          label="Start year and month"
        />
        <MonthPicker
          v-model="endYearMonth"
          name="endYearMonth"
          :rules="endYearMonthRules"
          label="End year and month"
        />

        <v-checkbox v-model="highlight" label="Highlight"></v-checkbox>
      </v-card-text>
    </v-form>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Watch, Mixins } from "vue-property-decorator";
import CompanyModule, { Company } from "@/store/modules/company";
import NewCompanyDialog from "@/views/company/components/NewCompanyDialog.vue";
import { DialogFormMixin } from "@/mixins";
import { MonthPicker } from "@/components/form";
import { YearMonth } from "@/components/form/MonthPicker.vue";
import { ServiceManager, WorkExperienceService } from "@/services";
import { InputValidationRules } from "vuetify";
import { IsRequired, DateAfter, DateBefore } from "@/helpers/validator";
import { DateTime } from "luxon";

@Component({
  components: {
    MonthPicker,
  },
})
export default class NewWorkExperienceDialog extends Mixins(DialogFormMixin) {
  @Prop({ required: true }) readonly cvId!: number;

  search = "";
  company: Company | null = null;

  jobTitle = "";
  description = "";
  startYearMonth = new YearMonth();
  endYearMonth = new YearMonth();
  highlight = false;

  startYearMonthRules: InputValidationRules = [
    IsRequired(),
    DateBefore(DateTime.local()),
  ];
  endYearMonthRules: InputValidationRules = [];

  get companies(): Company[] {
    return CompanyModule.list;
  }

  @Watch("startYearMonth")
  async startYearMonthChanged(ym: YearMonth): Promise<void> {
    this.endYearMonthRules = [
      DateAfter(DateTime.fromFormat(`${ym.year}-${ym.month}`, "yyyy-M")),
    ];
  }

  @Watch("search")
  async searchChanged(keyword: string): Promise<void> {
    await ServiceManager.company.searchCompanies({
      name: keyword || "",
    });
  }

  async onSave(): Promise<void> {
    if (
      this.form.validate() &&
      this.company &&
      this.startYearMonth.year &&
      this.startYearMonth.month
    ) {
      const createWorkExperienceDto: WorkExperienceService.CreateWorkExperienceDto = {
        cvId: this.cvId,
        companyId: this.company.id,
        jobTitle: this.jobTitle,
        description: this.description,
        startYear: this.startYearMonth.year,
        startMonth: this.startYearMonth.month,
        endYear: this.endYearMonth.year,
        endMonth: this.endYearMonth.month,
        highlight: this.highlight,
      };
      await ServiceManager.workExperience.createWorkExperience(
        createWorkExperienceDto
      );
      this.popDialogComponent();
    }
  }

  newCompany(): void {
    this.pushDialogComponent({
      component: NewCompanyDialog,
      props: { afterCreate: this.afterCompanyCreate },
    });
  }

  afterCompanyCreate(company: Company): void {
    this.company = company;
  }
}
</script>
