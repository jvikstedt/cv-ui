<template>
  <v-card class="mt-5">
    <v-card-title class="headline">Projects</v-card-title>
    <v-card-text>
      <div
        v-for="projectMembership in projectMemberships"
        :key="projectMembership.id"
      >
        <v-list-item three-line>
          <v-list-item-content>
            <v-list-item-title class="headline mb-2">
              {{ projectMembership.project.company.name }} /
              {{ projectMembership.project.name }}
              <v-btn
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
      <v-btn v-if="canEdit" color="primary" dark @click="newProjectMembership">
        New project
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { namespace } from "vuex-class";
import { ProjectMembership } from "@/model/project_membership";
import { DialogComponent } from "@/dialog";
import NewProjectMembershipDialog from "./components/NewProjectMembershipDialog.vue";
import EditProjectMembershipDialog from "./components/EditProjectMembershipDialog.vue";

const CVShowStore = namespace("CVShowStore");
const DialogStore = namespace("DialogStore");

@Component
export default class CVProjectMemberships extends Vue {
  @Prop({ required: true }) readonly id!: number;
  @Prop({ required: true }) readonly canEdit!: boolean;

  @CVShowStore.Getter
  getCVProjectMemberships!: (id: number) => ProjectMembership[];

  get projectMemberships(): ProjectMembership[] {
    return this.getCVProjectMemberships(this.id);
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
