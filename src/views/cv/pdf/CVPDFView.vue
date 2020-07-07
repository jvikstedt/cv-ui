<template>
  <div style="width:800px">
    <EditTemplateDialog :initialTemplate="template" @use="onTemplateUse" />
    <EditJsonDialog v-if="cvData" :cvData="cvData" @use="onJsonUse" />

    <object
      v-if="pdfblob"
      id="pdfviewer"
      v-bind:data="pdfblob"
      type="application/pdf"
      width="100%"
      height="750px"
    />
    <p v-if="!pdfblob">Select template</p>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { namespace } from "vuex-class";
import * as handlebars from "handlebars";
import { Template, CVExportData } from "@/model";
import { ExportPdf } from "@/api/exporter";
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

  private template: Template | null = null;

  private pdfblob = "";

  @CVPDFStore.State
  public cvData!: CVExportData;

  @CVPDFStore.State
  public fetching!: boolean;

  @CVPDFStore.Action
  public fetchCV!: (id: number) => Promise<void>;

  @CVPDFStore.Action
  public setCVDataAction!: (cvData: CVExportData) => Promise<void>;

  private async created(): Promise<void> {
    try {
      const idStr = this.$route.params.id;
      this.id = parseInt(idStr, 10);

      await this.fetchCV(this.id);
    } catch (err) {
      // TODO Handle this better, maybe some error notification
      this.$router.push("/");
    }
  }

  private async onTemplateUse(template: Template): Promise<void> {
    this.template = template;
    await this.print();
  }

  private async onJsonUse(cvData: CVExportData): Promise<void> {
    await this.setCVDataAction(cvData);
    await this.print();
  }

  private async print(): Promise<void> {
    if (this.template) {
      const content = handlebars.compile(this.template.data.content)(
        this.cvData
      );

      const pdf = await ExportPdf({ ...this.template.data, content });

      const blob = new Blob([pdf], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      this.pdfblob = url;
    }
  }
}
</script>
