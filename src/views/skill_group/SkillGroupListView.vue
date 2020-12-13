<template>
  <v-container style="max-width: 1024px">
    <v-card>
      <v-card-title class="headline">
        <v-icon left>mdi-group</v-icon>
        Skill Groups
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
        <v-btn color="primary" @click="newSkillGroupDialog"> New </v-btn>
      </v-card-actions>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="skillGroups"
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
import NewSkillGroupDialog from "./components/NewSkillGroupDialog.vue";
import SkillGroupModule, { SkillGroup } from "@/store/modules/skill_group";
import EditSkillGroupDialog from "./components/EditSkillGroupDialog.vue";
import DialogModule from "@/store/modules/dialog";
import { ServiceManager } from "@/services";
import { DataOptions } from "vuetify";

@Component
export default class SkillGroupListView extends Vue {
  fetching = SkillGroupModule.fetching;
  skillGroups: SkillGroup[] = [];
  skillGroup: SkillGroup | null = null;
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

    const orderColumnName = "skillGroup.name";
    const orderSort = sortDesc[0] ? "DESC" : "ASC";

    const result = await ServiceManager.skillGroup.searchSkillGroups({
      skip: (page - 1) * itemsPerPage,
      take: itemsPerPage,
      orderColumnName,
      orderSort,
      name: this.search,
    });

    this.skillGroups = result.items;
    this.itemsTotal = result.total;
  }

  async afterCreate(skillGroup: SkillGroup): Promise<void> {
    this.skillGroups = [skillGroup, ...this.skillGroups];
  }

  async afterSave(skillGroup: SkillGroup): Promise<void> {
    this.skillGroups = R.map((s) => {
      if (R.equals(s.id, skillGroup.id)) {
        return skillGroup;
      }
      return s;
    }, this.skillGroups);
  }

  async afterDelete(skillGroup: SkillGroup): Promise<void> {
    this.skillGroups = R.reject(
      (s) => R.equals(s.id, skillGroup.id),
      this.skillGroups
    );
  }

  newSkillGroupDialog(): void {
    DialogModule.pushDialogComponent({
      component: NewSkillGroupDialog,
      props: { afterCreate: this.afterCreate },
    });
  }

  editItem(skillGroup: SkillGroup): void {
    DialogModule.pushDialogComponent({
      component: EditSkillGroupDialog,
      props: {
        skillGroup: skillGroup,
        afterSave: this.afterSave,
        afterDelete: this.afterDelete,
      },
    });
  }
}
</script>
