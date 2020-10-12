import * as R from "ramda";
import ProjectModule, { Project } from "@/store/modules/project";
import ApiService from "@/services/api/project";
import {
  CreateProjectDto,
  PatchProjectDto,
  SearchProjectDto,
} from "../project";
import CompanyModule from "@/store/modules/company";

export default class ProjectService extends ApiService {
  private fakedProjects: Project[] = [];

  public async createProject(
    createProjectDto: CreateProjectDto
  ): Promise<Project> {
    const id =
      (R.defaultTo(
        0,
        R.last(Object.keys(ProjectModule.byId).sort())
      ) as number) + 1;

    const project = {
      ...createProjectDto,
      id,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      company: CompanyModule.find(createProjectDto.companyId)!,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.fakedProjects.push(project);
    await ProjectModule.saveProjects([project]);
    return project;
  }

  public async deleteProject(id: number): Promise<void> {
    ProjectModule.delete([id]);
  }

  public async patchProject({
    projectId,
    data,
  }: PatchProjectDto): Promise<void> {
    const originalProject = ProjectModule.find(projectId);
    if (!originalProject) {
      return;
    }
    const project = {
      ...originalProject,
      ...data,
    };

    await ProjectModule.saveProjects([project]);
  }

  public async searchProjects(
    searchProjectDto: SearchProjectDto
  ): Promise<Project[]> {
    const projects = await super.searchProjects(searchProjectDto);

    return [...projects, ...this.fakedProjects];
  }
}
