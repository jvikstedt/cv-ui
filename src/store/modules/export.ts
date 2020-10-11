import * as R from "ramda";
import {
  VuexModule,
  Module,
  Mutation,
  Action,
  getModule,
} from "vuex-module-decorators";
import { DateTime } from "luxon";
import Vue from "vue";
import Api from "@/api/api";
import { Skill } from "@/store/modules/skill";
import { ExportData } from "@/views/cv/export/types";
import store from "@/store";
import { MembershipSkill } from "./membership_skill";

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

const calculateTotalSkillExperience = (
  skill: Skill,
  membershipSkills: MembershipSkill[]
): number => {
  const experience = R.reduce(
    (sum: number, membershipSkill) => {
      const projectMembership = membershipSkill.projectMembership;
      if (!projectMembership) {
        return sum;
      }

      if (!membershipSkill.automaticCalculation) {
        return sum + membershipSkill.experienceInYears;
      }

      const diff = (DateTime.utc(
        projectMembership.endYear || DateTime.utc().year,
        projectMembership.endMonth || DateTime.utc().month
      ).diff(
        DateTime.utc(projectMembership.startYear, projectMembership.startMonth),
        ["years"]
      ) as unknown) as any; // eslint-disable-line @typescript-eslint/no-explicit-any

      if (R.isNil(diff["values"]) || R.isNil(diff["values"].years)) {
        return sum;
      }

      return sum + diff["values"].years;
    },
    0,
    membershipSkills
  );

  const projectExperience = Math.round(experience * 100) / 100;

  const totalExperience =
    Math.round((projectExperience + skill.experienceInYears) * 100) / 100;

  return totalExperience;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const buildCVExportData = (responses: any[]): ExportData => {
  const [
    cv,
    skills,
    educations,
    workExperiences,
    projectMemberships,
  ] = responses;

  const allMembershipSkills = R.flatten(
    R.map((m) => m.membershipSkills, projectMemberships)
  );
  const calculatedSkills = R.map((skill) => {
    let membershipSkills = R.filter(
      (m) => R.equals(m.skillId, skill.id),
      allMembershipSkills
    );

    membershipSkills = R.map((m) => {
      const projectMembership = R.find(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (p: any) => R.equals(p.id, m.projectMembershipId),
        projectMemberships
      );

      return {
        ...m,
        projectMembership,
      };
    }, membershipSkills);

    return {
      ...skill,
      experienceInYears: calculateTotalSkillExperience(skill, membershipSkills),
    };
  }, skills);

  return {
    user: {
      cvId: cv.id,
      description: cv.description,
      updatedAt: cv.updatedAt,
      userId: cv.userId,
      username: cv.user.username,
      avatarId: cv.user.avatarId,
      firstName: cv.user.firstName,
      lastName: cv.user.lastName,
      jobTitle: cv.user.jobTitle,
      phone: cv.user.phone,
      location: cv.user.location,
      workExperienceInYears: cv.user.workExperienceInYears,
      email: cv.user.email,
    },
    skills: R.map(
      (skill) => ({
        id: skill.id,
        experienceInYears: skill.experienceInYears,
        interestLevel: skill.interestLevel,
        skillSubjectId: skill.skillSubject.id,
        name: skill.skillSubject.name,
        skillGroupId: skill.skillSubject.skillGroup.id,
        skillGroupName: skill.skillSubject.skillGroup.name,
        highlight: skill.highlight,
        disabled: false,
      }),
      calculatedSkills
    ),
    educations: R.map(
      (education) => ({
        schoolId: education.school.id,
        schoolName: education.school.name,
        startYear: education.startYear,
        endYear: education.endYear,
        degree: education.degree,
        fieldOfStudy: education.fieldOfStudy,
        description: education.description,
        highlight: education.highlight,
        disabled: false,
      }),
      educations
    ),
    jobs: R.map(
      (workExperience) => ({
        companyId: workExperience.company.id,
        companyName: workExperience.company.name,
        startYear: workExperience.startYear,
        startMonth: workExperience.startMonth,
        endYear: workExperience.endYear,
        endMonth: workExperience.endMonth,
        description: workExperience.description,
        jobTitle: workExperience.jobTitle,
        disabled: false,
      }),
      workExperiences
    ),
    projects: R.map(
      (projectMembership) => ({
        projectId: projectMembership.project.id,
        projectName: projectMembership.project.name,
        companyId: projectMembership.project.company.id,
        companyName: projectMembership.project.company.name,
        startYear: projectMembership.startYear,
        startMonth: projectMembership.startMonth,
        endYear: projectMembership.endYear,
        endMonth: projectMembership.endMonth,
        description: projectMembership.description,
        highlight: projectMembership.highlight,
        disabled: false,
      }),
      projectMemberships
    ),
  };
};

@Module({
  dynamic: true,
  namespaced: true,
  name: "export",
  store,
})
class ExportModule extends VuexModule {
  public fetching = false;
  public exportData: ExportData | null = null;
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

  @Mutation
  public setCVExportData(exportData: ExportData): void {
    this.exportData = exportData;
  }

  @Action
  public async fetchCV(id: number): Promise<void> {
    this.context.commit("setFetching", true);

    await Promise.all([
      Api.get(`/cv/${id}`),
      Api.get(`/cv/${id}/skills`),
      Api.get(`/cv/${id}/educations`),
      Api.get(`/cv/${id}/work_experience`),
      Api.get(`/cv/${id}/project_membership`),
    ]).then((responses) => {
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
