import { VuexModule, Module, Mutation, Action } from "vuex-module-decorators";
import Vue from "vue";
import Api from "@/api/api";
import { Skill } from "@/model/skill";
import { CV, CVExportData } from "@/model/cv";
import { ExportPdfDto } from "@/model/exporter";
import {
  Template,
  PatchTemplateDto,
  CreateTemplateDto
} from "@/model/template";

@Module({ namespaced: true })
export class CVPDFStore extends VuexModule {
  public cvData: CVExportData = new CVExportData();
  public fetching = false;
  public blob: Blob | null = null;
  public templates: { [key: number]: Template } = {};
  public selectedTemplate: Template | null = null;

  get getTemplates(): Template[] {
    return Object.values(this.templates);
  }

  @Mutation
  public setCVData(cvData: CVExportData): void {
    this.cvData = cvData;
  }

  @Mutation
  public setFetching(fetching: boolean): void {
    this.fetching = fetching;
  }

  @Mutation
  public setBlob(blob: Blob): void {
    this.blob = blob;
  }

  @Mutation
  public setSelectedTemplate(template: Template): void {
    this.selectedTemplate = template;
  }

  @Mutation
  public addTemplates(templates: Template[]): void {
    for (const template of templates) {
      Vue.set(this.templates, template.id, template);
    }
  }

  @Action
  public async fetchCV(id: number): Promise<void> {
    this.context.commit("setFetching", true);

    const cv: CV = await Api.get(`/cv/${id}`);
    const skills: Skill[] = await Api.get(`/cv/${id}/skills`);

    const cvData: CVExportData = {
      ...cv,
      skills
    };

    this.context.commit("setCVData", cvData);

    this.context.commit("setFetching", false);
  }

  @Action
  public async setCVDataAction(cvData: CVExportData): Promise<void> {
    this.context.commit("setCVData", cvData);
  }

  @Action
  public async exportPDF(exportPdfDto: ExportPdfDto): Promise<void> {
    const pdf = await Api.post("/exporters/pdf/export", exportPdfDto, {
      responseType: "arraybuffer",
      headers: {
        Accept: "application/pdf"
      }
    });

    const blob = new Blob([pdf], { type: "application/pdf" });

    this.context.commit("setBlob", blob);
  }

  @Action
  public async fetchTemplates(): Promise<void> {
    const templates: Template[] = await Api.get("/templates");

    this.context.commit("addTemplates", templates);
  }

  @Action
  public async patchTemplate({ id, data }: PatchTemplateDto): Promise<void> {
    const savedTemplate: Template = await Api.patch(`/templates/${id}`, data);
    this.context.commit("addTemplates", [savedTemplate]);
  }

  @Action
  public async createTemplate(
    createTemplateDto: CreateTemplateDto
  ): Promise<void> {
    const savedTemplate: Skill = await Api.post(
      "/templates",
      createTemplateDto
    );
    this.context.commit("addTemplates", [savedTemplate]);
  }

  @Action
  public async setSelectedTemplateAction(template: Template): Promise<void> {
    this.context.commit("setSelectedTemplate", template);
  }
}
