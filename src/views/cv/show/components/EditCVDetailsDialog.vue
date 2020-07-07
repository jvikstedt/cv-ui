<template>
  <v-dialog v-model="dialog" max-width="600">
    <template v-slot:activator="{ on, attrs }">
      <v-btn icon small v-bind="attrs" v-on="on">
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
    </template>
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
import { CV, PatchCVDto } from "@/model";

@Component
export default class EditCVDetailsDialog extends Vue {
  @Prop({ required: true }) readonly cv!: CV;
  @Prop({ required: true }) readonly patchCV!: (
    patchCVDto: PatchCVDto
  ) => Promise<void>;

  private dialog = false;

  private description = "";

  @Watch("dialog")
  dialogChanged(dialog: boolean) {
    if (dialog) {
      this.description = this.cv.description;
    }
  }

  private async onSave() {
    const patchCVDto: PatchCVDto = {
      id: this.cv.id,
      data: {
        description: this.description
      }
    };

    await this.patchCV(patchCVDto);

    this.dialog = false;
  }

  private async onCancel() {
    this.dialog = false;
  }
}
</script>
