import Vue from "vue";
import { VuexModule, Module, Mutation, Action } from "vuex-module-decorators";
import Api from "@/api/api";
import { School, CreateSchoolDto } from "@/model/education";

@Module({ namespaced: true })
export class SchoolStore extends VuexModule {
  public Schools: { [key: number]: School } = {};
  public fetching = false;

  get getSchools() {
    return Object.values(this.Schools);
  }

  @Mutation
  public addSchools(Schools: School[]): void {
    for (const School of Schools) {
      Vue.set(this.Schools, School.id, School);
    }
  }

  @Mutation
  public deleteSchools(ids: number[]): void {
    for (const id of ids) {
      Vue.delete(this.Schools, id);
    }
  }

  @Mutation
  public setFetching(fetching: boolean): void {
    this.fetching = fetching;
  }

  @Action
  public async fetchSchools(): Promise<void> {
    this.context.commit("setFetching", true);

    const Schools: School[] = await Api.get("/schools");
    this.context.commit("addSchools", Schools);

    this.context.commit("setFetching", false);
  }

  @Action
  public async deleteSchool(id: number): Promise<void> {
    await Api.delete(`/schools/${id}`);
    this.context.commit("deleteSchools", [id]);
  }

  @Action
  public async createSchool(createSchoolDto: CreateSchoolDto): Promise<School> {
    const School: School = await Api.post("/schools", createSchoolDto);
    this.context.commit("addSchools", [School]);

    return School;
  }
}
