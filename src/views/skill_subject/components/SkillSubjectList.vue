<template>
  <v-card>
    <v-card-title class="headline">
      <v-icon left>mdi-code-braces</v-icon>
      Skill Subjects
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
      <v-btn color="warning" @click="mergeSkillSubject"> Merge request</v-btn>
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
</template>

<script lang="ts">
import * as R from "ramda";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import NewSkillSubjectDialog from "./NewSkillSubjectDialog.vue";
import MergeSkillSubjectDialog from "./MergeSkillSubjectsDialog.vue";
import SkillSubjectModule, {
  SkillSubject,
} from "@/store/modules/skill_subject";
import EditSkillSubjectDialog from "./EditSkillSubjectDialog.vue";
import DialogModule from "@/store/modules/dialog";
import { ServiceManager } from "@/services";
import { DataOptions } from "vuetify";

@Component
export default class SkillSubjectList extends Vue {
  @Prop({ required: false }) readonly skillGroupId?: number;

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
      skillGroupId: this.skillGroupId ? this.skillGroupId : undefined,
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

  async afterDelete(skillSubject: SkillSubject): Promise<void> {
    this.skillSubjects = R.reject(
      (s) => R.equals(s.id, skillSubject.id),
      this.skillSubjects
    );
  }

  newSkillSubject(): void {
    DialogModule.pushDialogComponent({
      component: NewSkillSubjectDialog,
      props: { afterCreate: this.afterCreate },
    });
  }

  mergeSkillSubject(): void {
    DialogModule.pushDialogComponent({
      component: MergeSkillSubjectDialog,
      props: {
        afterCreate: () => {
          this.$router.push("/jobs");
        },
      },
    });
  }

  editItem(skillSubject: SkillSubject): void {
    DialogModule.pushDialogComponent({
      component: EditSkillSubjectDialog,
      props: {
        skillSubject: skillSubject,
        afterSave: this.afterSave,
        afterDelete: this.afterDelete,
      },
    });
  }
}
</script>
