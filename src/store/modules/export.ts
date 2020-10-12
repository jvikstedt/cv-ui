import {
  VuexModule,
  Module,
  Mutation,
  Action,
  getModule,
} from "vuex-module-decorators";
import Vue from "vue";
import Api from "@/api/api";
import { Skill } from "@/store/modules/skill";
import store from "@/store";

export class ExportPdfDto {
  bodyTemplate? = "";

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any = {};

  scale? = 1;

  displayHeaderFooter? = false;

  headerTemplate? = "";

  footerTemplate? = "";

  printBackground? = false;

  landscape? = false;

  pageRanges? = "";

  format? = "Letter";

  width? = "";

  height? = "";

  marginTop? = "0px";

  marginRight? = "0px";

  marginBottom? = "0px";

  marginLeft? = "0px";

  preferCSSPageSize? = false;
}

export class ExportDocxDto {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any = {};

  fileId!: string;
}

export interface TemplateDto {
  id?: number;

  name: string;

  exporter?: string;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
}

export class Template {
  id!: number;

  name!: string;

  exporter!: string;

  userId!: number;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data!: any;

  createdAt!: Date;

  updatedAt!: Date;
}

export class PatchTemplateDtoData {
  name!: string;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data!: any;
}

export class PatchTemplateDto {
  id!: number;
  data!: PatchTemplateDtoData;
}

export class CreateTemplateDto {
  name!: string;

  exporter!: string;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data!: any;
}

export class File {
  id!: string;

  originalname!: string;

  encoding!: string;

  mimetype!: string;

  destination!: string;

  filename!: string;

  path!: string;

  size!: number;

  createdAt!: string;

  updatedAt!: string;
}

@Module({
  dynamic: true,
  namespaced: true,
  name: "export",
  store,
})
class ExportModule extends VuexModule {
  public fetching = false;
  public templates: { [key: number]: Template } = {};
  public selectedTemplate: Template | null = null;
  public pdf: string | null = null;
  public docx: string | null = null;

  get getTemplates(): Template[] {
    return Object.values(this.templates);
  }

  @Mutation
  public setSelectedTemplate(template: Template): void {
    this.selectedTemplate = template;
  }

  @Mutation
  public setPDF(pdf: string): void {
    this.pdf = pdf;
  }

  @Mutation
  public setDocx(docx: string): void {
    this.docx = docx;
  }

  @Mutation
  public addTemplates(templates: Template[]): void {
    for (const template of templates) {
      Vue.set(this.templates, template.id, template);
    }
  }

  @Mutation
  public setFetching(fetching: boolean): void {
    this.fetching = fetching;
  }

  @Action
  public async fetchTemplates(): Promise<void> {
    const templates: Template[] = await Api.get("/templates");

    this.context.commit("addTemplates", templates);
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
    this.context.commit("setSelectedTemplate", savedTemplate);
  }

  @Action
  public async patchTemplate({ id, data }: PatchTemplateDto): Promise<void> {
    const savedTemplate: Template = await Api.patch(`/templates/${id}`, {
      data,
    });
    this.context.commit("addTemplates", [savedTemplate]);
    this.context.commit("setSelectedTemplate", savedTemplate);
  }

  @Action
  public async exportPDF(exportPdfDto: ExportPdfDto): Promise<void> {
    this.context.commit("setFetching", true);
    const pdf = await Api.post("/exporters/pdf/export", exportPdfDto, {
      responseType: "arraybuffer",
      headers: {
        Accept: "application/pdf",
      },
    });

    const blob = new Blob([pdf], { type: "application/pdf" });
    const pdfUrl = window.URL.createObjectURL(blob);

    this.context.commit("setPDF", pdfUrl);
    this.context.commit("setFetching", false);
  }

  @Action
  public async exportDocx(exportDocxDto: ExportDocxDto): Promise<void> {
    this.context.commit("setFetching", true);
    const response = await Api.post("/exporters/docx/export", exportDocxDto, {
      responseType: "arraybuffer",
      headers: {
        Accept:
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      },
    });

    const blob = new Blob([response], {
      type:
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });
    const docxURL = window.URL.createObjectURL(blob);

    this.context.commit("setDocx", docxURL);
    this.context.commit("setFetching", false);
  }
}

export default getModule(ExportModule);
