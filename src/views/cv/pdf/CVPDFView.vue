<template>
  <div style="width:800px">
    <EditTemplateDialog
      :initialTemplate="selectedTemplate"
      @use="onTemplateUse"
      :templates="getTemplates"
    />
    <EditJsonDialog v-if="cvData" :cvData="cvData" @use="onJsonUse" />

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
import TemplatePdfForm from "./components/TemplatePdfForm.vue";
import EditTemplateDialog from "./components/EditTemplateDialog.vue";
import EditJsonDialog from "./components/EditJsonDialog.vue";

const CVPDFStore = namespace("CVPDFStore");

@Component({
  components: {
    TemplatePdfForm,
    EditTemplateDialog,
    EditJsonDialog
  }
})
export default class CVPDFView extends Vue {
  public id: number | null = null;

  @CVPDFStore.State
  public selectedTemplate!: Template | null;

  @CVPDFStore.State
  public cvData!: CVExportData;

  @CVPDFStore.State
  public fetching!: boolean;

  @CVPDFStore.Getter
  public getTemplates!: Template[];

  @CVPDFStore.State
  public blob!: Blob | null;

  @CVPDFStore.Action
  public fetchCV!: (id: number) => Promise<void>;

  @CVPDFStore.Action
  public fetchTemplates!: () => Promise<void>;

  @CVPDFStore.Action
  public setCVDataAction!: (cvData: CVExportData) => Promise<void>;

  @CVPDFStore.Action
  public setSelectedTemplateAction!: (template: Template) => Promise<void>;

  @CVPDFStore.Action
  public exportPDF!: (exportPdfDto: ExportPdfDto) => Promise<void>;

  get pdfUrl() {
    if (this.blob) {
      return window.URL.createObjectURL(this.blob);
    }

    return null;
  }

  private async created(): Promise<void> {
    const idStr = this.$route.params.id;
    this.id = parseInt(idStr, 10);

    await this.fetchCV(this.id);
    await this.fetchTemplates();
  }

  private async onTemplateUse(template: Template): Promise<void> {
    await this.setSelectedTemplateAction(template);
    await this.print();
  }

  private async onJsonUse(cvData: CVExportData): Promise<void> {
    await this.setCVDataAction(cvData);
    await this.print();
  }

  private async print(): Promise<void> {
    if (this.selectedTemplate) {
      const content = handlebars.compile(this.selectedTemplate.data.content)(
        this.cvData
      );

      await this.exportPDF({ ...this.selectedTemplate.data, content });
    }
  }
}
</script>
