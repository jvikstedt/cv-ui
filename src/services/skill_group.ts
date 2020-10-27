import PlaygroundService from "./playground/skill_group";
import ApiService from "./api/skill_group";
import { SkillGroup } from "@/store/modules/skill_group";

export const Playground = new PlaygroundService();
export const Api = new ApiService();

export interface CreateSkillGroupDto {
  name: string;
}

export interface PatchSkillGroupDtoData {
  name?: string;
}

export interface PatchSkillGroupDto {
  skillGroupId: number;
  data: PatchSkillGroupDtoData;
}

export interface SearchSkillGroupDto {
  name?: string;

  take?: number;

  skip?: number;

  orderColumnName?: string;

  orderSort?: "ASC" | "DESC";
}

export interface SkillGroupSearchResult {
  items: SkillGroup[];
  total: number;
}

export interface Service {
  fetchSkillGroups(): Promise<void>;
  deleteSkillGroup(id: number): Promise<void>;
  createSkillGroup(
    createSkillGroupDto: CreateSkillGroupDto
  ): Promise<SkillGroup>;
  patchSkillGroup(patchSkillGroupDto: PatchSkillGroupDto): Promise<SkillGroup>;
  searchSkillGroups(
    searchSkillGroupDto: SearchSkillGroupDto
  ): Promise<SkillGroupSearchResult>;
}
