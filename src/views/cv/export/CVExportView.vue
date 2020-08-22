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
import { namespace } from "vuex-class";
import EditJsonDialog from "./components/EditJsonDialog.vue";
import { DialogComponent } from "@/dialog";
import { Template } from "@/model/template";
import { ExportPdfDto, ExportDocxDto } from "@/model/exporter";
import EditTemplateDialog from "./components/EditTemplateDialog.vue";
import { ExportData } from "./types";

const CVExportStore = namespace("CVExportStore");
const DialogStore = namespace("DialogStore");

@Component
export default class CVExportView extends Vue {
  id: number | null = null;

  @CVExportStore.State
  fetching!: boolean;

  @CVExportStore.State
  pdf!: string | null;

  @CVExportStore.State
  docx!: string | null;

  @CVExportStore.State
  exportData!: ExportData | null;

  @CVExportStore.State
  selectedTemplate!: Template | null;

  @CVExportStore.Action
  fetchCV!: (id: number) => Promise<void>;

  @CVExportStore.Action
  fetchTemplates!: () => Promise<void>;

  @CVExportStore.Action
  exportPDF!: (exportPdfDto: ExportPdfDto) => Promise<void>;

  @CVExportStore.Action
  exportDocx!: (exportDocxDto: ExportDocxDto) => Promise<void>;

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
      switch (this.selectedTemplate.exporter) {
        case "pdf":
          await this.exportPDF({
            ...this.selectedTemplate.data,
            data: this.exportData
          });
          break;
        case "docx":
          await this.exportDocx({
            ...this.selectedTemplate.data,
            data: this.exportData
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
  async selectedTemplateChanged() {
    await this.print();
  }

  @Watch("exportData")
  async cvExportDataChanged() {
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
