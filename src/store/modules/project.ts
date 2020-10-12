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
import { normalize, schema } from "normalizr";
import store from "@/store";
import CompanyModule, { Company } from "@/store/modules/company";

export interface Project {
  id: number;
  name: string;
  company: Company;
  companyId: number;
  createdAt: Date;
  updatedAt: Date;
}

const CompanySchema = new schema.Entity("companies");

const ProjectSchema = new schema.Entity("projects", {
  company: CompanySchema,
});

@Module({
  dynamic: true,
  namespaced: true,
  name: "project",
  store,
})
class ProjectModule extends VuexModule {
  fetching = false;
  byId: { [key: number]: Project } = {};
  allIds: number[] = [];

  get find() {
    return (id: number): Project | undefined => {
      const project = this.byId[id];
      if (!project) {
        return undefined;
      }

      const company = CompanyModule.find(project.companyId);
      if (!company) {
        return undefined;
      }

      return {
        ...project,
        company,
      };
    };
  }

  get list(): Project[] {
    return R.reject(
      R.isNil,
      R.map((id) => this.find(id), this.allIds)
    ) as Project[];
  }

  @Mutation
  public add(projects: Project[]): void {
    for (const project of projects) {
      Vue.set(this.byId, project.id, project);

      if (this.allIds.includes(project.id)) continue;
      this.allIds = [...this.allIds, project.id];
    }
  }

  @Mutation
  public delete(ids: number[]): void {
    for (const id of ids) {
      const project = this.byId[id];
      if (project) {
        Vue.delete(this.byId, id);
        this.allIds = R.reject(
          (projectId) => R.equals(projectId, id),
          this.allIds
        );
      }
    }
  }

  @MutationAction({ mutate: ["fetching"] })
  async setFetching(fetching: boolean) {
    return { fetching };
  }

  @Action
  public async saveProjects(data: Project[]): Promise<void> {
    const normalizedData = normalize(data, [ProjectSchema]);
    const { companies, projects } = normalizedData.entities;
    CompanyModule.add(R.values(companies || {}));
    this.add(R.values(projects || {}));
  }
}

export default getModule(ProjectModule);
