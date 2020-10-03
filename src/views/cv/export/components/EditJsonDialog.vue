<template>
  <v-card>
    <v-card-title class="headline"> JSON Editor </v-card-title>

    <v-card-actions>
      <v-spacer></v-spacer>

      <v-btn color="red darken-1" text @click="onCancel"> Cancel </v-btn>

      <v-btn color="green darken-1" text @click="onUse"> Use </v-btn>
    </v-card-actions>

    <v-card-text>
      <div
        id="jsoneditor"
        ref="jsoneditor"
        style="width: 100%; height: 600px"
      ></div>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import JSONEditor from "jsoneditor";
import { Component, Mixins } from "vue-property-decorator";
import { DialogFormMixin } from "@/mixins";
import ExportModule from "@/store/modules/export";

@Component
export default class EditJsonDialog extends Mixins(DialogFormMixin) {
  editor?: JSONEditor;

  mounted(): void {
    const element = document.getElementById("jsoneditor");
    if (element && ExportModule.exportData) {
      this.editor = new JSONEditor(element, {
        mode: "tree",
        search: true,
      });
      this.editor.set(ExportModule.exportData);
    }
  }

  onUse(): void {
    if (this.editor) {
      ExportModule.setCVExportData(this.editor.get());
    }

    this.popDialogComponent();
  }
}
</script>
