<template>
  <v-container class="grey" style="max-width: 1024px" fluid>
    <template v-if="fetching">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </template>
    <template v-else-if="getCV(id)">
      <v-btn color="primary darken-1" text @click="onExport">
        Export
      </v-btn>
      <CVDetails :id="id" />
      <CVSkills :id="id" />
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

const CVShowStore = namespace("CVShowStore");

@Component({
  components: {
    CVDetails,
    CVSkills
  }
})
export default class CVShowView extends Vue {
  public id: number | null = null;

  @CVShowStore.State
  public fetching!: boolean;

  @CVShowStore.Action
  public fetchCV!: (id: number) => Promise<CV>;

  @CVShowStore.Getter
  public getCV!: (id: number) => CV;

  private onExport() {
    this.$router.push(`/cv/${this.id}/pdf`);
  }

  @Watch("$route.params.id")
  async routerChanged(id: string) {
    this.id = parseInt(id, 10);

    await this.fetchCV(this.id);
  }

  private async created() {
    const idStr = this.$route.params.id;
    this.id = parseInt(idStr, 10);

    await this.fetchCV(this.id);
  }
}
</script>
