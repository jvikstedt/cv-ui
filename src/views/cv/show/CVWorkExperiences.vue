<template>
  <v-card class="mt-5" color="grey lighten-1">
    <v-card-title class="headline">
      <v-icon left>mdi-domain</v-icon>
      Work experience
    </v-card-title>
    <v-card-text>
      <div v-for="workExperience in workExperiences" :key="workExperience.id">
        <v-list-item three-line style="background-color: white">
          <v-list-item-content>
            <v-list-item-title class="headline mb-2">
              {{ workExperience.company.name }}
              <v-btn
                v-if="canEdit"
                icon
                small
                @click="onWorkExperienceClick(workExperience)"
              >
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </v-list-item-title>
            <div class="mb-2">
              {{ workExperience.jobTitle }}
            </div>
            <v-list-item-subtitle>
              {{ workExperience.startMonth }}.{{ workExperience.startYear }} -
              {{ workExperience.endMonth }}.{{ workExperience.endYear }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>
      </div>
    </v-card-text>
    <v-card-actions>
      <v-btn v-if="canEdit" color="primary" @click="newWorkExperience">
        New work experience
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { namespace } from "vuex-class";
import { WorkExperience } from "@/model/work_experience";
import { DialogComponent } from "@/dialog";
import NewWorkExperienceDialog from "./components/NewWorkExperienceDialog.vue";
import EditWorkExperienceDialog from "./components/EditWorkExperienceDialog.vue";

const CVShowStore = namespace("CVShowStore");
const DialogStore = namespace("DialogStore");

@Component
export default class CVWorkExperiences extends Vue {
  @Prop({ required: true }) readonly id!: number;
  @Prop({ required: true }) readonly canEdit!: boolean;

  @CVShowStore.Getter
  getCVWorkExperiences!: (id: number) => WorkExperience[];

  get workExperiences(): WorkExperience[] {
    return this.getCVWorkExperiences(this.id);
  }

  @DialogStore.Mutation
  pushDialogComponent!: (dialogComponent: DialogComponent) => void;

  async onWorkExperienceClick(workExperience: WorkExperience) {
    this.pushDialogComponent({
      component: EditWorkExperienceDialog,
      props: { workExperienceId: workExperience.id }
    });
  }

  async newWorkExperience() {
    this.pushDialogComponent({
      component: NewWorkExperienceDialog,
      props: { id: this.id }
    });
  }
}
</script>
