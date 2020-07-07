<template>
  <v-dialog v-model="dialog" max-width="600">
    <template v-slot:activator="{ on, attrs }">
      <v-btn v-bind="attrs" v-on="on">
        JSON
      </v-btn>
    </template>
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
  </v-dialog>
</template>

<script lang="ts">
import JSONEditor from "jsoneditor";
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { CVExportData } from "@/model/cv";

@Component
export default class EditJsonDialog extends Vue {
  @Prop({ required: true }) readonly cvData!: CVExportData;

  private dialog = false;
  private valid = false;

  private editor?: JSONEditor;

  @Watch("dialog")
  dialogChanged(dialog: boolean) {
    if (dialog) {
      this.$nextTick(() => {
        const element = document.getElementById("jsoneditor");
        if (element) {
          if (!this.editor) {
            this.editor = new JSONEditor(element, {
              mode: "tree",
              search: true
            });
          }
          this.editor.set(this.cvData);
        }
      });
    }
  }

  private async onUse() {
    if (this.editor) {
      this.$emit("use", this.editor.get());
    }

    this.dialog = false;
  }

  private async onCancel() {
    this.dialog = false;
  }
}
</script>
