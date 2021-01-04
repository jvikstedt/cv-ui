import PlaygroundService from "./playground/skill_subject";
import ApiService from "./api/skill_subject";
import { SkillSubject } from "@/store/modules/skill_subject";

export const Playground = new PlaygroundService();
export const Api = new ApiService();

export interface CreateSkillSubjectDto {
  name: string;
  skillGroupId: number;
}

export interface PatchSkillSubjectDtoData {
  name?: string;
}

export interface PatchSkillSubjectDto {
  skillSubjectId: number;
  data: PatchSkillSubjectDtoData;
}

export interface SearchSkillSubjectDto {
  name?: string;

  skillGroupId?: number;

  take?: number;

  skip?: number;

  orderColumnName?: string;

  orderSort?: "ASC" | "DESC";
}

export interface SkillSubjectSearchResult {
  items: SkillSubject[];
  total: number;
}

export interface Service {
  findOne(id: number): Promise<SkillSubject>;
  fetchSkillSubjects(): Promise<void>;
  deleteSkillSubject(id: number): Promise<void>;
  createSkillSubject(
    createSkillSubjectDto: CreateSkillSubjectDto
  ): Promise<SkillSubject>;
  patchSkillSubject(
    patchSkillSubjectDto: PatchSkillSubjectDto
  ): Promise<SkillSubject>;
  searchSkillSubjects(
    searchSkillSubjectDto: SearchSkillSubjectDto
  ): Promise<SkillSubjectSearchResult>;
}
