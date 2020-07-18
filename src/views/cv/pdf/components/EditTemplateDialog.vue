<template>
  <v-card>
    <v-card-title class="headline">
      Template
    </v-card-title>

    <v-card-actions>
      <v-spacer></v-spacer>

      <v-btn color="red darken-1" text @click="onSave" :disabled="!template">
        Save
      </v-btn>

      <v-btn color="blue darken-1" text @click="onCancel">
        Cancel
      </v-btn>

      <v-btn color="green darken-1" text @click="onUse" :disabled="!template">
        Use
      </v-btn>
    </v-card-actions>

    <v-card-text>
      <v-select
        v-model="template"
        :items="getTemplates"
        label="Template"
        item-text="name"
        return-object
      >
        <template v-slot:append-outer>
          <v-btn @click="newTemplate">
            New
          </v-btn>
        </template>
      </v-select>

      <TemplatePdfForm
        :key="template.id"
        v-if="template"
        :initialTemplate="template"
        @change="onChange"
      />
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import * as R from "ramda";
import { namespace } from "vuex-class";
import { Component, Mixins } from "vue-property-decorator";
import {
  Template,
  CreateTemplateDto,
  PatchTemplateDto
} from "@/model/template";
import TemplatePdfForm from "./TemplatePdfForm.vue";
import { ExportPdfDto } from "@/model/exporter";
import { DialogFormMixin } from "@/mixins";

const CVPDFStore = namespace("CVPDFStore");

@Component({
  components: {
    TemplatePdfForm
  }
})
export default class EditTemplateDialog extends Mixins(DialogFormMixin) {
  @CVPDFStore.State
  selectedTemplate!: Template | null;

  @CVPDFStore.Getter
  getTemplates!: Template[];

  @CVPDFStore.Mutation
  setSelectedTemplate!: (template: Template) => void;

  @CVPDFStore.Action
  fetchTemplates!: () => Promise<void>;

  @CVPDFStore.Action
  createTemplate!: (createTemplateDto: CreateTemplateDto) => Promise<void>;

  @CVPDFStore.Action
  patchTemplate!: (patchTemplateDto: PatchTemplateDto) => Promise<void>;

  template: Template | null = null;

  async created(): Promise<void> {
    if (this.selectedTemplate) {
      this.template = R.clone(this.selectedTemplate);
    }
  }

  async onChange(template: Template): Promise<void> {
    this.template = template;
  }

  async onSave() {
    if (this.template && !this.template.id) {
      await this.createTemplate({
        name: this.template.name,
        exporter: this.template.exporter,
        data: this.template.data
      });
    } else if (this.template) {
      await this.patchTemplate({
        id: this.template.id,
        data: this.template.data
      });
    }

    this.popDialogComponent();
  }

  async onUse() {
    if (this.template) {
      this.setSelectedTemplate(this.template);
    }
    this.popDialogComponent();
  }

  async newTemplate() {
    this.template = R.merge(new Template(), {
      name: "",
      exporter: "pdf",
      data: new ExportPdfDto()
    });
  }
}
</script>
