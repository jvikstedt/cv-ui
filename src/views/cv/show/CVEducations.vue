<template>
  <v-card class="mt-5">
    <v-card-title class="headline">Educations</v-card-title>
    <v-card-text>
      <div v-for="education in educations" :key="education.id">
        <v-list-item three-line>
          <v-list-item-content>
            <v-list-item-title class="headline mb-2">
              {{ education.school.name }}
              <v-btn
                v-if="canEdit"
                icon
                small
                @click="onEducationClick(education)"
              >
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </v-list-item-title>
            <div class="mb-2">
              {{ education.degree }} / {{ education.fieldOfStudy }}
            </div>
            <v-list-item-subtitle>
              {{ education.startYear }} - {{ education.endYear }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>
      </div>
    </v-card-text>
    <v-card-actions>
      <v-btn v-if="canEdit" color="primary" @click="newEducation">
        New Education
      </v-btn>
    </v-card-actions>
  </v-card>
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
