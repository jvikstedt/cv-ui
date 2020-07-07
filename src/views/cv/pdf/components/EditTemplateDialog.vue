<template>
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
</template>

<script lang="ts">
import * as R from "ramda";
import { Component, Vue, Prop } from "vue-property-decorator";
import { namespace } from "vuex-class";
import { Template } from "@/model/template";
import TemplatePdfForm from "./TemplatePdfForm.vue";
import { ExportPdfDto } from "@/model/exporter";
import { CreateTemplate, UpdateTemplate } from "@/api/template";

const DialogStore = namespace("DialogStore");

@Component({
  components: {
    TemplatePdfForm
  }
})
export default class EditTemplateDialog extends Vue {
  @Prop({ required: false }) readonly initialTemplate!: Template;
  @Prop({ required: true }) readonly templates!: Template[];
  @Prop({ required: true }) readonly use!: (
    template: Template
  ) => Promise<void>;

  private template: Template | null = null;

  @DialogStore.Action
  public hideDialogAction!: () => void;

  private async created(): Promise<void> {
    if (this.initialTemplate) {
      this.template = R.clone(this.initialTemplate);
    }
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
    if (this.template) {
      await this.use(this.template);
    }
    this.hideDialogAction();
  }

  private async onCancel() {
    this.hideDialogAction();
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
