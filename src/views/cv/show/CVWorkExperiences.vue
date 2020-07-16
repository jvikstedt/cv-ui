<template>
  <v-row>
    <v-col cols="12">
      <h2>Work experiences</h2>
      <v-row>
        <v-col
          v-for="workExperience in workExperiences"
          :key="workExperience.id"
          cols="12"
          md="6"
        >
          <v-card class="mx-auto" outlined>
            <v-list-item three-line>
              <v-list-item-content>
                <v-list-item-title class="headline mb-2">
                  {{ workExperience.company.name }}
                </v-list-item-title>
                <div class="mb-2">
                  {{ workExperience.jobTitle }}
                </div>
                <v-list-item-subtitle>{{
                  workExperience.description
                }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <v-card-actions>
              <v-btn
                v-if="canEdit"
                color="primary"
                @click="onWorkExperienceClick(workExperience)"
                >Edit</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-col>
    <v-col cols="12" v-if="canEdit">
      <v-btn color="primary" dark @click="newWorkExperience"
        >New work experience</v-btn
      >
    </v-col>
  </v-row>
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
