import Vue from "vue";
import { VuexModule, Module, Mutation, Action } from "vuex-module-decorators";
import Api from "@/api/api";
import { Project, CreateProjectDto } from "@/model/project";

@Module({ namespaced: true })
export class ProjectStore extends VuexModule {
  public projects: { [key: number]: Project } = {};
  public fetching = false;

  get getProjects() {
    return Object.values(this.projects);
  }

  @Mutation
  public addProjects(projects: Project[]): void {
    for (const project of projects) {
      Vue.set(this.projects, project.id, project);
    }
  }

  @Mutation
  public deleteProjects(ids: number[]): void {
    for (const id of ids) {
      Vue.delete(this.projects, id);
    }
  }

  @Mutation
  public setFetching(fetching: boolean): void {
    this.fetching = fetching;
  }

  @Action
  public async fetchProjects(): Promise<void> {
    this.context.commit("setFetching", true);

    const projects: Project[] = await Api.get("/project");
    this.context.commit("addProjects", projects);

    this.context.commit("setFetching", false);
  }

  @Action
  public async deleteProject(id: number): Promise<void> {
    await Api.delete(`/project/${id}`);
    this.context.commit("deleteProjects", [id]);
  }

  @Action
  public async createProject(
    createProjectDto: CreateProjectDto
  ): Promise<Project> {
    const project: Project = await Api.post("/project", createProjectDto);
    this.context.commit("addProjects", [project]);

    return project;
  }
}
