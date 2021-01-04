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

export interface MergeRequest {
  id: number;
  sourceId: number;
  targetId: number;
  sourceName: string;
  targetName: string;
  entity: string;
  description: string;
  state: string;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
}

@Module({
  dynamic: true,
  namespaced: true,
  name: "merge_request",
  store,
})
class MergeRequestModule extends VuexModule {
  fetching = false;
  byId: { [key: number]: MergeRequest } = {};
  allIds: number[] = [];

  get find() {
    return (id: number): MergeRequest | undefined => {
      return this.byId[id];
    };
  }

  get list(): MergeRequest[] {
    return R.reject(
      R.isNil,
      R.map((id) => this.find(id), this.allIds)
    ) as MergeRequest[];
  }

  @Mutation
  public add(mergeRequests: MergeRequest[]): void {
    for (const mergeRequest of mergeRequests) {
      Vue.set(this.byId, mergeRequest.id, mergeRequest);

      if (this.allIds.includes(mergeRequest.id)) continue;
      this.allIds = [...this.allIds, mergeRequest.id];
    }
  }

  @Mutation
  public delete(ids: number[]): void {
    for (const id of ids) {
      const mergeRequest = this.byId[id];
      if (mergeRequest) {
        Vue.delete(this.byId, id);
        this.allIds = R.reject(
          (mergeRequestId) => R.equals(mergeRequestId, id),
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

export default getModule(MergeRequestModule);
