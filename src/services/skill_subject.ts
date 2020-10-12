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
  name: string;
  limit?: number;
}

export interface Service {
  deleteSkillSubject(id: number): Promise<void>;
  createSkillSubject(
    createSkillSubjectDto: CreateSkillSubjectDto
  ): Promise<SkillSubject>;
  patchSkillSubject(patchSkillSubjectDto: PatchSkillSubjectDto): Promise<void>;
  searchSkillSubjects(
    searchSkillSubjectDto: SearchSkillSubjectDto
  ): Promise<SkillSubject[]>;
}
