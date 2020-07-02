<template>
  <v-dialog
    v-model="dialog"
    max-width="600"
    v-if="cv"
    v-on:click:outside="onCancel"
  >
    <v-card>
      <v-card-title class="headline">
        {{ cv.id }}
      </v-card-title>

      <v-card-text>
        <v-textarea v-model="description" label="Description" />
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn color="green darken-1" text @click="onCancel">
          Cancel
        </v-btn>

        <v-btn color="green darken-1" text @click="onSave">
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import CV from "@/store/CV";
import { PatchCV, PatchCVDto } from "@/api/cv";

@Component
export default class EditCVDetailsDialog extends Vue {
  @Prop({ required: true }) readonly cv!: CV | null;
  @Prop({ required: true }) readonly dialog!: boolean;
  @Prop({ required: true }) readonly setDialog!: (dialog: boolean) => void;

  private description = "";

  @Watch("dialog")
  dialogChanged(dialog: boolean) {
    if (dialog && this.cv) {
      this.description = this.cv.description;
    }
  }

  private async onSave() {
    const patchCVDto: PatchCVDto = {
      description: this.description
    };

    if (this.cv) {
      await PatchCV(this.cv.id, patchCVDto);
    }

    this.setDialog(false);
  }

  private async onCancel() {
    this.setDialog(false);
  }
}
</script>
