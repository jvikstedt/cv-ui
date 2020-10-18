import PlaygroundService from "./playground/project";
import ApiService from "./api/project";
import { Project } from "@/store/modules/project";

export const Playground = new PlaygroundService();
export const Api = new ApiService();

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
  name?: string;

  take?: number;

  skip?: number;

  orderColumnName?: string;

  orderSort?: "ASC" | "DESC";
}

export interface ProjectSearchResult {
  items: Project[];
  total: number;
}

export interface Service {
  fetchProjects(): Promise<void>;
  deleteProject(id: number): Promise<void>;
  createProject(createProjectDto: CreateProjectDto): Promise<Project>;
  patchProject(patchProjectDto: PatchProjectDto): Promise<Project>;
  searchProjects(
    searchProjectDto: SearchProjectDto
  ): Promise<ProjectSearchResult>;
}
