import Api from "@/api/api";
import ProjectModule, { Project } from "@/store/modules/project";
import {
  CreateProjectDto,
  PatchProjectDto,
  ProjectSearchResult,
  SearchProjectDto,
} from "../project";

export default class SkillGroupService {
  public async fetchProjects(): Promise<void> {
    await ProjectModule.setFetching(true);

    const projects: Project[] = await Api.get("/project");
    await ProjectModule.saveProjects(projects);

    await ProjectModule.setFetching(false);
  }

  public async deleteProject(id: number): Promise<void> {
    await Api.delete(`/project/${id}`);
    ProjectModule.delete([id]);
  }

  public async createProject(
    createProjectDto: CreateProjectDto
  ): Promise<Project> {
    const project: Project = await Api.post("/project", createProjectDto);
    await ProjectModule.saveProjects([project]);

    return project;
  }

  public async patchProject({
    projectId,
    data,
  }: PatchProjectDto): Promise<Project> {
    const project: Project = await Api.patch(`/project/${projectId}`, data);
    await ProjectModule.saveProjects([project]);
    return project;
  }

  public async searchProjects(
    searchProjectDto: SearchProjectDto
  ): Promise<ProjectSearchResult> {
    const result: ProjectSearchResult = await Api.post(
      "/project/search",
      searchProjectDto
    );
    await ProjectModule.saveProjects(result.items);

    return result;
  }
}
