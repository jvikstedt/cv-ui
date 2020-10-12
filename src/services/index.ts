import * as SkillService from "./skill";
import * as ProjectMembershipService from "./project_membership";
import * as EducationService from "./education";
import * as WorkExperienceService from "./work_experience";
import * as CVService from "./cv";
import * as UserService from "./user";
import * as SchoolService from "./school";
import * as CompanyService from "./company";
import * as SkillSubjectService from "./skill_subject";
import * as SkillGroupService from "./skill_group";
import * as ProjectService from "./project";

class Manager {
  private isPlayground: boolean;

  constructor() {
    this.isPlayground = false;
  }

  get skill(): SkillService.Service {
    return this.isPlayground ? SkillService.Playground : SkillService.Api;
  }

  get projectMembership(): ProjectMembershipService.Service {
    return this.isPlayground
      ? ProjectMembershipService.Playground
      : ProjectMembershipService.Api;
  }

  get education(): EducationService.Service {
    return this.isPlayground
      ? EducationService.Playground
      : EducationService.Api;
  }

  get workExperience(): WorkExperienceService.Service {
    return this.isPlayground
      ? WorkExperienceService.Playground
      : WorkExperienceService.Api;
  }

  get cv(): CVService.Service {
    return this.isPlayground ? CVService.Playground : CVService.Api;
  }

  get user(): UserService.Service {
    return this.isPlayground ? UserService.Playground : UserService.Api;
  }

  get school(): SchoolService.Service {
    return this.isPlayground ? SchoolService.Playground : SchoolService.Api;
  }

  get company(): CompanyService.Service {
    return this.isPlayground ? CompanyService.Playground : CompanyService.Api;
  }

  get skillSubject(): SkillSubjectService.Service {
    return this.isPlayground
      ? SkillSubjectService.Playground
      : SkillSubjectService.Api;
  }

  get skillGroup(): SkillGroupService.Service {
    return this.isPlayground
      ? SkillGroupService.Playground
      : SkillGroupService.Api;
  }

  get project(): ProjectService.Service {
    return this.isPlayground ? ProjectService.Playground : ProjectService.Api;
  }

  setIsPlayground(isPlayground: boolean) {
    this.isPlayground = isPlayground;
  }
}

const ServiceManager = new Manager();
export {
  ServiceManager,
  SkillService,
  ProjectMembershipService,
  EducationService,
  WorkExperienceService,
  CVService,
  UserService,
  SchoolService,
  CompanyService,
  SkillSubjectService,
  SkillGroupService,
  ProjectService,
};
