<template>
  <v-card>
    <v-card-title class="headline"> Template </v-card-title>

    <v-card-actions>
      <v-spacer></v-spacer>

      <v-btn color="red darken-1" text @click="onCancel"> Cancel </v-btn>

      <v-btn color="green darken-1" text @click="onSave" :disabled="!template">
        Save
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
        <template slot="selection" slot-scope="data">
          {{ data.item.exporter }} - {{ data.item.name }}
        </template>
        <template slot="item" slot-scope="data">
          {{ data.item.exporter }} - {{ data.item.name }}
        </template>
        <template v-slot:append-outer>
          <v-btn @click="newTemplate"> New </v-btn>
        </template>
      </v-select>

      <TemplateForm
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

  newTemplate(): void {
    this.template = R.merge(new Template(), {
      name: "",
      exporter: "pdf",
      data: new ExportPdfDto(),
    });
  }
}
</script>
