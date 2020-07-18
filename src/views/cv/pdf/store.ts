import * as R from "ramda";
import { VuexModule, Module, Mutation, Action } from "vuex-module-decorators";
import Vue from "vue";
import Api from "@/api/api";
import {
  Template,
  CreateTemplateDto,
  PatchTemplateDto
} from "@/model/template";
import { CVExportData } from "@/model/cv";
import { Skill } from "@/model/skill";
import { ExportPdfDto } from "@/model/exporter";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const buildCVExportData = (responses: any[]): any => {
  const [
    cv,
    skills,
    educations,
    workExperiences,
    projectMemberships
  ] = responses;

  return {
    id: cv.id,
    description: cv.description,
    updatedAt: cv.updatedAt,
    userId: cv.userId,
    username: cv.user.username,
    avatarId: cv.user.avatarId,
    fullName: `${cv.user.firstName} ${cv.user.lastName}`,
    jobTitle: cv.user.jobTitle,
    phone: cv.user.phone,
    location: cv.user.location,
    email: cv.user.email,
    skills: R.map(
      skill => ({
        experienceInYears: skill.experienceInYears,
        skillSubjectId: skill.skillSubject.id,
        name: skill.skillSubject.name
      }),
      skills
    ),
    educations: R.map(
      education => ({
        schoolId: education.school.id,
        schoolName: education.school.name,
        startYear: education.startYear,
        endYear: education.endYear,
        degree: education.degree,
        fieldOfStudy: education.fieldOfStudy,
        description: education.description
      }),
      educations
    ),
    workExperiences: R.map(
      workExperience => ({
        companyId: workExperience.company.id,
        companyName: workExperience.company.name,
        startYear: workExperience.startYear,
        startMonth: workExperience.startMonth,
        endYear: workExperience.endYear,
        endMonth: workExperience.endMonth,
        description: workExperience.description,
        jobTitle: workExperience.jobTitle
      }),
      workExperiences
    ),
    projectMemberships: R.map(
      projectMembership => ({
        projectId: projectMembership.project.id,
        projectName: projectMembership.project.name,
        companyId: projectMembership.project.company.id,
        companyName: projectMembership.project.company.name,
        startYear: projectMembership.startYear,
        startMonth: projectMembership.startMonth,
        endYear: projectMembership.endYear,
        endMonth: projectMembership.endMonth,
        description: projectMembership.description
      }),
      projectMemberships
    )
  };
};

@Module({ namespaced: true })
export class CVPDFStore extends VuexModule {
  public fetching = false;
  public cvExportData: CVExportData | null = null;
  public templates: { [key: number]: Template } = {};
  public selectedTemplate: Template | null = null;
  public pdf: string | null = null;

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
  public addTemplates(templates: Template[]): void {
    for (const template of templates) {
      Vue.set(this.templates, template.id, template);
    }
  }

  @Mutation
  public setFetching(fetching: boolean): void {
    this.fetching = fetching;
  }

  @Mutation
  public setCVExportData(cvExportData: CVExportData): void {
    this.cvExportData = cvExportData;
  }

  @Action
  public async fetchCV(id: number): Promise<void> {
    this.context.commit("setFetching", true);

    await Promise.all([
      Api.get(`/cv/${id}`),
      Api.get(`/cv/${id}/skills`),
      Api.get(`/cv/${id}/educations`),
      Api.get(`/cv/${id}/work_experience`),
      Api.get(`/cv/${id}/project_membership`)
    ]).then(responses => {
      this.context.commit("setCVExportData", buildCVExportData(responses));
    });

    this.context.commit("setFetching", false);
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
      data
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
        Accept: "application/pdf"
      }
    });

    const blob = new Blob([pdf], { type: "application/pdf" });
    const pdfUrl = window.URL.createObjectURL(blob);

    this.context.commit("setPDF", pdfUrl);
    this.context.commit("setFetching", false);
  }
}
