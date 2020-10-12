<template>
  <object
    v-if="selectedTemplate && selectedTemplate.exporter === 'pdf' && pdf"
    id="pdfviewer"
    v-bind:data="pdf"
    type="application/pdf"
    width="100%"
    height="750px"
  />
</template>

<script lang="ts">
import * as R from "ramda";
import { Component, Mixins } from "vue-property-decorator";
import TemplateForm from "./TemplateForm.vue";
import { DialogFormMixin } from "@/mixins";
import ExportModule, { ExportPdfDto, Template } from "@/store/modules/export";

@Component({
  components: {
    TemplateForm,
  },
})
export default class EditTemplateDialog extends Mixins(DialogFormMixin) {
  get getTemplates(): Template[] {
    return ExportModule.getTemplates;
  }

  template: Template | null = null;

  async created(): Promise<void> {
    if (ExportModule.selectedTemplate) {
      this.template = R.clone(ExportModule.selectedTemplate);
    }
  }

  async onChange(template: Template): Promise<void> {
    this.template = template;
  }

  async onSave(): Promise<void> {
    if (this.template && !this.template.id) {
      await ExportModule.createTemplate({
        name: this.template.name,
        exporter: this.template.exporter,
        data: this.template.data,
      });
    } else if (this.template) {
      await ExportModule.patchTemplate({
        id: this.template.id,
        data: this.template.data,
      });
    }

    this.popDialogComponent();
  }

  onUse(): void {
    if (this.template) {
      ExportModule.setSelectedTemplate(this.template);
    }
    this.popDialogComponent();
  }

  newTemplate(): void {
    this.template = R.merge(new Template(), {
      name: "",
      exporter: "pdf",
      data: new ExportPdfDto(),
    });
  }
}
</script>
