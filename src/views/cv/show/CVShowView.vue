<template>
  <v-container style="max-width: 1024px">
    <CVDetails :id="id" :canEdit="canEditCV(id)" />
    <CVSkills :id="id" :canEdit="canEditCV(id)" />
    <CVEducations :id="id" :canEdit="canEditCV(id)" />
    <CVWorkExperiences :id="id" :canEdit="canEditCV(id)" />
    <CVProjectMemberships :id="id" :canEdit="canEditCV(id)" />
  </v-container>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { namespace } from "vuex-class";
import { CV } from "@/model/cv";
import CVDetails from "./CVDetails.vue";
import CVSkills from "./CVSkills.vue";
import CVEducations from "./CVEducations.vue";
import CVWorkExperiences from "./CVWorkExperiences.vue";
import CVProjectMemberships from "./CVProjectMemberships.vue";

const CVShowStore = namespace("CVShowStore");
const AuthStore = namespace("AuthStore");

@Component({
  components: {
    CVDetails,
    CVSkills,
    CVEducations,
    CVWorkExperiences,
    CVProjectMemberships
  }
})
export default class CVShowView extends Vue {
  id: number | null = null;

  @CVShowStore.Action
  fetchCV!: (id: number) => Promise<CV>;

  @AuthStore.Getter
  canEditCV!: (cvId: number) => boolean;

  @Watch("$route.params.id")
  async routerChanged(id: string) {
    this.id = parseInt(id, 10);

    await this.fetchCV(this.id);
  }

  async created() {
    const idStr = this.$route.params.id;
    this.id = parseInt(idStr, 10);

    await this.fetchCV(this.id);
  }
}
</script>
