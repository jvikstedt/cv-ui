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
          :rules="isRequiredRule"
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
          :rules="isRequiredRule"
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
          :rules="isRequiredRule"
          type="number"
        ></v-text-field>

        <v-text-field
          v-model.number="endMonth"
          label="End month"
          :rules="isRequiredRule"
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
import { Component, Prop, Watch, Mixins } from "vue-property-decorator";
import { namespace } from "vuex-class";
import { SearchProjects } from "@/api/project";
import {
  Project,
  ProjectMembership,
  CreateProjectMembershipDto
} from "@/model/project";
import NewProjectDialog from "@/views/project/components/NewProjectDialog.vue";
import { DialogFormMixin } from "@/mixins";

const CVShowStore = namespace("CVShowStore");

@Component
export default class NewProjectMembershipDialog extends Mixins(
  DialogFormMixin
) {
  @Prop({ required: true }) readonly id!: number;

  search = "";
  projects: Project[] = [];
  project: Project | null = null;

  description = "";
  startYear = 2010;
  startMonth = 1;
  endYear = 2014;
  endMonth = 12;

  @CVShowStore.Getter
  getCVProjectMemberships!: (id: number) => ProjectMembership[];

  @CVShowStore.Action
  createProjectMembership!: (
    createProjectMembershipDto: CreateProjectMembershipDto
  ) => Promise<void>;

  @Watch("search")
  async searchChanged(keyword: string) {
    this.projects = await SearchProjects({
      name: keyword || "",
      limit: 10
    });
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
