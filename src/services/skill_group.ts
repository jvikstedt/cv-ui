import PlaygroundService from "./playground/skill_group";
import ApiService from "./api/skill_group";
import { SkillGroup } from "@/store/modules/skill_group";

export const Playground = new PlaygroundService();
export const Api = new ApiService();

export interface CreateSkillGroupDto {
  name: string;
}

export interface SearchSkillGroupDto {
  name: string;
  limit?: number;
}

export interface Service {
  deleteSkillGroup(id: number): Promise<void>;
  createSkillGroup(
    createSkillGroupDto: CreateSkillGroupDto
  ): Promise<SkillGroup>;
  searchSkillGroups(
    searchSkillGroupDto: SearchSkillGroupDto
  ): Promise<SkillGroup[]>;
}
