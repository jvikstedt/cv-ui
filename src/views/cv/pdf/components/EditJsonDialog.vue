<template>
  <v-card>
    <v-card-title class="headline">
      JSON
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
import { Component, Vue, Prop } from "vue-property-decorator";
import { namespace } from "vuex-class";
import { CVExportData } from "@/model/cv";

const DialogStore = namespace("DialogStore");

@Component
export default class EditJsonDialog extends Vue {
  @Prop({ required: true }) readonly data!: CVExportData;
  @Prop({ required: true }) readonly use!: (
    data: CVExportData
  ) => Promise<void>;

  private editor?: JSONEditor;

  @DialogStore.Mutation
  public popDialogComponent!: () => void;

  private mounted() {
    const element = document.getElementById("jsoneditor");
    if (element) {
      this.editor = new JSONEditor(element, {
        mode: "tree",
        search: true
      });
      this.editor.set(this.data);
    }
  }

  private async onUse() {
    if (this.editor) {
      await this.use(this.editor.get());
    }

    this.popDialogComponent();
  }

  private async onCancel() {
    this.popDialogComponent();
  }
}
</script>
