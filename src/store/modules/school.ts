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

export interface School {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

@Module({
  dynamic: true,
  namespaced: true,
  name: "school",
  store,
})
class SchoolModule extends VuexModule {
  fetching = false;
  byId: { [key: number]: School } = {};
  allIds: number[] = [];

  get find() {
    return (id: number): School | undefined => {
      return this.byId[id];
    };
  }

  get list(): School[] {
    return R.reject(
      R.isNil,
      R.map((id) => this.find(id), this.allIds)
    ) as School[];
  }

  @Mutation
  public add(schools: School[]): void {
    for (const school of schools) {
      Vue.set(this.byId, school.id, school);

      if (this.allIds.includes(school.id)) continue;
      this.allIds = [...this.allIds, school.id];
    }
  }

  @Mutation
  public delete(ids: number[]): void {
    for (const id of ids) {
      const school = this.byId[id];
      if (school) {
        Vue.delete(this.byId, id);
        this.allIds = R.reject(
          (schoolId) => R.equals(schoolId, id),
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

export default getModule(SchoolModule);
