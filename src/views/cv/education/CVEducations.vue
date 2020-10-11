<template>
  <v-card class="mt-5">
    <v-card-title class="headline">
      <v-icon left>mdi-school</v-icon>
      Educations
    </v-card-title>
    <v-card-text>
      <div v-for="education in educations" :key="education.id">
        <v-list-item three-line style="background-color: white">
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
import NewEducationDialog from "./components/NewEducationDialog.vue";
import EditEducationDialog from "./components/EditEducationDialog.vue";
import DialogModule from "@/store/modules/dialog";
import EducationModule, { Education } from "@/store/modules/education";

@Component
export default class CVEducations extends Vue {
  @Prop({ required: true }) readonly cvId!: number;
  @Prop({ required: true }) readonly canEdit!: boolean;

  get educations(): Education[] {
    return EducationModule.listByCV(this.cvId);
  }

  async created(): Promise<void> {
    await EducationModule.fetchCVEducations(this.cvId);
  }

  onEducationClick(education: Education): void {
    DialogModule.pushDialogComponent({
      component: EditEducationDialog,
      props: { education },
    });
  }

  newEducation(): void {
    DialogModule.pushDialogComponent({
      component: NewEducationDialog,
      props: {
        cvId: this.cvId,
        existingEducations: this.educations,
      },
    });
  }
}
</script>