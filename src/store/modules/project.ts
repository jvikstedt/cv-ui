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
import Api from "@/api/api";
import CompanyModule, { Company } from "@/store/modules/company";

export interface Project {
  id: number;
  name: string;
  company: Company;
  companyId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProjectDto {
  name: string;
  companyId: number;
}

export interface PatchProjectDtoData {
  name?: string;
}

export interface PatchProjectDto {
  projectId: number;
  data: PatchProjectDtoData;
}

export interface SearchProjectDto {
  name: string;
  limit?: number;
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

  @Action
  public async fetchProjects(): Promise<void> {
    await this.setFetching(true);

    const projects: Project[] = await Api.get("/project");
    await this.saveProjects(projects);

    await this.setFetching(false);
  }

  @Action
  public async deleteProject(id: number): Promise<void> {
    await Api.delete(`/project/${id}`);
    this.delete([id]);
  }

  @Action
  public async createProject(
    createProjectDto: CreateProjectDto
  ): Promise<Project> {
    const project: Project = await Api.post("/project", createProjectDto);
    await this.saveProjects([project]);

    return project;
  }

  @Action
  public async patchProject({
    projectId,
    data,
  }: PatchProjectDto): Promise<void> {
    const project: Project = await Api.patch(`/project/${projectId}`, data);
    await this.saveProjects([project]);
  }

  @Action
  public async searchProjects(
    searchProjectDto: SearchProjectDto
  ): Promise<Project[]> {
    const projects: Project[] = await Api.post(
      "/project/search",
      searchProjectDto
    );
    await this.saveProjects(projects);

    return projects;
  }

  @MutationAction({ mutate: ["fetching"] })
  async setFetching(fetching: boolean) {
    return { fetching };
  }

  @Action
  private async saveProjects(data: Project[]): Promise<void> {
    const normalizedData = normalize(data, [ProjectSchema]);
    const { companies, projects } = normalizedData.entities;
    CompanyModule.add(R.values(companies || {}));
    this.add(R.values(projects || {}));
  }
}

export default getModule(ProjectModule);
