import { Skill } from "@/store/modules/skill";
import PlaygroundService from "./playground/skill";
import ApiService from "./api/skill";

export const Playground = new PlaygroundService();
export const Api = new ApiService();

export interface PatchSkillDtoData {
  experienceInYears?: number;
  interestLevel?: number;
  highlight?: boolean;
}

export interface PatchSkillDto {
  cvId: number;
  skillId: number;
  data: PatchSkillDtoData;
}

export interface DeleteSkillDto {
  cvId: number;
  skillId: number;
}

export interface CreateSkillDto {
  cvId: number;
  skillSubjectId: number;
  experienceInYears: number;
  interestLevel: number;
  highlight: boolean;
}

export interface Service {
  deleteSkill(deleteSkillDto: DeleteSkillDto): Promise<void>;
  createSkill(createSkillDto: CreateSkillDto): Promise<Skill>;
  patchSkill(patchSkillDto: PatchSkillDto): Promise<void>;
  fetchCVSkills(cvId: number): Promise<void>;
}
