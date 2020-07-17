import Vue from "vue";
import { VuexModule, Module, Mutation, Action } from "vuex-module-decorators";
import Api from "@/api/api";
import { School, CreateSchoolDto } from "@/model/school";

@Module({ namespaced: true })
export class SchoolStore extends VuexModule {
  public schools: { [key: number]: School } = {};
  public fetching = false;

  get getSchools() {
    return Object.values(this.schools);
  }

  @Mutation
  public addSchools(schools: School[]): void {
    for (const school of schools) {
      Vue.set(this.schools, school.id, school);
    }
  }

  @Mutation
  public deleteSchools(ids: number[]): void {
    for (const id of ids) {
      Vue.delete(this.schools, id);
    }
  }

  @Mutation
  public setFetching(fetching: boolean): void {
    this.fetching = fetching;
  }

  @Action
  public async fetchSchools(): Promise<void> {
    this.context.commit("setFetching", true);

    const schools: School[] = await Api.get("/schools");
    this.context.commit("addSchools", schools);

    this.context.commit("setFetching", false);
  }

  @Action
  public async deleteSchool(id: number): Promise<void> {
    await Api.delete(`/schools/${id}`);
    this.context.commit("deleteSchools", [id]);
  }

  @Action
  public async createSchool(createSchoolDto: CreateSchoolDto): Promise<School> {
    const school: School = await Api.post("/schools", createSchoolDto);
    this.context.commit("addSchools", [school]);

    return school;
  }
}
