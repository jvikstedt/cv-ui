<template>
  <v-dialog v-model="dialog" max-width="500" v-on:click:outside="onCancel">
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
import CV from "@/store/CV";

@Component
export default class EditJsonDialog extends Vue {
  @Prop({ required: true }) readonly cv!: CV | null;
  @Prop({ required: true }) readonly dialog!: boolean;
  @Prop({ required: true }) readonly setDialog!: (dialog: boolean) => void;

  private valid = false;

  private editor?: JSONEditor;

  @Watch("cv")
  dialogChanged(cv: CV) {
    if (this.editor) {
      this.editor.set(cv);
    }
  }

  private async mounted() {
    const element = document.getElementById("jsoneditor");
    if (this.dialog && this.cv && element) {
      if (!this.editor) {
        this.editor = new JSONEditor(element, { mode: "tree", search: true });
      }
      this.editor.set(this.cv);
    }
  }

  private async onUse() {
    if (this.editor) {
      this.$emit("use", this.editor.get());
    }

    this.setDialog(false);
  }

  private async onCancel() {
    this.setDialog(false);
  }
}
</script>
