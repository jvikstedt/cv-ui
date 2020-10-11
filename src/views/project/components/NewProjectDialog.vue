<template>
  <v-card>
    <v-card-title class="headline">New project</v-card-title>

    <v-form ref="form" v-model="valid" lazy-validation @submit.prevent="onSave">
      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn color="red darken-1" text @click="onCancel"> Cancel </v-btn>

        <v-btn color="green darken-1" text type="submit"> Save </v-btn>
      </v-card-actions>
      <v-card-text>
        <v-autocomplete
          v-model="company"
          :items="companies"
          :search-input.sync="search"
          item-text="name"
          item-value="id"
          label="Company"
          placeholder="Start typing to search"
          :rules="isRequiredRule"
          return-object
        >
          <template v-slot:append-outer>
            <v-btn @click="newCompany">New</v-btn>
          </template>
        </v-autocomplete>

        <v-text-field
          v-model="name"
          :counter="255"
          :rules="isRequiredRule"
          label="Name"
          required
        ></v-text-field>
      </v-card-text>
    </v-form>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Watch, Mixins } from "vue-property-decorator";
import CompanyModule, { Company } from "@/store/modules/company";
import NewCompanyDialog from "@/views/company/components/NewCompanyDialog.vue";
import { DialogFormMixin } from "@/mixins";
import ProjectModule, { Project } from "@/store/modules/project";

@Component
export default class NewProjectDialog extends Mixins(DialogFormMixin) {
  @Prop({ required: true }) readonly afterCreate!: (
    project: Project
  ) => Promise<void>;

  name = "";

  search = "";
  companies: Company[] = [];
  company: Company | null = null;

  @Watch("search")
  async searchChanged(input: string): Promise<void> {
    this.companies = await CompanyModule.searchCompanies({
      name: input || "",
      limit: 10,
    });
  }

  async onSave(): Promise<void> {
    if (this.form.validate() && this.company) {
      const project = await ProjectModule.createProject({
        name: this.name,
        companyId: this.company.id,
      });

      await this.afterCreate(project);
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
    this.companies = [...this.companies, company];
    this.company = company;
  }
}
</script>
