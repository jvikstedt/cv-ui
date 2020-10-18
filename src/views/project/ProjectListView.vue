<template>
  <v-container style="max-width: 1024px">
    <v-card>
      <v-card-title class="headline">
        <v-icon left>mdi-account-group</v-icon>
        Projects
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
      </v-card-title>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="newProject"> New </v-btn>
      </v-card-actions>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="projects"
          :options.sync="options"
          :loading="fetching"
          :server-items-length="itemsTotal"
          class="elevation-1"
          :footer-props="{
            ['items-per-page-options']: [5, 10, 15],
          }"
        >
          <template v-slot:[`item.actions`]="{ item }">
            <v-icon small class="mr-2" @click="editItem(item)">
              mdi-pencil
            </v-icon>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import * as R from "ramda";
import { Component, Vue, Watch } from "vue-property-decorator";
import NewProjectDialog from "./components/NewProjectDialog.vue";
import ProjectModule, { Project } from "@/store/modules/project";
import EditProjectDialog from "./components/EditProjectDialog.vue";
import DialogModule from "@/store/modules/dialog";
import { ServiceManager } from "@/services";
import { DataOptions } from "vuetify";

@Component
export default class ProjectListView extends Vue {
  fetching = ProjectModule.fetching;
  projects: Project[] = [];
  project: Project | null = null;
  search = "";

  options: DataOptions | Partial<DataOptions> = {
    sortBy: ["name"],
    sortDesc: [false],
  };

  itemsTotal = 0;
  headers = [
    { text: "Name", value: "name" },
    { text: "Company", value: "company.name" },
    { text: "Actions", value: "actions", sortable: false },
  ];

  @Watch("search")
  async searchChanged(): Promise<void> {
    this.options = {
      ...this.options,
      page: 1,
    };
  }

  @Watch("options", { deep: true })
  async optionsChanged(): Promise<void> {
    const sortBy = this.options.sortBy || [];
    const sortDesc = this.options.sortDesc || [];
    const page = this.options.page || 1;
    const itemsPerPage = this.options.itemsPerPage || 10;

    const orderColumnName = R.equals(sortBy[0], "company.name")
      ? "company.name"
      : "project.name";
    const orderSort = sortDesc[0] ? "DESC" : "ASC";

    const result = await ServiceManager.project.searchProjects({
      skip: (page - 1) * itemsPerPage,
      take: itemsPerPage,
      orderColumnName,
      orderSort,
      name: this.search,
    });

    this.projects = result.items;
    this.itemsTotal = result.total;
  }

  async afterCreate(project: Project): Promise<void> {
    this.projects = [project, ...this.projects];
  }

  async afterSave(project: Project): Promise<void> {
    this.projects = R.map((s) => {
      if (R.equals(s.id, project.id)) {
        return project;
      }
      return s;
    }, this.projects);
  }

  newProject(): void {
    DialogModule.pushDialogComponent({
      component: NewProjectDialog,
      props: { afterCreate: this.afterCreate },
    });
  }

  editItem(project: Project): void {
    DialogModule.pushDialogComponent({
      component: EditProjectDialog,
      props: {
        project: project,
        afterSave: this.afterSave,
      },
    });
  }
}
</script>
