<template>
  <v-container style="max-width: 1024px">
    <v-card>
      <v-card-title class="headline">
        <v-icon left>mdi-code-braces</v-icon>
        Skills
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
        <v-btn color="primary" @click="newSkillSubject"> New </v-btn>
      </v-card-actions>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="skillSubjects"
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
import NewSkillSubjectDialog from "./components/NewSkillSubjectDialog.vue";
import SkillSubjectModule, {
  SkillSubject,
} from "@/store/modules/skill_subject";
import EditSkillSubjectDialog from "./components/EditSkillSubjectDialog.vue";
import DialogModule from "@/store/modules/dialog";
import { ServiceManager } from "@/services";
import { DataOptions } from "vuetify";

@Component
export default class SkillSubjectListView extends Vue {
  fetching = SkillSubjectModule.fetching;
  skillSubjects: SkillSubject[] = [];
  skillSubject: SkillSubject | null = null;
  search = "";

  options: DataOptions | Partial<DataOptions> = {
    sortBy: ["name"],
    sortDesc: [false],
  };

  itemsTotal = 0;
  headers = [
    { text: "Name", value: "name" },
    { text: "Skill group", value: "skillGroup.name" },
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

    const orderColumnName = R.equals(sortBy[0], "skillGroup.name")
      ? "skillGroup.name"
      : "skillSubject.name";
    const orderSort = sortDesc[0] ? "DESC" : "ASC";

    const result = await ServiceManager.skillSubject.searchSkillSubjects({
      skip: (page - 1) * itemsPerPage,
      take: itemsPerPage,
      orderColumnName,
      orderSort,
      name: this.search,
    });

    this.skillSubjects = result.items;
    this.itemsTotal = result.total;
  }

  async afterCreate(skillSubject: SkillSubject): Promise<void> {
    this.skillSubjects = [skillSubject, ...this.skillSubjects];
  }

  async afterSave(skillSubject: SkillSubject): Promise<void> {
    this.skillSubjects = R.map((s) => {
      if (R.equals(s.id, skillSubject.id)) {
        return skillSubject;
      }
      return s;
    }, this.skillSubjects);
  }

  newSkillSubject(): void {
    DialogModule.pushDialogComponent({
      component: NewSkillSubjectDialog,
      props: { afterCreate: this.afterCreate },
    });
  }

  editItem(skillSubject: SkillSubject): void {
    DialogModule.pushDialogComponent({
      component: EditSkillSubjectDialog,
      props: {
        skillSubject: skillSubject,
        afterSave: this.afterSave,
      },
    });
  }
}
</script>
