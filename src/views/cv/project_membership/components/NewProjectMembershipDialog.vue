<template>
  <v-card>
    <v-card-title class="headline">New project</v-card-title>

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
          name="description"
          :counter="255"
          label="Description"
          required
        ></v-text-field>

        <v-text-field
          v-model.number="startYear"
          name="startYear"
          label="Start year"
          :rules="isRequiredRule"
          type="number"
          required
        ></v-text-field>

        <v-text-field
          v-model.number="startMonth"
          name="startMonth"
          label="Start month"
          :rules="isRequiredRule"
          type="number"
          required
        ></v-text-field>

        <v-text-field
          v-model.number="endYear"
          name="endYear"
          label="End year"
          type="number"
        ></v-text-field>

        <v-text-field
          v-model.number="endMonth"
          name="endMonth"
          label="End month"
          type="number"
        ></v-text-field>

        <v-checkbox
          v-model="highlight"
          name="highlight"
          label="Highlight"
        ></v-checkbox>

        <MembershipSkillsField v-model="membershipSkills" />
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn color="red darken-1" text @click="onCancel"> Cancel </v-btn>

        <v-btn color="green darken-1" text type="submit"> Save </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script lang="ts">
import * as R from "ramda";
import { Component, Prop, Watch, Mixins } from "vue-property-decorator";
import ProjectModule, { Project } from "@/store/modules/project";
import NewProjectDialog from "@/views/project/components/NewProjectDialog.vue";
import { DialogFormMixin } from "@/mixins";
import ProjectMembershipModule, {
  CreateProjectMembershipDto,
} from "@/store/modules/project_membership";
import { MembershipSkillDto } from "@/store/modules/membership_skill";
import MembershipSkillsField from "./MembershipSkillsField.vue";

@Component({
  components: {
    MembershipSkillsField,
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
  startYear: number | null = null;
  startMonth: number | null = null;
  endYear: number | null = null;
  endMonth: number | null = null;
  highlight = false;
  membershipSkills: MembershipSkillDto[] = [];

  @Watch("search")
  async searchChanged(keyword: string): Promise<void> {
    this.projects = await ProjectModule.searchProjects({
      name: keyword || "",
      limit: 10,
    });
  }

  async onSave(): Promise<void> {
    if (
      this.form.validate() &&
      this.project &&
      this.startYear &&
      this.startMonth
    ) {
      const createProjectMembershipDto: CreateProjectMembershipDto = {
        cvId: this.cvId,
        projectId: this.project.id,
        description: this.description,
        startYear: this.startYear,
        startMonth: this.startMonth,
        endYear: R.isEmpty(this.endYear) ? null : this.endYear,
        endMonth: R.isEmpty(this.endMonth) ? null : this.endMonth,
        highlight: this.highlight,
        membershipSkills: this.membershipSkills,
      };
      await ProjectMembershipModule.createProjectMembership(
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
