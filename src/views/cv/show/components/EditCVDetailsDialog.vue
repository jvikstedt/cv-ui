<template>
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
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { namespace } from "vuex-class";
import { CV, PatchCVDto } from "@/model/cv";

const CVShowStore = namespace("CVShowStore");
const DialogStore = namespace("DialogStore");

@Component
export default class EditCVDetailsDialog extends Vue {
  @Prop({ required: true }) readonly id!: number;

  @CVShowStore.Getter
  public getCV!: (id: number) => CV;

  @CVShowStore.Action
  public patchCV!: (patchCVDto: PatchCVDto) => Promise<void>;

  @DialogStore.Action
  public hideDialogAction!: () => void;

  private description = "";

  get cv(): CV {
    return this.getCV(this.id);
  }

  private created() {
    this.description = this.cv.description;
  }

  private async onSave() {
    const patchCVDto: PatchCVDto = {
      id: this.cv.id,
      data: {
        description: this.description
      }
    };

    await this.patchCV(patchCVDto);

    this.hideDialogAction();
  }

  private async onCancel() {
    this.hideDialogAction();
  }
}
</script>
