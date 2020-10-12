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

export interface Company {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

@Module({
  dynamic: true,
  namespaced: true,
  name: "company",
  store,
})
class CompanyModule extends VuexModule {
  fetching = false;
  byId: { [key: number]: Company } = {};
  allIds: number[] = [];

  get find() {
    return (id: number): Company | undefined => {
      return this.byId[id];
    };
  }

  get list(): Company[] {
    return R.reject(
      R.isNil,
      R.map((id) => this.find(id), this.allIds)
    ) as Company[];
  }

  @Mutation
  public add(companies: Company[]): void {
    for (const company of companies) {
      Vue.set(this.byId, company.id, company);

      if (this.allIds.includes(company.id)) continue;
      this.allIds = [...this.allIds, company.id];
    }
  }

  @Mutation
  public delete(ids: number[]): void {
    for (const id of ids) {
      const company = this.byId[id];
      if (company) {
        Vue.delete(this.byId, id);
        this.allIds = R.reject(
          (companyId) => R.equals(companyId, id),
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

export default getModule(CompanyModule);
