<template>
  <v-container style="max-width: 1024px">
    <CVDetails :cvId="id" :canEdit="canEditCV(id)" />
    <CVSkills :cvId="id" :canEdit="canEditCV(id)" />
    <CVEducations :cvId="id" :canEdit="canEditCV(id)" />
    <CVWorkExperiences :cvId="id" :canEdit="canEditCV(id)" />
    <CVProjectMemberships :cvId="id" :canEdit="canEditCV(id)" />
  </v-container>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import CVDetails from "./user/CVDetails.vue";
import CVSkills from "./skill/CVSkills.vue";
import CVEducations from "./education/CVEducations.vue";
import CVWorkExperiences from "./work_experience/CVWorkExperiences.vue";
import CVProjectMemberships from "./project_membership/CVProjectMemberships.vue";
import AuthModule from "@/store/modules/auth";
import { ServiceManager } from "@/services";

@Component({
  components: {
    CVDetails,
    CVSkills,
    CVEducations,
    CVWorkExperiences,
    CVProjectMemberships,
  },
})
export default class CVShowView extends Vue {
  id: number | null = null;

  get canEditCV() {
    return (cvId: number): boolean => {
      return AuthModule.canEditCV(cvId);
    };
  }

  async fetchCV(): Promise<void> {
    ServiceManager.setIsPlayground(false);
    if (this.id) {
      await Promise.all([
        ServiceManager.cv.fetchCV(this.id),
        ServiceManager.workExperience.fetchCVWorkExperiences(this.id),
        ServiceManager.skill.fetchCVSkills(this.id),
        ServiceManager.projectMembership.fetchCVProjectMemberships(this.id),
        ServiceManager.education.fetchCVEducations(this.id),
      ]);
    }
  }

  @Watch("$route.params.id")
  async routerChanged(id: string): Promise<void> {
    this.id = parseInt(id, 10);

    await this.fetchCV();
  }

  async created(): Promise<void> {
    const idStr = this.$route.params.id;
    this.id = parseInt(idStr, 10);

    await this.fetchCV();
  }
}
</script>
