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
import { CV, PatchCVDto } from "@/model/cv";
import { User, PatchUserDto } from "@/model/user";

@Module({ namespaced: true })
export class CVShowStore extends VuexModule {
  public cvs: { [key: number]: CV } = {};
  public skills: { [key: number]: Skill } = {};
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

  get getCVSkillsGrouped() {
    return (id: number): { [key: string]: Skill[] } =>
      R.groupBy(
        (skill: Skill) => skill.skillSubject.skillGroup.name,
        this.getCVSkills(id)
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

    const cv: CV = await Api.get(`/cv/${id}`);
    this.context.commit("addCV", cv);

    const skills: Skill[] = await Api.get(`/cv/${id}/skills`);
    this.context.commit("addSkills", skills);

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
  public async createSkill(createSkillDto: CreateSkillDto): Promise<void> {
    const savedSkill: Skill = await Api.post(
      `/cv/${createSkillDto.cvId}/skills`,
      createSkillDto
    );
    this.context.commit("addSkills", [savedSkill]);
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
}
