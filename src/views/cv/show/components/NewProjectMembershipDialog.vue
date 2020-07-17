<template>
  <v-card>
    <v-card-title class="headline">New work experience</v-card-title>

    <v-form ref="form" v-model="valid" lazy-validation @submit.prevent="onSave">
      <v-card-text>
        <v-autocomplete
          name="project"
          v-model="project"
          :items="projects"
          :search-input.sync="search"
          :rules="projectRules"
          item-text="name"
          item-value="id"
          label="Project"
          placeholder="Start typing to search"
          return-object
        >
          <template v-slot:append-outer>
            <v-btn @click="newProject">New</v-btn>
          </template>
        </v-autocomplete>
      </v-card-text>

      <v-card-text>
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
import { SearchProjects } from "@/api/project";
import {
  Project,
  ProjectMembership,
  CreateProjectMembershipDto
} from "@/model/project";
import NewProjectDialog from "@/views/project/components/NewProjectDialog.vue";

const CVShowStore = namespace("CVShowStore");
const DialogStore = namespace("DialogStore");

@Component
export default class NewProjectMembershipDialog extends Vue {
  @Prop({ required: true }) readonly id!: number;

  valid = false;
  search = "";
  projects: Project[] = [];
  project: Project | null = null;
  projectRules = [(project: Project) => !!project || "Project is required"];

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
  getCVProjectMemberships!: (id: number) => ProjectMembership[];

  @CVShowStore.Action
  createProjectMembership!: (
    createProjectMembershipDto: CreateProjectMembershipDto
  ) => Promise<void>;

  @DialogStore.Mutation
  popDialogComponent!: () => void;

  @DialogStore.Mutation
  pushDialogComponent!: (dialogComponent: DialogComponent) => void;

  @Watch("search")
  async searchChanged(keyword: string) {
    this.projects = await SearchProjects({
      name: keyword || "",
      limit: 10
    });
  }

  get form(): VForm {
    return this.$refs.form as VForm;
  }

  async onSave() {
    if (this.form.validate() && this.project) {
      const createProjectMembershipDto: CreateProjectMembershipDto = {
        cvId: this.id,
        projectId: this.project.id,
        description: this.description,
        startYear: this.startYear,
        startMonth: this.startMonth,
        endYear: this.endYear,
        endMonth: this.endMonth
      };
      await this.createProjectMembership(createProjectMembershipDto);
      this.popDialogComponent();
    }
  }

  async onCancel() {
    this.popDialogComponent();
  }

  async newProject() {
    this.pushDialogComponent({
      component: NewProjectDialog,
      props: { afterCreate: this.afterProjectCreate }
    });
  }

  async afterProjectCreate(project: Project) {
    this.projects = [...this.projects, project];
    this.project = project;
  }
}
</script>
