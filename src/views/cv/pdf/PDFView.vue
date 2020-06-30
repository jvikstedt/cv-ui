<template>
  <div style="width:800px">
    <EditTemplateDialog
      v-if="editTemplateDialog"
      :dialog="editTemplateDialog"
      :setDialog="setEditTemplateDialog"
      :initialTemplate="template"
      @use="onTemplateUse"
    />
    <EditJsonDialog
      v-if="editJsonDialog"
      :dialog="editJsonDialog"
      :setDialog="setEditJsonDialog"
      :cv="cvData"
      @use="onJsonUse"
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
    <p v-if="!pdfblob">Select template</p>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import * as handlebars from "handlebars";
import { GetCVDetailsById } from "@/api/cv";
import CV from "@/store/CV";
import { ExportPdf } from "@/api/exporter";
import Template from "@/store/Template";
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

  private template: Template | null = null;
  private editTemplateDialog = false;
  private editJsonDialog = false;

  private pdfblob = "";

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

  private async onTemplateUse(template: Template): Promise<void> {
    this.template = template;
    await this.print();
  }

  private async onJsonUse(cv: CV): Promise<void> {
    this.cvData = cv;
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
