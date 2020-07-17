import Vue from "vue";
import { VuexModule, Module, Mutation, Action } from "vuex-module-decorators";
import Api from "@/api/api";
import { Company, CreateCompanyDto } from "@/model/company";

@Module({ namespaced: true })
export class CompanyStore extends VuexModule {
  public companies: { [key: number]: Company } = {};
  public fetching = false;

  get getCompanies() {
    return Object.values(this.companies);
  }

  @Mutation
  public addCompanies(companies: Company[]): void {
    for (const company of companies) {
      Vue.set(this.companies, company.id, company);
    }
  }

  @Mutation
  public deleteCompanies(ids: number[]): void {
    for (const id of ids) {
      Vue.delete(this.companies, id);
    }
  }

  @Mutation
  public setFetching(fetching: boolean): void {
    this.fetching = fetching;
  }

  @Action
  public async fetchCompanies(): Promise<void> {
    this.context.commit("setFetching", true);

    const companies: Company[] = await Api.get("/company");
    this.context.commit("addCompanies", companies);

    this.context.commit("setFetching", false);
  }

  @Action
  public async deleteCompany(id: number): Promise<void> {
    await Api.delete(`/company/${id}`);
    this.context.commit("deleteCompanies", [id]);
  }

  @Action
  public async createCompany(
    createCompanyDto: CreateCompanyDto
  ): Promise<Company> {
    const company: Company = await Api.post("/company", createCompanyDto);
    this.context.commit("addCompanies", [company]);

    return company;
  }
}
