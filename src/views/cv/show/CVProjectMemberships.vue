<template>
  <v-card class="mt-5" id="cv-projects">
    <v-card-title class="headline">
      <v-icon left>mdi-account-group</v-icon>
      Projects
    </v-card-title>
    <v-card-text>
      <div
        v-for="projectMembership in projectMemberships"
        :key="projectMembership.id"
      >
        <v-list-item three-line style="background-color: white">
          <v-list-item-content>
            <v-list-item-title class="headline mb-2">
              {{ projectMembership.project.company.name }} /
              {{ projectMembership.project.name }}
              <v-btn
                class="edit-project-membership-btn"
                v-if="canEdit"
                icon
                small
                @click="onProjectMembershipClick(projectMembership)"
              >
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </v-list-item-title>
            <v-list-item-subtitle>
              {{ projectMembership.startMonth }}.{{
                projectMembership.startYear
              }}
              - {{ projectMembership.endMonth }}.{{ projectMembership.endYear }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>
      </div>
    </v-card-text>
    <v-card-actions>
      <v-btn v-if="canEdit" color="primary" @click="newProjectMembership">
        New project
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import NewProjectMembershipDialog from "./components/NewProjectMembershipDialog.vue";
import EditProjectMembershipDialog from "./components/EditProjectMembershipDialog.vue";
import DialogModule from "@/store/modules/dialog";
import ProjectMembershipModule, {
  ProjectMembership,
} from "@/store/modules/project_membership";

@Component
export default class CVProjectMemberships extends Vue {
  @Prop({ required: true }) readonly cvId!: number;
  @Prop({ required: true }) readonly canEdit!: boolean;

  get projectMemberships(): ProjectMembership[] {
    return ProjectMembershipModule.listByCV(this.cvId);
  }

  async created(): Promise<void> {
    await ProjectMembershipModule.fetchCVProjectMemberships(this.cvId);
  }

  onProjectMembershipClick(projectMembership: ProjectMembership): void {
    DialogModule.pushDialogComponent({
      component: EditProjectMembershipDialog,
      props: { projectMembership },
    });
  }

  newProjectMembership(): void {
    DialogModule.pushDialogComponent({
      component: NewProjectMembershipDialog,
      props: { cvId: this.cvId },
    });
  }
}
</script>
