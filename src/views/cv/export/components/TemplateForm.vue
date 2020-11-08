<template>
  <v-form v-model="valid">
    <v-text-field name="name" v-model="template.name" label="Name"></v-text-field>

    <v-select
      v-model="template.exporter"
      name="exporter"
      :items="['pdf', 'docx']"
      label="Exporter"
    ></v-select>

    <template v-if="template.exporter === 'docx'">
      <p v-if="template.data.fileId">
        Current file: {{ template.data.fileName }} ({{
          template.data.fileCreatedAt
        }})
      </p>
      <v-file-input
        label="File input"
        name="file"
        accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        placeholder="Insert .docx -file"
        @change="onFileChange"
      />
    </template>

    <template v-if="template.exporter === 'pdf'">
      <v-textarea
        outlined
        v-model="template.data.bodyTemplate"
        name="bodyTemplate"
        label="Body template"
        required
      ></v-textarea>

      <v-card-text>
        <v-slider
          v-model="template.data.scale"
          :step="0.1"
          label="scale"
          class="align-center"
          :max="2"
          :min="0.1"
          hide-details
        >
          <template v-slot:append>
            <v-text-field
              name="scale"
              v-model="template.data.scale"
              class="mt-0 pt-0"
              hide-details
              single-line
              :max="2"
              :min="0.1"
              type="number"
              style="width: 60px"
            ></v-text-field>
          </template>
        </v-slider>
      </v-card-text>

      <v-checkbox
        name="displayHeaderFooter"
        v-model="template.data.displayHeaderFooter"
        label="Display header & footer"
      ></v-checkbox>

      <v-textarea
        v-if="template.data.displayHeaderFooter"
        outlined
        name="headerTemplate"
        v-model="template.data.headerTemplate"
        label="Header template"
        required
      ></v-textarea>

      <v-textarea
        v-if="template.data.displayHeaderFooter"
        outlined
        name="footerTemplate"
        v-model="template.data.footerTemplate"
        label="Footer template"
        required
      ></v-textarea>

      <v-checkbox
        name="printBackground"
        v-model="template.data.printBackground"
        label="Print background"
      ></v-checkbox>

      <v-checkbox
        name="landscape"
        v-model="template.data.landscape"
        label="Landscape"
      ></v-checkbox>

      <v-text-field
        name="pageRanges"
        v-model="template.data.pageRanges"
        label="Page ranges"
      ></v-text-field>

      <v-select
        name="format"
        v-model="template.data.format"
        :items="allowedFormats"
        label="Format"
      ></v-select>

      <v-text-field
        v-if="!template.data.format"
        name="width"
        v-model="template.data.width"
        label="Width"
      ></v-text-field>

      <v-text-field
        v-if="!template.data.format"
        name="height"
        v-model="template.data.height"
        label="Height"
      ></v-text-field>

      <v-text-field
        name="marginTop"
        v-model="template.data.marginTop"
        label="Margin top"
      ></v-text-field>
      <v-text-field
        name="marginRight"
        v-model="template.data.marginRight"
        label="Margin right"
      ></v-text-field>
      <v-text-field
        name="marginBottom"
        v-model="template.data.marginBottom"
        label="Margin bottom"
      ></v-text-field>
      <v-text-field
        name="marginLeft"
        v-model="template.data.marginLeft"
        label="Margin left"
      ></v-text-field>

      <v-checkbox
        name="preferCSSPageSize"
        v-model="template.data.preferCSSPageSize"
        label="Prefer CSS page size"
      ></v-checkbox>
    </template>
  </v-form>
</template>

<script lang="ts">
import * as R from "ramda";
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { Template } from "@/store/modules/export";
import { CreateFile } from "@/api/file";

@Component
export default class TemplateForm extends Vue {
  @Prop({ required: true }) readonly initialTemplate!: Template;

  readonly allowedFormats = [
    "",
    "Letter",
    "Legal",
    "Tabloid",
    "Ledger",
    "A0",
    "A1",
    "A2",
    "A3",
    "A4",
    "A5",
    "A6",
  ];

  valid = false;
  template: Template = R.clone(this.initialTemplate);

  @Watch("template", {
    deep: true,
  })
  templateChanged(template: Template): void {
    this.$emit("change", template);
  }

  async onFileChange(file: File): Promise<void> {
    if (file) {
      const createdFile = await CreateFile({ file });
      this.template = {
        ...this.template,
        data: {
          ...this.template.data,
          fileId: createdFile.id,
          fileName: createdFile.originalname,
          fileCreatedAt: createdFile.createdAt,
        },
      };
    }
  }
}
</script>
