<template>
  <v-form v-model="valid">
    <v-textarea
      outlined
      v-model="exportPdfDto.content"
      label="Content"
      required
    ></v-textarea>

    <v-card-text>
      <v-slider
        v-model="exportPdfDto.scale"
        :step="0.1"
        label="scale"
        class="align-center"
        :max="2"
        :min="0.1"
        hide-details
      >
        <template v-slot:append>
          <v-text-field
            v-model="exportPdfDto.scale"
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
      v-model="exportPdfDto.displayHeaderFooter"
      label="Display header & footer"
    ></v-checkbox>

    <v-textarea
      v-if="exportPdfDto.displayHeaderFooter"
      outlined
      v-model="exportPdfDto.headerTemplate"
      label="Header template"
      required
    ></v-textarea>

    <v-textarea
      v-if="exportPdfDto.displayHeaderFooter"
      outlined
      v-model="exportPdfDto.footerTemplate"
      label="Footer template"
      required
    ></v-textarea>

    <v-checkbox
      v-model="exportPdfDto.printBackground"
      label="Print background"
    ></v-checkbox>

    <v-checkbox v-model="exportPdfDto.landscape" label="Landscape"></v-checkbox>

    <v-text-field
      v-model="exportPdfDto.pageRanges"
      label="Page ranges"
    ></v-text-field>

    <v-select
      v-model="exportPdfDto.format"
      :items="allowedFormats"
      label="Format"
    ></v-select>

    <v-text-field
      v-if="!exportPdfDto.format"
      v-model="exportPdfDto.width"
      label="Width"
    ></v-text-field>

    <v-text-field
      v-if="!exportPdfDto.format"
      v-model="exportPdfDto.height"
      label="Height"
    ></v-text-field>

    <v-text-field
      v-model="exportPdfDto.marginTop"
      label="Margin top"
    ></v-text-field>
    <v-text-field
      v-model="exportPdfDto.marginRight"
      label="Margin right"
    ></v-text-field>
    <v-text-field
      v-model="exportPdfDto.marginBottom"
      label="Margin bottom"
    ></v-text-field>
    <v-text-field
      v-model="exportPdfDto.marginLeft"
      label="Margin left"
    ></v-text-field>

    <v-checkbox
      v-model="exportPdfDto.preferCSSPageSize"
      label="Prefer CSS page size"
    ></v-checkbox>
  </v-form>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { ExportPdfDto } from "@/api/exporter";

@Component
export default class TemplatePdfForm extends Vue {
  @Prop({
    type: Object
  })
  readonly initialExportPdfDto!: ExportPdfDto;

  private readonly allowedFormats = [
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
    "A6"
  ];

  private valid = false;
  private exportPdfDto: ExportPdfDto = {
    ...this.initialExportPdfDto
  };

  @Watch("exportPdfDto", {
    deep: true
  })
  async exportPdfDtoChanged(exportPdfDto: ExportPdfDto) {
    this.$emit("change", this.valid, exportPdfDto);
  }
}
</script>
