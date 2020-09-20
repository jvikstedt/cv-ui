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

            <div>
              <v-chip
                :key="skill.id"
                class="ma-2"
                :style="getChipStyle(skill)"
                text-color="blue-grey darken-4"
                v-for="skill in getSkills(projectMembership)"
                small
              >
                {{ skill.skillSubject.name }}
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
import * as R from "ramda";
import { Component, Vue, Prop } from "vue-property-decorator";
import { namespace } from "vuex-class";
import { ProjectMembership } from "@/model/project_membership";
import { DialogComponent } from "@/dialog";
import NewProjectMembershipDialog from "./components/NewProjectMembershipDialog.vue";
import EditProjectMembershipDialog from "./components/EditProjectMembershipDialog.vue";
import { Skill } from "@/model/skill";

const CVShowStore = namespace("CVShowStore");
const DialogStore = namespace("DialogStore");

@Component
export default class CVProjectMemberships extends Vue {
  @Prop({ required: true }) readonly id!: number;
  @Prop({ required: true }) readonly canEdit!: boolean;

  @CVShowStore.Getter
  getCVProjectMemberships!: (id: number) => ProjectMembership[];

  @CVShowStore.Getter
  getSkill!: (skillId: number) => Skill;

  get projectMemberships(): ProjectMembership[] {
    return this.getCVProjectMemberships(this.id);
  }

  getSkills(projectMembership: ProjectMembership): Skill[] {
    return R.reject(
      R.isNil,
      R.map(s => this.getSkill(s.id), projectMembership.skills)
    );
  }

  getChipStyle(skill: Skill): string {
    return `background-color: rgb(76,175,80, ${skill.interestLevel * (1 / 3)})`;
  }

  @DialogStore.Mutation
  pushDialogComponent!: (dialogComponent: DialogComponent) => void;

  async onProjectMembershipClick(projectMembership: ProjectMembership) {
    this.pushDialogComponent({
      component: EditProjectMembershipDialog,
      props: { projectMembershipId: projectMembership.id }
    });
  }

  async newProjectMembership() {
    this.pushDialogComponent({
      component: NewProjectMembershipDialog,
      props: { id: this.id }
    });
  }
}
</script>
