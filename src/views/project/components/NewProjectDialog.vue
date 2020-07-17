<template>
  <v-card>
    <v-card-title class="headline">New project</v-card-title>

    <v-form ref="form" v-model="valid" lazy-validation @submit.prevent="onSave">
      <v-card-text>
        <v-autocomplete
          v-model="company"
          :items="companies"
          :search-input.sync="search"
          item-text="name"
          item-value="id"
          label="Company"
          placeholder="Start typing to search"
          :rules="companyRules"
          return-object
        >
          <template v-slot:append-outer>
            <v-btn @click="newCompany">New</v-btn>
          </template>
        </v-autocomplete>

        <v-text-field
          v-model="name"
          :counter="255"
          :rules="nameRules"
          label="Name"
          required
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
import { Project, CreateProjectDto } from "@/model/project";
import { Company } from "@/model/work_experience";
import { VForm } from "@/types";
import NewCompanyDialog from "@/views/company/components/NewCompanyDialog.vue";
import { SearchCompanies } from "@/api/company";

const ProjectStore = namespace("ProjectStore");
const DialogStore = namespace("DialogStore");

@Component
export default class NewProjectDialog extends Vue {
  @Prop({ required: true }) readonly afterCreate!: (
    project: Project
  ) => Promise<void>;

  valid = false;
  name = "";
  nameRules = [(v: string) => !!v || "Name is required"];

  search = "";
  companies: Company[] = [];
  company: Company | null = null;
  companyRules = [(company: Company) => !!company || "Company is required"];

  @ProjectStore.Action
  createProject!: (createProjectDto: CreateProjectDto) => Promise<Project>;

  @DialogStore.Mutation
  popDialogComponent!: () => void;

  @DialogStore.Mutation
  pushDialogComponent!: (dialogComponent: DialogComponent) => void;

  get form(): VForm {
    return this.$refs.form as VForm;
  }

  @Watch("search")
  async searchChanged(input: string) {
    this.companies = await SearchCompanies({
      name: input || "",
      limit: 10
    });
  }

  async onSave(): Promise<void> {
    if (this.form.validate() && this.company) {
      const project = await this.createProject({
        name: this.name,
        companyId: this.company.id
      });

      await this.afterCreate(project);
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
