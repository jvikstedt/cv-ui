<template>
  <div style="width:800px">
    <EditTemplateDialog
      v-if="editTemplateDialog"
      :dialog="editTemplateDialog"
      :setDialog="setEditTemplateDialog"
      :template="templates[0]"
      @save="onTemplateSave"
    />
    <EditJsonDialog
      v-if="editJsonDialog"
      :dialog="editJsonDialog"
      :setDialog="setEditJsonDialog"
      :cv="cvData"
      @save="onJsonSave"
    />
    <v-btn @click="editTemplateDialog = true">
      Template
    </v-btn>
    <v-btn @click="editJsonDialog = true">
      Json
    </v-btn>

    <object
      v-if="pdfblob"
      id="pdfviewer"
      v-bind:data="pdfblob"
      type="application/pdf"
      width="100%"
      height="600px"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import * as handlebars from "handlebars";
import { GetCVDetailsById } from "@/api/cv";
import CV from "@/store/CV";
import { ExportPdfDto, ExportPdf } from "@/api/exporter";
import Template from "@/store/Template";
import { GetTemplates } from "@/api/template";
import TemplatePdfForm from "./components/TemplatePdfForm.vue";
import EditTemplateDialog from "./components/EditTemplateDialog.vue";
import EditJsonDialog from "./components/EditJsonDialog.vue";

@Component({
  components: {
    TemplatePdfForm,
    EditTemplateDialog,
    EditJsonDialog
  }
})
export default class PDFView extends Vue {
  public id: number | null = null;
  private cvData: CV | null = null;

  private exportPdfDto: ExportPdfDto = new ExportPdfDto();
  private editTemplateDialog = false;
  private editJsonDialog = false;

  private pdfblob = "";

  get templates(): Template[] {
    return Template.all();
  }

  private async created(): Promise<void> {
    try {
      const idStr = this.$route.params.id;
      this.id = parseInt(idStr, 10);

      await GetCVDetailsById(this.id);

      this.cvData = CV.query()
        .with("user")
        .with("skills")
        .with("skills.skillSubject")
        .find(this.id);

      const templates = await GetTemplates();
      if (templates[0]) {
        this.exportPdfDto = templates[0].data;
      }
      await this.print();
    } catch (err) {
      // TODO Handle this better, maybe some error notification
      this.$router.push("/");
    }
  }

  private setEditTemplateDialog(dialog: boolean) {
    this.editTemplateDialog = dialog;
  }

  private setEditJsonDialog(dialog: boolean) {
    this.editJsonDialog = dialog;
  }

  private async onTemplateSave(exportPdfDto: ExportPdfDto): Promise<void> {
    this.exportPdfDto = exportPdfDto;
    await this.print();
  }

  private async onJsonSave(cv: CV): Promise<void> {
    this.cvData = cv;
    await this.print();
  }

  private async print(): Promise<void> {
    const data = handlebars.compile(this.exportPdfDto.content)(this.cvData);

    const pdf = await ExportPdf({ ...this.exportPdfDto, content: data });

    const blob = new Blob([pdf], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);
    this.pdfblob = url;
  }
}
</script>
