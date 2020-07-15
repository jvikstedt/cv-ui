<template>
  <v-row>
    <v-col cols="12">
      <h2>Educations</h2>
      <div v-for="education in educations" :key="education.id">
        <h4 @click="onEducationClick(education)">
          {{ education.school.name }}
        </h4>
      </div>
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
  public getCVEducations!: (id: number) => Education[];

  get educations(): Education[] {
    return this.getCVEducations(this.id);
  }

  @DialogStore.Mutation
  public pushDialogComponent!: (dialogComponent: DialogComponent) => void;

  private async onEducationClick(education: Education) {
    this.pushDialogComponent({
      component: EditEducationDialog,
      props: { educationId: education.id }
    });
  }

  private async newEducation() {
    this.pushDialogComponent({
      component: NewEducationDialog,
      props: { id: this.id }
    });
  }
}
</script>
