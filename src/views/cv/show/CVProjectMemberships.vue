<template>
  <v-row>
    <v-col cols="12">
      <h2>Projects</h2>
      <v-row>
        <v-col
          v-for="projectMembership in projectMemberships"
          :key="projectMembership.id"
          cols="12"
          md="6"
        >
          <v-card class="mx-auto" outlined>
            <v-list-item three-line>
              <v-list-item-content>
                <v-list-item-title class="headline mb-2">
                  {{ projectMembership.project.name }}
                </v-list-item-title>
                <div class="mb-2">
                  {{ projectMembership.startYear }}
                </div>
                <v-list-item-subtitle>{{
                  projectMembership.description
                }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <v-card-actions>
              <v-btn
                v-if="canEdit"
                color="primary"
                @click="onProjectMembershipClick(projectMembership)"
                >Edit</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-col>
    <v-col cols="12" v-if="canEdit">
      <v-btn color="primary" dark @click="newProjectMembership"
        >New work experience</v-btn
      >
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { namespace } from "vuex-class";
import { ProjectMembership } from "@/model/project";
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
