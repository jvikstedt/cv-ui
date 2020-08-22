<template>
  <v-card>
    <v-card-title class="headline">
      Edit CV
    </v-card-title>

    <v-form ref="form" v-model="valid" lazy-validation @submit.prevent="onSave">
      <v-card-text>
        <v-textarea
          name="description"
          v-model="description"
          label="Description"
        />
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn color="red darken-1" text @click="onCancel">
          Cancel
        </v-btn>

        <v-btn color="green darken-1" text type="submit">
          Save
        </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Mixins } from "vue-property-decorator";
import { namespace } from "vuex-class";
import { CV, PatchCVDto } from "@/model/cv";
import { DialogFormMixin } from "@/mixins";

const CVShowStore = namespace("CVShowStore");

@Component
export default class EditCVDetailsDialog extends Mixins(DialogFormMixin) {
  @Prop({ required: true }) readonly id!: number;

  @CVShowStore.Getter
  getCV!: (id: number) => CV;

  @CVShowStore.Action
  patchCV!: (patchCVDto: PatchCVDto) => Promise<void>;

  description = "";

  get cv(): CV {
    return this.getCV(this.id);
  }

  created() {
    this.description = this.cv.description;
  }

  async onSave() {
    if (this.form.validate()) {
      const patchCVDto: PatchCVDto = {
        id: this.cv.id,
        data: {
          description: this.description
        }
      };

      await this.patchCV(patchCVDto);

      this.popDialogComponent();
    }
  }
}
</script>
