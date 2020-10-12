import * as R from "ramda";
import Vue from "vue";
import {
  Module,
  Mutation,
  getModule,
  VuexModule,
  MutationAction,
} from "vuex-module-decorators";
import store from "@/store";

export interface SkillGroup {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
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

  @MutationAction({ mutate: ["fetching"] })
  async setFetching(fetching: boolean) {
    return { fetching };
  }
}

export default getModule(SkillGroupModule);
