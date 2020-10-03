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
import Api from "@/api/api";
import store from "@/store";

export interface Company {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCompanyDto {
  name: string;
}

export interface SearchCompanyDto {
  name: string;
  limit?: number;
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

  @Action
  public async fetchCompanies(): Promise<void> {
    await this.setFetching(true);

    const companies: Company[] = await Api.get("/company");
    this.add(companies);

    await this.setFetching(false);
  }

  @Action
  public async deleteCompany(id: number): Promise<void> {
    await Api.delete(`/company/${id}`);
    this.delete([id]);
  }

  @Action
  public async createCompany(
    createCompanyDto: CreateCompanyDto
  ): Promise<Company> {
    const company: Company = await Api.post("/company", createCompanyDto);
    this.add([company]);

    return company;
  }

  @Action
  public async searchCompanies(
    searchCompanyDto: SearchCompanyDto
  ): Promise<Company[]> {
    const companies: Company[] = await Api.post(
      "/company/search",
      searchCompanyDto
    );
    this.add(companies);

    return companies;
  }

  @MutationAction({ mutate: ["fetching"] })
  async setFetching(fetching: boolean) {
    return { fetching };
  }
}

export default getModule(CompanyModule);
