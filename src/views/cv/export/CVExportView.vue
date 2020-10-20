<template>
  <v-container style="max-width: 1024px">
    <v-row>
      <v-col cols="12" sm="7">
        <v-select
          v-model="template"
          :items="getTemplates"
          label="Template"
          placeholder="Select template"
          item-text="name"
          return-object
        >
          <template slot="selection" slot-scope="data">
            {{ data.item.exporter }} - {{ data.item.name }}
          </template>
          <template slot="item" slot-scope="data">
            {{ data.item.exporter }} - {{ data.item.name }}
          </template>
          <template v-slot:append-outer>
            <v-btn :disabled="!template" @click="exportTemplate">
              Export
            </v-btn>
            <v-btn class="ml-2" @click="templateManager">
              Template manager
            </v-btn>
          </template>
        </v-select>
      </v-col>
    </v-row>

    <v-alert dense outlined text type="warning">
      This is an export mode, modifications to the CV are not persistent!
      <a @click="openCV">Click here</a> to get back to normal mode.
    </v-alert>
    <CVDetails :cvId="id" :canEdit="true" :hideExport="true" />
    <CVSkills :cvId="id" :canEdit="true" />
    <CVEducations :cvId="id" :canEdit="true" />
    <CVWorkExperiences :cvId="id" :canEdit="true" />
    <CVProjectMemberships :cvId="id" :canEdit="true" />
  </v-container>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import CVDetails from "../user/CVDetails.vue";
import CVSkills from "../skill/CVSkills.vue";
import CVEducations from "../education/CVEducations.vue";
import CVWorkExperiences from "../work_experience/CVWorkExperiences.vue";
import CVProjectMemberships from "../project_membership/CVProjectMemberships.vue";
import { ServiceManager } from "@/services";
import DialogModule from "@/store/modules/dialog";
import EditTemplateDialog from "./components/EditTemplateDialog.vue";
import ExportModule, { Template } from "@/store/modules/export";
import RenderTemplateDialog from "./components/RenderTemplateDialog.vue";

@Component({
  components: {
    CVDetails,
    CVSkills,
    CVEducations,
    CVWorkExperiences,
    CVProjectMemberships,
  },
})
export default class CVExportView extends Vue {
  id: number | null = null;

  template: Template | null = null;

  get canEditCV() {
    return (): boolean => {
      return true;
    };
  }

  get getTemplates(): Template[] {
    return ExportModule.getTemplates;
  }

  exportTemplate(): void {
    if (this.template) {
      DialogModule.pushDialogComponent({
        component: RenderTemplateDialog,
        props: { template: this.template, cvId: this.id },
      });
    }
  }

  templateManager(): void {
    DialogModule.pushDialogComponent({
      component: EditTemplateDialog,
      props: {},
    });
    this.template = null;
  }

  async fetchCV(): Promise<void> {
    ServiceManager.setIsPlayground(true);
    if (this.id) {
      await Promise.all([
        ExportModule.fetchTemplates(),
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

  beforeDestroy(): void {
    ServiceManager.setIsPlayground(false);
  }

  openCV(): void {
    this.$router.push(`/cv/${this.id}`);
  }
}
</script>
