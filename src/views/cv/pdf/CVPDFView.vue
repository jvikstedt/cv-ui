<template>
  <div style="width:800px">
    <v-btn @click="openEditTemplateDialog">
      TEMPLATE
    </v-btn>
    <v-btn @click="openEditJsonDialog">
      JSON
    </v-btn>

    <object
      v-if="pdfUrl"
      id="pdfviewer"
      v-bind:data="pdfUrl"
      type="application/pdf"
      width="100%"
      height="750px"
    />
    <p v-if="!pdfUrl">Select template</p>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { namespace } from "vuex-class";
import * as handlebars from "handlebars";
import { Template } from "@/model/template";
import { CVExportData } from "@/model/cv";
import { ExportPdfDto } from "@/model/exporter";
import { DialogComponent } from "@/dialog";
import TemplatePdfForm from "./components/TemplatePdfForm.vue";
import EditTemplateDialog from "./components/EditTemplateDialog.vue";
import EditJsonDialog from "./components/EditJsonDialog.vue";

const CVPDFStore = namespace("CVPDFStore");
const DialogStore = namespace("DialogStore");

@Component({
  components: {
    TemplatePdfForm,
    EditTemplateDialog,
    EditJsonDialog
  }
})
export default class CVPDFView extends Vue {
  id: number | null = null;

  @CVPDFStore.State
  selectedTemplate!: Template | null;

  @CVPDFStore.State
  cvData!: CVExportData;

  @CVPDFStore.State
  fetching!: boolean;

  @CVPDFStore.Getter
  getTemplates!: Template[];

  @CVPDFStore.State
  blob!: Blob | null;

  @CVPDFStore.Action
  fetchCV!: (id: number) => Promise<void>;

  @CVPDFStore.Action
  fetchTemplates!: () => Promise<void>;

  @CVPDFStore.Action
  setCVDataAction!: (cvData: CVExportData) => Promise<void>;

  @CVPDFStore.Action
  setSelectedTemplateAction!: (template: Template) => Promise<void>;

  @CVPDFStore.Action
  exportPDF!: (exportPdfDto: ExportPdfDto) => Promise<void>;

  @DialogStore.Mutation
  pushDialogComponent!: (dialogComponent: DialogComponent) => void;

  get pdfUrl() {
    if (this.blob) {
      return window.URL.createObjectURL(this.blob);
    }

    return null;
  }

  async created(): Promise<void> {
    const idStr = this.$route.params.id;
    this.id = parseInt(idStr, 10);

    await this.fetchCV(this.id);
    await this.fetchTemplates();
  }

  async onTemplateUse(template: Template): Promise<void> {
    await this.setSelectedTemplateAction(template);
    await this.print();
  }

  async onJsonUse(cvData: CVExportData): Promise<void> {
    await this.setCVDataAction(cvData);
    await this.print();
  }

  async print(): Promise<void> {
    if (this.selectedTemplate) {
      const content = handlebars.compile(this.selectedTemplate.data.content)(
        this.cvData
      );

      await this.exportPDF({ ...this.selectedTemplate.data, content });
    }
  }

  openEditJsonDialog() {
    this.pushDialogComponent({
      component: EditJsonDialog,
      props: { data: this.cvData, use: this.onJsonUse }
    });
  }

  openEditTemplateDialog() {
    this.pushDialogComponent({
      component: EditTemplateDialog,
      props: {
        initialTemplate: this.selectedTemplate,
        templates: this.getTemplates,
        use: this.onTemplateUse
      }
    });
  }
}
</script>
