import * as R from "ramda";
import Vue from "vue";
import { VuexModule, Module, Mutation, Action } from "vuex-module-decorators";
import Api from "@/api/api";
import {
  Skill,
  PatchSkillDto,
  DeleteSkillDto,
  CreateSkillDto
} from "@/model/skill";
import {
  Education,
  PatchEducationDto,
  DeleteEducationDto,
  CreateEducationDto
} from "@/model/education";
import { CV, PatchCVDto } from "@/model/cv";
import { User, PatchUserDto } from "@/model/user";
import {
  WorkExperience,
  PatchWorkExperienceDto,
  CreateWorkExperienceDto,
  DeleteWorkExperienceDto
} from "@/model/work_experience";
import {
  ProjectMembership,
  PatchProjectMembershipDto,
  CreateProjectMembershipDto,
  DeleteProjectMembershipDto
} from "@/model/project_membership";

@Module({ namespaced: true })
export class CVShowStore extends VuexModule {
  public cvs: { [key: number]: CV } = {};
  public skills: { [key: number]: Skill } = {};
  public educations: { [key: number]: Education } = {};
  public workExperiences: { [key: number]: WorkExperience } = {};
  public projectMemberships: { [key: number]: ProjectMembership } = {};
  public fetching = false;

  get getCV() {
    return (id: number): CV => this.cvs[id];
  }

  get getSkill() {
    return (id: number): Skill => this.skills[id];
  }

  get getCVSkills() {
    return (id: number): Skill[] =>
      R.filter(
        (skill: Skill) => R.equals(skill.cvId, id),
        Object.values(this.skills)
      );
  }

  get getCVHighlightedSkills() {
    return (id: number): Skill[] =>
      R.filter(
        (skill: Skill) => R.equals(skill.cvId, id) && skill.highlight,
        Object.values(this.skills)
      );
  }

  get getCVSkillsGrouped() {
    return (id: number): { [key: string]: Skill[] } =>
      R.groupBy(
        (skill: Skill) => skill.skillSubject.skillGroup.name,
        this.getCVSkills(id)
      );
  }

  get getEducation() {
    return (id: number): Education => this.educations[id];
  }

  get getCVEducations() {
    return (id: number): Education[] =>
      R.filter(
        (education: Education) => R.equals(education.cvId, id),
        Object.values(this.educations)
      );
  }

  get getWorkExperience() {
    return (id: number): WorkExperience => this.workExperiences[id];
  }

  get getCVWorkExperiences() {
    return (id: number): WorkExperience[] =>
      R.filter(
        (workExperience: WorkExperience) => R.equals(workExperience.cvId, id),
        Object.values(this.workExperiences)
      );
  }

  get getProjectMembership() {
    return (id: number): ProjectMembership => this.projectMemberships[id];
  }

  get getCVProjectMemberships() {
    return (id: number): ProjectMembership[] =>
      R.filter(
        (projectMembership: ProjectMembership) =>
          R.equals(projectMembership.cvId, id),
        Object.values(this.projectMemberships)
      );
  }

  @Mutation
  public addCV(cv: CV): void {
    Vue.set(this.cvs, cv.id, cv);
  }

  @Mutation
  public deleteSkills(ids: number[]): void {
    for (const id of ids) {
      Vue.delete(this.skills, id);
    }
  }

  @Mutation
  public addSkills(skills: Skill[]): void {
    for (const skill of skills) {
      Vue.set(this.skills, skill.id, skill);
    }
  }

  @Mutation
  public deleteEducations(ids: number[]): void {
    for (const id of ids) {
      Vue.delete(this.educations, id);
    }
  }

  @Mutation
  public addEducations(educations: Education[]): void {
    for (const education of educations) {
      Vue.set(this.educations, education.id, education);
    }
  }

  @Mutation
  public deleteWorkExperiences(ids: number[]): void {
    for (const id of ids) {
      Vue.delete(this.workExperiences, id);
    }
  }

  @Mutation
  public addWorkExperiences(workExperiences: WorkExperience[]): void {
    for (const workExperience of workExperiences) {
      Vue.set(this.workExperiences, workExperience.id, workExperience);
    }
  }

  @Mutation
  public deleteProjectMemberships(ids: number[]): void {
    for (const id of ids) {
      Vue.delete(this.projectMemberships, id);
    }
  }

  @Mutation
  public addProjectMemberships(projectMemberships: ProjectMembership[]): void {
    for (const projectMembership of projectMemberships) {
      Vue.set(this.projectMemberships, projectMembership.id, projectMembership);
    }
  }

  @Mutation
  public setFetching(fetching: boolean): void {
    this.fetching = fetching;
  }

  @Mutation
  public updateUser(user: User): void {
    for (const key in this.cvs) {
      const cv = this.cvs[key];
      if (R.equals(cv.userId, user.id)) {
        Vue.set(this.cvs, cv.id, { ...cv, user });
      }
    }
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
      const [
        cv,
        skills,
        educations,
        workExperiences,
        projectMemberships
      ] = responses;
      this.context.commit("addCV", cv);
      this.context.commit("addSkills", skills);
      this.context.commit("addEducations", educations);
      this.context.commit("addWorkExperiences", workExperiences);
      this.context.commit("addProjectMemberships", projectMemberships);
    });

    this.context.commit("setFetching", false);
  }

  @Action
  public async patchUser({ id, data }: PatchUserDto): Promise<void> {
    const savedUser: User = await Api.patch(`/users/${id}`, data);
    this.context.commit("updateUser", savedUser);
  }

  @Action
  public async patchSkill({
    cvId,
    skillId,
    data
  }: PatchSkillDto): Promise<void> {
    const savedSkill: Skill = await Api.patch(
      `/cv/${cvId}/skills/${skillId}`,
      data
    );
    this.context.commit("addSkills", [savedSkill]);
  }

  @Action
  public async createSkill(createSkillDto: CreateSkillDto): Promise<Skill> {
    const savedSkill: Skill = await Api.post(
      `/cv/${createSkillDto.cvId}/skills`,
      createSkillDto
    );
    this.context.commit("addSkills", [savedSkill]);

    return savedSkill;
  }

  @Action
  public async deleteSkill(deleteSkillDto: DeleteSkillDto): Promise<void> {
    await Api.delete(
      `/cv/${deleteSkillDto.cvId}/skills/${deleteSkillDto.skillId}`
    );
    this.context.commit("deleteSkills", [deleteSkillDto.skillId]);
  }

  @Action
  public async patchCV({ id, data }: PatchCVDto): Promise<void> {
    const savedCV: CV = await Api.patch(`/cv/${id}`, data);
    this.context.commit("addCV", savedCV);
  }

  @Action
  public async patchEducation({
    cvId,
    educationId,
    data
  }: PatchEducationDto): Promise<void> {
    const savedEducation: Education = await Api.patch(
      `/cv/${cvId}/educations/${educationId}`,
      data
    );
    this.context.commit("addEducations", [savedEducation]);
  }

  @Action
  public async createEducation(
    createEducationDto: CreateEducationDto
  ): Promise<void> {
    const savedEducation: Education = await Api.post(
      `/cv/${createEducationDto.cvId}/educations`,
      createEducationDto
    );
    this.context.commit("addEducations", [savedEducation]);
  }

  @Action
  public async deleteEducation(
    deleteEducationDto: DeleteEducationDto
  ): Promise<void> {
    await Api.delete(
      `/cv/${deleteEducationDto.cvId}/educations/${deleteEducationDto.educationId}`
    );
    this.context.commit("deleteEducations", [deleteEducationDto.educationId]);
  }

  @Action
  public async patchWorkExperience({
    cvId,
    workExperienceId,
    data
  }: PatchWorkExperienceDto): Promise<void> {
    const savedWorkExperience: WorkExperience = await Api.patch(
      `/cv/${cvId}/work_experience/${workExperienceId}`,
      data
    );
    this.context.commit("addWorkExperiences", [savedWorkExperience]);
  }

  @Action
  public async createWorkExperience(
    createWorkExperienceDto: CreateWorkExperienceDto
  ): Promise<void> {
    const savedWorkExperience: WorkExperience = await Api.post(
      `/cv/${createWorkExperienceDto.cvId}/work_experience`,
      createWorkExperienceDto
    );
    this.context.commit("addWorkExperiences", [savedWorkExperience]);
  }

  @Action
  public async deleteWorkExperience(
    deleteWorkExperienceDto: DeleteWorkExperienceDto
  ): Promise<void> {
    await Api.delete(
      `/cv/${deleteWorkExperienceDto.cvId}/work_experience/${deleteWorkExperienceDto.workExperienceId}`
    );
    this.context.commit("deleteWorkExperiences", [
      deleteWorkExperienceDto.workExperienceId
    ]);
  }

  @Action
  public async patchProjectMembership({
    cvId,
    projectMembershipId,
    data
  }: PatchProjectMembershipDto): Promise<void> {
    const savedProjectMembership: ProjectMembership = await Api.patch(
      `/cv/${cvId}/project_membership/${projectMembershipId}`,
      data
    );
    this.context.commit("addProjectMemberships", [savedProjectMembership]);
    this.context.commit("addSkills", savedProjectMembership.skills);
  }

  @Action
  public async createProjectMembership(
    createProjectMembershipDto: CreateProjectMembershipDto
  ): Promise<void> {
    const savedProjectMembership: ProjectMembership = await Api.post(
      `/cv/${createProjectMembershipDto.cvId}/project_membership`,
      createProjectMembershipDto
    );
    this.context.commit("addProjectMemberships", [savedProjectMembership]);
    this.context.commit("addSkills", savedProjectMembership.skills);
  }

  @Action
  public async deleteProjectMembership(
    deleteProjectMembershipDto: DeleteProjectMembershipDto
  ): Promise<void> {
    await Api.delete(
      `/cv/${deleteProjectMembershipDto.cvId}/project_membership/${deleteProjectMembershipDto.projectMembershipId}`
    );
    this.context.commit("deleteProjectMemberships", [
      deleteProjectMembershipDto.projectMembershipId
    ]);
  }
}
