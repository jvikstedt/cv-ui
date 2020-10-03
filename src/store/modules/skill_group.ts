import * as R from "ramda";
import Vue from "vue";
import {
  Module,
  Mutation,
  getModule,
  VuexModule,
  MutationAction,
  Action,
} from "vuex-module-decorators";
import store from "@/store";
import Api from "@/api/api";

export interface SkillGroup {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateSkillGroupDto {
  name: string;
}

export interface SearchSkillGroupDto {
  name: string;
  limit?: number;
}

@Module({
  dynamic: true,
  namespaced: true,
  name: "skill_group",
  store,
})
class SkillGroupModule extends VuexModule {
  fetching = false;
  byId: { [key: number]: SkillGroup } = {};
  allIds: number[] = [];

  get find() {
    return (id: number): SkillGroup | undefined => {
      return this.byId[id];
    };
  }

  get list(): SkillGroup[] {
    return R.reject(
      R.isNil,
      R.map((id) => this.find(id), this.allIds)
    ) as SkillGroup[];
  }

  @Mutation
  public add(skillGroups: SkillGroup[]): void {
    for (const skillGroup of skillGroups) {
      Vue.set(this.byId, skillGroup.id, skillGroup);

      if (this.allIds.includes(skillGroup.id)) continue;
      this.allIds = [...this.allIds, skillGroup.id];
    }
  }

  @Mutation
  public delete(ids: number[]): void {
    for (const id of ids) {
      const skillGroup = this.byId[id];
      if (skillGroup) {
        Vue.delete(this.byId, id);
        this.allIds = R.reject(
          (skillGroupId) => R.equals(skillGroupId, id),
          this.allIds
        );
      }
    }
  }

  @Action
  public async fetchSkillGroups(): Promise<void> {
    await this.setFetching(true);

    const skillGroups: SkillGroup[] = await Api.get("/skill_groups");
    this.add(skillGroups);

    await this.setFetching(false);
  }

  @Action
  public async deleteSkillGroup(id: number): Promise<void> {
    await Api.delete(`/skill_groups/${id}`);
    this.delete([id]);
  }

  @Action
  public async createSkillGroup(
    createSkillGroupDto: CreateSkillGroupDto
  ): Promise<SkillGroup> {
    const skillGroup: SkillGroup = await Api.post(
      "/skill_groups",
      createSkillGroupDto
    );
    this.add([skillGroup]);

    return skillGroup;
  }

  @Action
  public async searchSkillGroups(
    searchSkillGroupDto: SearchSkillGroupDto
  ): Promise<SkillGroup[]> {
    const skillGroups: SkillGroup[] = await Api.post(
      "/skill_groups/search",
      searchSkillGroupDto
    );
    this.add(skillGroups);

    return skillGroups;
  }

  @MutationAction({ mutate: ["fetching"] })
  async setFetching(fetching: boolean) {
    return { fetching };
  }
}

export default getModule(SkillGroupModule);
