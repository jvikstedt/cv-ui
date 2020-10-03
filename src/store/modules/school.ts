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

export interface School {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateSchoolDto {
  name: string;
}

export interface SearchSchoolDto {
  name: string;
  limit?: number;
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

  @Action
  public async fetchSchools(): Promise<void> {
    await this.setFetching(true);

    const schools: School[] = await Api.get("/schools");
    this.add(schools);

    await this.setFetching(false);
  }

  @Action
  public async deleteSchool(id: number): Promise<void> {
    await Api.delete(`/schools/${id}`);
    this.delete([id]);
  }

  @Action
  public async createSchool(createSchoolDto: CreateSchoolDto): Promise<School> {
    const school: School = await Api.post("/schools", createSchoolDto);
    this.add([school]);

    return school;
  }

  @Action
  public async searchSchools(
    searchSchoolDto: SearchSchoolDto
  ): Promise<School[]> {
    const schools: School[] = await Api.post(
      "/schools/search",
      searchSchoolDto
    );
    this.add(schools);

    return schools;
  }

  @MutationAction({ mutate: ["fetching"] })
  async setFetching(fetching: boolean) {
    return { fetching };
  }
}

export default getModule(SchoolModule);
