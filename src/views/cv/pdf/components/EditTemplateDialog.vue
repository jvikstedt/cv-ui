<template>
  <v-dialog v-model="dialog" max-width="600" persistent>
    <v-card>
      <v-card-title class="headline">
        Template
      </v-card-title>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn color="red darken-1" text @click="onSave">
          Save
        </v-btn>

        <v-btn color="blue darken-1" text @click="onCancel">
          Cancel
        </v-btn>

        <v-btn color="green darken-1" text @click="onUse">
          Use
        </v-btn>
      </v-card-actions>

      <v-card-text>
        <v-select
          v-model="template"
          :items="templates"
          label="Template"
          item-text="name"
          return-object
        >
          <template v-slot:append-outer>
            <v-btn @click="createTemplate">
              New
            </v-btn>
          </template>
        </v-select>

        <TemplatePdfForm
          :key="template.id"
          v-if="template"
          :initialTemplate="template"
          @change="onChange"
        />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import * as R from "ramda";
import { Component, Vue, Prop } from "vue-property-decorator";
import Template from "@/store/Template";
import TemplatePdfForm from "./TemplatePdfForm.vue";
import { ExportPdfDto } from "@/api/exporter";
import { GetTemplates, CreateTemplate, UpdateTemplate } from "@/api/template";

@Component({
  components: {
    TemplatePdfForm
  }
})
export default class EditTemplateDialog extends Vue {
  @Prop({ required: false }) readonly initialTemplate!: Template;
  @Prop({ required: true }) readonly dialog!: boolean;
  @Prop({ required: true }) readonly setDialog!: (dialog: boolean) => void;

  private template: Template | null = null;

  get templates(): Template[] {
    return Template.all();
  }

  private async created(): Promise<void> {
    if (this.initialTemplate) {
      this.template = R.clone(this.initialTemplate);
    }
    await GetTemplates();
  }

  private async onChange(template: Template): Promise<void> {
    this.template = template;
  }

  private async onSave() {
    if (this.template && !this.template.id) {
      this.template = await CreateTemplate({
        name: this.template.name,
        exporter: this.template.exporter,
        data: this.template.data
      });
    } else if (this.template) {
      this.template = await UpdateTemplate(this.template.id, {
        name: this.template.name,
        data: this.template.data
      });
    }
  }

  private async onUse() {
    this.$emit("use", this.template);

    this.setDialog(false);
  }

  private async onCancel() {
    this.setDialog(false);
  }

  private async createTemplate() {
    this.template = R.merge(new Template(), {
      name: "",
      exporter: "pdf",
      data: new ExportPdfDto()
    });
  }
}
</script>
