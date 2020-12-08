<template>
  <v-card>
    <v-card-title class="headline">{{
      workExperience.company.name
    }}</v-card-title>

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
          @click="onWorkExperienceDelete"
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
          name="jobTitle"
          v-model="jobTitle"
          :counter="255"
          :rules="isRequiredRule"
          label="Job title"
          required
        ></v-text-field>

        <v-text-field
          name="description"
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
          :readonly="!canEdit"
        />
        <MonthPicker
          v-model="endYearMonth"
          name="endYearMonth"
          :rules="endYearMonthRules"
          label="End year and month"
          :readonly="!canEdit"
        />

        <v-checkbox v-model="highlight" label="Highlight"></v-checkbox>
      </v-card-text>
    </v-form>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Mixins, Watch } from "vue-property-decorator";
import { DialogFormMixin } from "@/mixins";
import { WorkExperience } from "@/store/modules/work_experience";
import { MonthPicker } from "@/components/form";
import { YearMonth } from "@/components/form/MonthPicker.vue";
import { ServiceManager, WorkExperienceService } from "@/services";
import { InputValidationRules } from "vuetify";
import { DateAfter, DateBefore, IsRequired } from "@/helpers/validator";
import { DateTime } from "luxon";
import CompanyModule, { Company } from "@/store/modules/company";
import NewCompanyDialog from "@/views/company/components/NewCompanyDialog.vue";

@Component({
  components: {
    MonthPicker,
  },
})
export default class EditWorkExperienceDialog extends Mixins(DialogFormMixin) {
  @Prop({ required: true }) readonly workExperience!: WorkExperience;
  @Prop({ required: false }) readonly canEdit!: boolean;

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

  created(): void {
    this.company = this.workExperience.company;
    this.jobTitle = this.workExperience.jobTitle;
    this.description = this.workExperience.description;
    this.highlight = this.workExperience.highlight;
    this.startYearMonth = {
      year: this.workExperience.startYear,
      month: this.workExperience.startMonth,
    };
    this.endYearMonth = {
      year: this.workExperience.endYear || null,
      month: this.workExperience.endMonth || null,
    };
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

  get companies(): Company[] {
    return CompanyModule.list;
  }

  async onWorkExperienceDelete(): Promise<void> {
    if (confirm("Are you sure you want to delete?")) {
      const deleteWorkExperienceDto = {
        cvId: this.workExperience.cvId,
        workExperienceId: this.workExperience.id,
      };

      await ServiceManager.workExperience.deleteWorkExperience(
        deleteWorkExperienceDto
      );

      this.popDialogComponent();
    }
  }

  async onSave(): Promise<void> {
    if (
      this.form.validate() &&
      this.startYearMonth.year &&
      this.startYearMonth.month
    ) {
      const patchWorkExperienceDto: WorkExperienceService.PatchWorkExperienceDto = {
        cvId: this.workExperience.cvId,
        workExperienceId: this.workExperience.id,
        data: {
          companyId: this.company?.id,
          jobTitle: this.jobTitle,
          description: this.description,
          startYear: this.startYearMonth.year,
          startMonth: this.startYearMonth.month,
          endYear: this.endYearMonth.year,
          endMonth: this.endYearMonth.month,
          highlight: this.highlight,
        },
      };
      await ServiceManager.workExperience.patchWorkExperience(
        patchWorkExperienceDto
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
