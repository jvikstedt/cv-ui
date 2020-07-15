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
          :rules="descriptionRules"
        />
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn color="green darken-1" text @click="onCancel">
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
import { Component, Vue, Prop } from "vue-property-decorator";
import { namespace } from "vuex-class";
import { CV, PatchCVDto } from "@/model/cv";
import { VForm } from "@/types";

const CVShowStore = namespace("CVShowStore");
const DialogStore = namespace("DialogStore");

@Component
export default class EditCVDetailsDialog extends Vue {
  @Prop({ required: true }) readonly id!: number;

  @CVShowStore.Getter
  getCV!: (id: number) => CV;

  @CVShowStore.Action
  patchCV!: (patchCVDto: PatchCVDto) => Promise<void>;

  @DialogStore.Mutation
  popDialogComponent!: () => void;

  valid = false;
  description = "";
  descriptionRules = [(v: string) => !!v || "Description is required"];

  get cv(): CV {
    return this.getCV(this.id);
  }

  get form(): VForm {
    return this.$refs.form as VForm;
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

  async onCancel() {
    this.popDialogComponent();
  }
}
</script>
