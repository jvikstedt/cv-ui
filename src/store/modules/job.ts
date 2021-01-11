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

export interface Job {
  id: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
  runner: string;
  description: string;
  skipApproval: boolean;
  state: string;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
}

@Module({
  dynamic: true,
  namespaced: true,
  name: "job",
  store,
})
class JobModule extends VuexModule {
  fetching = false;
  byId: { [key: number]: Job } = {};
  allIds: number[] = [];

  get find() {
    return (id: number): Job | undefined => {
      return this.byId[id];
    };
  }

  get list(): Job[] {
    return R.reject(
      R.isNil,
      R.map((id) => this.find(id), this.allIds)
    ) as Job[];
  }

  @Mutation
  public add(jobs: Job[]): void {
    for (const job of jobs) {
      Vue.set(this.byId, job.id, job);

      if (this.allIds.includes(job.id)) continue;
      this.allIds = [...this.allIds, job.id];
    }
  }

  @Mutation
  public delete(ids: number[]): void {
    for (const id of ids) {
      const job = this.byId[id];
      if (job) {
        Vue.delete(this.byId, id);
        this.allIds = R.reject((jobId) => R.equals(jobId, id), this.allIds);
      }
    }
  }

  @MutationAction({ mutate: ["fetching"] })
  async setFetching(fetching: boolean) {
    return { fetching };
  }
}

export default getModule(JobModule);
