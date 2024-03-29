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
            <v-list-item-title class="headline mb-2 text-wrap">
              <v-icon v-if="projectMembership.highlight">mdi-star</v-icon>
              {{ projectMembership.project.company.name }} /
              {{ projectMembership.project.name }}
              <v-btn
                class="edit-project-membership-btn"
                icon
                small
                @click="onProjectMembershipClick(projectMembership)"
              >
                <v-icon v-if="canEdit">mdi-pencil</v-icon>
                <v-icon v-else>mdi-information-outline</v-icon>
              </v-btn>
            </v-list-item-title>
            <div class="mb-2">
              {{ projectMembership.role }}
            </div>
            <v-list-item-subtitle>
              <div>
                {{ projectMembership.startMonth }}.{{
                  projectMembership.startYear
                }}
                -
                <span
                  v-if="projectMembership.endMonth || projectMembership.endYear"
                >
                  {{ projectMembership.endMonth }}.{{
                    projectMembership.endYear
                  }}
                </span>
              </div>
            </v-list-item-subtitle>
            <v-list-item-subtitle>
              {{ projectMembership.description }}
            </v-list-item-subtitle>
            <div>
              <v-chip
                :key="membershipSkill.id"
                class="mr-2 mt-2"
                :style="getChipStyle(membershipSkill.skill)"
                text-color="blue-grey darken-4"
                v-for="membershipSkill in projectMembership.membershipSkills"
                small
              >
                {{ membershipSkill.skill.skillSubject.name }} ({{
                  membershipSkill.skill.skillSubject.skillGroup.name
                }})
              </v-chip>
            </div>
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
import { Skill } from "@/store/modules/skill";
import ProjectMembershipModule, {
  ProjectMembership,
} from "@/store/modules/project_membership";
import { SortArr } from "@/helpers";

@Component
export default class CVProjectMemberships extends Vue {
  @Prop({ required: true }) readonly cvId!: number;
  @Prop({ required: true }) readonly canEdit!: boolean;

  get projectMemberships(): ProjectMembership[] {
    return SortArr(ProjectMembershipModule.listByCV(this.cvId));
  }

  getChipStyle(skill: Skill): string {
    return `background-color: rgb(76,175,80, ${skill.interestLevel * (1 / 3)})`;
  }

  onProjectMembershipClick(projectMembership: ProjectMembership): void {
    DialogModule.pushDialogComponent({
      component: EditProjectMembershipDialog,
      props: {
        projectMembership,
        canEdit: this.canEdit,
      },
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
