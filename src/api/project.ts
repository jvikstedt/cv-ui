import Api from "@/api/api";
import { Project } from "@/model/project";

export interface SearchProjectDto {
  name: string;
  limit?: number;
}

export const SearchProjects = async (
  searchProjectDto: SearchProjectDto
): Promise<Project[]> => {
  const projects = await Api.post("/project/search", searchProjectDto);

  return projects;
};
