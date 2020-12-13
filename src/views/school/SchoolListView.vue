<template>
  <v-container style="max-width: 1024px">
    <v-card>
      <v-card-title class="headline">
        <v-icon left>mdi-school</v-icon>
        Schools
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
        <v-btn color="primary" @click="newSchoolDialog"> New </v-btn>
      </v-card-actions>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="schools"
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
import NewSchoolDialog from "./components/NewSchoolDialog.vue";
import SchoolModule, { School } from "@/store/modules/school";
import EditSchoolDialog from "./components/EditSchoolDialog.vue";
import DialogModule from "@/store/modules/dialog";
import { ServiceManager } from "@/services";
import { DataOptions } from "vuetify";

@Component
export default class SchoolListView extends Vue {
  fetching = SchoolModule.fetching;
  schools: School[] = [];
  school: School | null = null;
  search = "";

  options: DataOptions | Partial<DataOptions> = {
    sortBy: ["name"],
    sortDesc: [false],
  };

  itemsTotal = 0;
  headers = [
    { text: "Name", value: "name" },
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
    const sortDesc = this.options.sortDesc || [];
    const page = this.options.page || 1;
    const itemsPerPage = this.options.itemsPerPage || 10;

    const orderColumnName = "school.name";
    const orderSort = sortDesc[0] ? "DESC" : "ASC";

    const result = await ServiceManager.school.searchSchools({
      skip: (page - 1) * itemsPerPage,
      take: itemsPerPage,
      orderColumnName,
      orderSort,
      name: this.search,
    });

    this.schools = result.items;
    this.itemsTotal = result.total;
  }

  async afterCreate(school: School): Promise<void> {
    this.schools = [school, ...this.schools];
  }

  async afterSave(school: School): Promise<void> {
    this.schools = R.map((s) => {
      if (R.equals(s.id, school.id)) {
        return school;
      }
      return s;
    }, this.schools);
  }

  async afterDelete(school: School): Promise<void> {
    this.schools = R.reject((s) => R.equals(s.id, school.id), this.schools);
  }

  newSchoolDialog(): void {
    DialogModule.pushDialogComponent({
      component: NewSchoolDialog,
      props: { afterCreate: this.afterCreate },
    });
  }

  editItem(school: School): void {
    DialogModule.pushDialogComponent({
      component: EditSchoolDialog,
      props: {
        school: school,
        afterSave: this.afterSave,
        afterDelete: this.afterDelete,
      },
    });
  }
}
</script>
