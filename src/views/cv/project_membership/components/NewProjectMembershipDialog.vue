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
          name="description"
          :counter="255"
          label="Description"
          required
        ></v-text-field>

        <MonthPicker
          v-model="startYearMonth"
          name="startYearMonth"
          :rules="isRequiredRule"
          label="Start year and month"
        />
        <MonthPicker
          v-model="endYearMonth"
          name="endYearMonth"
          label="End year and month"
        />

        <v-checkbox
          v-model="highlight"
          name="highlight"
          label="Highlight"
        ></v-checkbox>

        <MembershipSkillsField v-model="membershipSkills" />
      </v-card-text>
    </v-form>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Watch, Mixins } from "vue-property-decorator";
import { Project } from "@/store/modules/project";
import NewProjectDialog from "@/views/project/components/NewProjectDialog.vue";
import { DialogFormMixin } from "@/mixins";
import { MembershipSkillDto } from "@/store/modules/membership_skill";
import MembershipSkillsField from "./MembershipSkillsField.vue";
import { MonthPicker } from "@/components/form";
import { YearMonth } from "@/components/form/MonthPicker.vue";
import { ProjectMembershipService, ServiceManager } from "@/services";

@Component({
  components: {
    MembershipSkillsField,
    MonthPicker,
  },
})
export default class NewProjectMembershipDialog extends Mixins(
  DialogFormMixin
) {
  @Prop({ required: true }) readonly cvId!: number;

  search = "";
  projects: Project[] = [];
  project: Project | null = null;

  description = "";
  startYearMonth = new YearMonth();
  endYearMonth = new YearMonth();
  highlight = false;
  membershipSkills: MembershipSkillDto[] = [];

  @Watch("search")
  async searchChanged(keyword: string): Promise<void> {
    this.projects = await ServiceManager.project.searchProjects({
      name: keyword || "",
      limit: 10,
    });
  }

  async onSave(): Promise<void> {
    if (
      this.form.validate() &&
      this.project &&
      this.startYearMonth.year &&
      this.startYearMonth.month
    ) {
      const createProjectMembershipDto: ProjectMembershipService.CreateProjectMembershipDto = {
        cvId: this.cvId,
        projectId: this.project.id,
        description: this.description,
        startYear: this.startYearMonth.year,
        startMonth: this.startYearMonth.month,
        endYear: this.endYearMonth.year,
        endMonth: this.endYearMonth.month,
        highlight: this.highlight,
        membershipSkills: this.membershipSkills,
      };
      await ServiceManager.projectMembership.createProjectMembership(
        createProjectMembershipDto
      );
      this.popDialogComponent();
    }
  }

  newProject(): void {
    this.pushDialogComponent({
      component: NewProjectDialog,
      props: { afterCreate: this.afterProjectCreate },
    });
  }

  afterProjectCreate(project: Project): void {
    this.projects = [...this.projects, project];
    this.project = project;
  }
}
</script>
