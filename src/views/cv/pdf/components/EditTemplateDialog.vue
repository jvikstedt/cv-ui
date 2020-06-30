<template>
  <v-dialog
    v-model="dialog"
    max-width="500"
    v-if="template"
    v-on:click:outside="onCancel"
  >
    <v-card>
      <v-card-title class="headline">
        Template
      </v-card-title>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn color="green darken-1" text @click="onCancel">
          Cancel
        </v-btn>

        <v-btn color="green darken-1" text @click="onSave">
          Save
        </v-btn>
      </v-card-actions>

      <v-card-text>
        <TemplatePdfForm
          :initialExportPdfDto="template.data"
          @change="onChange"
        />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import Template from "@/store/Template";
import TemplatePdfForm from "./TemplatePdfForm.vue";
import { ExportPdfDto } from "@/api/exporter";

@Component({
  components: {
    TemplatePdfForm
  }
})
export default class EditTemplateDialog extends Vue {
  @Prop({ required: true }) readonly template!: Template | null;
  @Prop({ required: true }) readonly dialog!: boolean;
  @Prop({ required: true }) readonly setDialog!: (dialog: boolean) => void;

  private exportPdfDto?: ExportPdfDto;
  private valid = false;

  private async onChange(
    valid: boolean,
    exportPdfDto: ExportPdfDto
  ): Promise<void> {
    this.valid = valid;
    this.exportPdfDto = exportPdfDto;
  }

  private async onSave() {
    if (this.valid) {
      this.$emit("save", this.exportPdfDto);
    }

    this.setDialog(false);
  }

  private async onCancel() {
    this.setDialog(false);
  }
}
</script>
