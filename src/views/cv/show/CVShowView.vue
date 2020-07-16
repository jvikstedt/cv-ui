<template>
  <v-container class="grey" style="max-width: 1024px" fluid>
    <template v-if="fetching">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </template>
    <template v-else-if="getCV(id)">
      <v-btn color="primary darken-1" text @click="onExport">
        Export
      </v-btn>
      <CVDetails :id="id" :canEdit="canEditCV(id)" />
      <CVSkills :id="id" :canEdit="canEditCV(id)" />
      <CVEducations :id="id" :canEdit="canEditCV(id)" />
      <CVWorkExperiences :id="id" :canEdit="canEditCV(id)" />
    </template>
    <template v-else>
      <p>Something went wrong</p>
    </template>
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

const CVShowStore = namespace("CVShowStore");
const AuthStore = namespace("AuthStore");

@Component({
  components: {
    CVDetails,
    CVSkills,
    CVEducations,
    CVWorkExperiences
  }
})
export default class CVShowView extends Vue {
  id: number | null = null;

  @CVShowStore.State
  fetching!: boolean;

  @CVShowStore.Action
  fetchCV!: (id: number) => Promise<CV>;

  @CVShowStore.Getter
  getCV!: (id: number) => CV;

  @AuthStore.Getter
  canEditCV!: (cvId: number) => boolean;

  onExport() {
    this.$router.push(`/cv/${this.id}/pdf`);
  }

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
