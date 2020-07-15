<template>
  <v-row>
    <v-col cols="12">
      <h2>Educations</h2>
      <v-row>
        <v-col
          v-for="education in educations"
          :key="education.id"
          cols="12"
          sm="6"
        >
          <v-card class="mx-auto" outlined>
            <v-list-item three-line>
              <v-list-item-content>
                <v-list-item-title class="headline mb-2"
                  >{{ education.school.name }} ({{ education.startYear }} -
                  {{ education.endYear }})</v-list-item-title
                >
                <div class="mb-2">
                  {{ education.degree }} / {{ education.fieldOfStudy }}
                </div>
                <v-list-item-subtitle>{{
                  education.description
                }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <v-card-actions>
              <v-btn
                v-if="canEdit"
                color="primary"
                @click="onEducationClick(education)"
                >Edit</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-col>
    <v-col cols="12" v-if="canEdit">
      <v-btn color="primary" dark @click="newEducation">New Education</v-btn>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { namespace } from "vuex-class";
import { Education } from "@/model/education";
import { DialogComponent } from "@/dialog";
import NewEducationDialog from "./components/NewEducationDialog.vue";
import EditEducationDialog from "./components/EditEducationDialog.vue";

const CVShowStore = namespace("CVShowStore");
const DialogStore = namespace("DialogStore");

@Component
export default class CVEducations extends Vue {
  @Prop({ required: true }) readonly id!: number;
  @Prop({ required: true }) readonly canEdit!: boolean;

  @CVShowStore.Getter
  getCVEducations!: (id: number) => Education[];

  get educations(): Education[] {
    return this.getCVEducations(this.id);
  }

  @DialogStore.Mutation
  pushDialogComponent!: (dialogComponent: DialogComponent) => void;

  async onEducationClick(education: Education) {
    this.pushDialogComponent({
      component: EditEducationDialog,
      props: { educationId: education.id }
    });
  }

  async newEducation() {
    this.pushDialogComponent({
      component: NewEducationDialog,
      props: { id: this.id }
    });
  }
}
</script>
