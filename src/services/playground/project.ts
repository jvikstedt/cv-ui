import * as R from "ramda";
import ProjectModule, { Project } from "@/store/modules/project";
import ApiService from "@/services/api/project";
import {
  CreateProjectDto,
  PatchProjectDto,
  ProjectSearchResult,
  SearchProjectDto,
} from "../project";
import CompanyModule from "@/store/modules/company";
import { SortArrayOfNumbers } from "@/helpers/index";

export default class ProjectService extends ApiService {
  private fakedProjects: Project[] = [];

  public async createProject(
    createProjectDto: CreateProjectDto
  ): Promise<Project> {
    const id =
      (R.defaultTo(
        0,
        R.last(SortArrayOfNumbers(ProjectModule.allIds))
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
  }: PatchProjectDto): Promise<Project> {
    const originalProject = ProjectModule.find(projectId);
    if (!originalProject) {
      throw new Error(`Could not find project ${projectId}`);
    }
    const project = {
      ...originalProject,
      ...data,
    };

    await ProjectModule.saveProjects([project]);

    return project;
  }

  public async searchProjects(
    searchProjectDto: SearchProjectDto
  ): Promise<ProjectSearchResult> {
    const result = await super.searchProjects(searchProjectDto);

    const { items, total } = result;

    return {
      items: [...items, ...this.fakedProjects],
      total: total + R.length(this.fakedProjects),
    };
  }
}
