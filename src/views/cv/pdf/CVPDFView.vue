<template>
  <v-container style="max-width: 1024px">
    <v-card :loading="fetching">
      <v-card-title class="headline">PDF export</v-card-title>
      <v-card-actions>
        <v-btn color="primary" @click="editTemplate">Template</v-btn>
        <v-btn color="primary" @click="editData">Edit data</v-btn>
      </v-card-actions>
      <v-card-text>
        <object
          v-if="pdf"
          id="pdfviewer"
          v-bind:data="pdf"
          type="application/pdf"
          width="100%"
          height="750px"
        />
        <p v-if="!pdf">Select template</p>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { namespace } from "vuex-class";
import * as handlebars from "handlebars";
import EditJsonDialog from "./components/EditJsonDialog.vue";
import { DialogComponent } from "@/dialog";
import { Template } from "@/model/template";
import { ExportPdfDto } from "@/model/exporter";
import EditTemplateDialog from "./components/EditTemplateDialog.vue";
import { ExportData } from "./types";

const CVPDFStore = namespace("CVPDFStore");
const DialogStore = namespace("DialogStore");

@Component
export default class CVPDFView extends Vue {
  id: number | null = null;

  @CVPDFStore.State
  fetching!: boolean;

  @CVPDFStore.State
  pdf!: string | null;

  @CVPDFStore.State
  exportData!: ExportData | null;

  @CVPDFStore.State
  selectedTemplate!: Template | null;

  @CVPDFStore.Action
  fetchCV!: (id: number) => Promise<void>;

  @CVPDFStore.Action
  fetchTemplates!: () => Promise<void>;

  @CVPDFStore.Action
  exportPDF!: (exportPdfDto: ExportPdfDto) => Promise<void>;

  @DialogStore.Mutation
  pushDialogComponent!: (dialogComponent: DialogComponent) => void;

  async created(): Promise<void> {
    const idStr = this.$route.params.id;
    this.id = parseInt(idStr, 10);

    await this.fetchCV(this.id);
    await this.fetchTemplates();
  }

  editData() {
    this.pushDialogComponent({
      component: EditJsonDialog,
      props: {},
      maxWidth: 1200
    });
  }

  editTemplate() {
    this.pushDialogComponent({
      component: EditTemplateDialog,
      props: {}
    });
  }

  async print(): Promise<void> {
    if (this.selectedTemplate && this.exportData) {
      const content = handlebars.compile(this.selectedTemplate.data.content)(
        this.exportData
      );

      await this.exportPDF({ ...this.selectedTemplate.data, content });
    }
  }

  @Watch("selectedTemplate")
  async selectedTemplateChanged() {
    await this.print();
  }

  @Watch("exportData")
  async cvExportDataChanged() {
    await this.print();
  }
}
</script>
