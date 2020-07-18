<template>
  <v-card>
    <v-card-title class="headline">
      JSON Editor
    </v-card-title>

    <v-card-actions>
      <v-spacer></v-spacer>

      <v-btn color="green darken-1" text @click="onCancel">
        Cancel
      </v-btn>

      <v-btn color="green darken-1" text @click="onUse">
        Use
      </v-btn>
    </v-card-actions>

    <v-card-text>
      <div
        id="jsoneditor"
        ref="jsoneditor"
        style="width: 100%; height: 400px"
      ></div>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import JSONEditor from "jsoneditor";
import { Component, Mixins } from "vue-property-decorator";
import { CVExportData } from "@/model/cv";
import { DialogFormMixin } from "@/mixins";
import { namespace } from "vuex-class";

const CVPDFStore = namespace("CVPDFStore");

@Component
export default class EditJsonDialog extends Mixins(DialogFormMixin) {
  @CVPDFStore.State
  cvExportData!: CVExportData | null;

  @CVPDFStore.Mutation
  setCVExportData!: (cvExportData: CVExportData) => void;

  editor?: JSONEditor;

  mounted() {
    const element = document.getElementById("jsoneditor");
    if (element && this.cvExportData) {
      this.editor = new JSONEditor(element, {
        mode: "tree",
        search: true
      });
      this.editor.set(this.cvExportData);
    }
  }

  onUse() {
    if (this.editor) {
      this.setCVExportData(this.editor.get());
    }

    this.popDialogComponent();
  }
}
</script>
