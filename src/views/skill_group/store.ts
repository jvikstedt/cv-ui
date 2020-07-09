import Vue from "vue";
import { VuexModule, Module, Mutation, Action } from "vuex-module-decorators";
import Api from "@/api/api";
import { SkillGroup, CreateSkillGroupDto } from "@/model/skill";

@Module({ namespaced: true })
export class SkillGroupStore extends VuexModule {
  public skillGroups: { [key: number]: SkillGroup } = {};
  public fetching = false;

  get getSkillGroups() {
    return Object.values(this.skillGroups);
  }

  @Mutation
  public addSkillGroups(skillGroups: SkillGroup[]): void {
    for (const skillGroup of skillGroups) {
      Vue.set(this.skillGroups, skillGroup.id, skillGroup);
    }
  }

  @Mutation
  public deleteSkillGroups(ids: number[]): void {
    for (const id of ids) {
      Vue.delete(this.skillGroups, id);
    }
  }

  @Mutation
  public setFetching(fetching: boolean): void {
    this.fetching = fetching;
  }

  @Action
  public async fetchSkillGroups(): Promise<void> {
    this.context.commit("setFetching", true);

    const skillGroups: SkillGroup[] = await Api.get("/skill_groups");
    this.context.commit("addSkillGroups", skillGroups);

    this.context.commit("setFetching", false);
  }

  @Action
  public async deleteSkillGroup(id: number): Promise<void> {
    await Api.delete(`/skill_groups/${id}`);
    this.context.commit("deleteSkillGroups", [id]);
  }

  @Action
  public async createSkillGroup(
    createSkillGroupDto: CreateSkillGroupDto
  ): Promise<SkillGroup> {
    const skillGroup: SkillGroup = await Api.post(
      "/skill_groups",
      createSkillGroupDto
    );
    this.context.commit("addSkillGroups", [skillGroup]);

    return skillGroup;
  }
}
