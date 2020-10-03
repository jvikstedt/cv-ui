<template>
  <v-container style="max-width: 1024px">
    <v-card :loading="fetching">
      <v-card-title class="headline">
        <v-icon left>mdi-export</v-icon>
        Export
      </v-card-title>
      <v-card-actions>
        <v-btn color="primary" @click="editTemplate">Template</v-btn>
        <v-btn color="primary" @click="editData">Edit data</v-btn>
      </v-card-actions>
      <v-card-text>
        <object
          v-if="selectedTemplate && selectedTemplate.exporter === 'pdf' && pdf"
          id="pdfviewer"
          v-bind:data="pdf"
          type="application/pdf"
          width="100%"
          height="750px"
        />
        <a
          v-if="
            selectedTemplate && selectedTemplate.exporter === 'docx' && docx
          "
          :download="docxFileName()"
          :href="docx"
          target="_blank"
        >
          Download docx
        </a>
        <p v-if="!selectedTemplate">Select template</p>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import EditJsonDialog from "./components/EditJsonDialog.vue";
import { Template } from "@/store/modules/export";
import EditTemplateDialog from "./components/EditTemplateDialog.vue";
import { ExportData } from "./types";
import DialogModule from "@/store/modules/dialog";
import ExportModule from "@/store/modules/export";

@Component
export default class CVExportView extends Vue {
  id: number | null = null;

  get fetching(): boolean {
    return ExportModule.fetching;
  }

  get pdf(): string | null {
    return ExportModule.pdf;
  }

  get docx(): string | null {
    return ExportModule.docx;
  }

  get exportData(): ExportData | null {
    return ExportModule.exportData;
  }

  get selectedTemplate(): Template | null {
    return ExportModule.selectedTemplate;
  }

  async created(): Promise<void> {
    const idStr = this.$route.params.id;
    this.id = parseInt(idStr, 10);

    await ExportModule.fetchCV(this.id);
    await ExportModule.fetchTemplates();
  }

  editData(): void {
    DialogModule.pushDialogComponent({
      component: EditJsonDialog,
      props: {},
      maxWidth: 1200,
    });
  }

  editTemplate(): void {
    DialogModule.pushDialogComponent({
      component: EditTemplateDialog,
      props: {},
    });
  }

  async print(): Promise<void> {
    if (this.selectedTemplate && this.exportData) {
      switch (this.selectedTemplate.exporter) {
        case "pdf":
          await ExportModule.exportPDF({
            ...this.selectedTemplate.data,
            data: this.exportData,
          });
          break;
        case "docx":
          await ExportModule.exportDocx({
            ...this.selectedTemplate.data,
            data: this.exportData,
          });
          break;
        default:
          console.log(
            `${this.selectedTemplate.exporter} not supported exporter`
          );
      }
    }
  }

  @Watch("selectedTemplate")
  async selectedTemplateChanged(): Promise<void> {
    await this.print();
  }

  @Watch("exportData")
  async cvExportDataChanged(): Promise<void> {
    await this.print();
  }

  docxFileName(): string {
    if (this.exportData) {
      return `${this.exportData.user.firstName}-${this.exportData.user.lastName}.docx`.toLowerCase();
    }
    return "noname.docx";
  }
}
</script>
