<template>
  <v-card>
    <v-card-title class="headline"> Edit CV </v-card-title>

    <v-form ref="form" v-model="valid" lazy-validation @submit.prevent="onSave">
      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn color="red darken-1" text @click="onCancel"> Cancel </v-btn>

        <v-btn color="green darken-1" text type="submit"> Save </v-btn>
      </v-card-actions>
      <v-card-text>
        <v-textarea
          name="description"
          v-model="description"
          label="Description"
        />
      </v-card-text>
    </v-form>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Mixins } from "vue-property-decorator";
import { DialogFormMixin } from "@/mixins";
import { CV } from "@/store/modules/cv";
import { ServiceManager, CVService } from "@/services";

@Component
export default class EditCVDetailsDialog extends Mixins(DialogFormMixin) {
  @Prop({ required: true }) readonly cv!: CV;

  description = "";

  created(): void {
    this.description = this.cv.description;
  }

  async onSave(): Promise<void> {
    if (this.form.validate()) {
      const patchCVDto: CVService.PatchCVDto = {
        id: this.cv.id,
        data: {
          description: this.description,
        },
      };

      await ServiceManager.cv.patchCV(patchCVDto);

      this.popDialogComponent();
    }
  }
}
</script>
