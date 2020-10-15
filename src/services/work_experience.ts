import { WorkExperience } from "@/store/modules/work_experience";
import PlaygroundService from "./playground/work_experience";
import ApiService from "./api/work_experience";

export const Playground = new PlaygroundService();
export const Api = new ApiService();

export interface PatchWorkExperienceDtoData {
  jobTitle?: string;
  description?: string;
  startYear?: number;
  startMonth?: number;
  endYear?: number | null;
  endMonth?: number | null;
  highlight?: boolean;
}

export interface PatchWorkExperienceDto {
  cvId: number;
  workExperienceId: number;
  data: PatchWorkExperienceDtoData;
}

export interface DeleteWorkExperienceDto {
  cvId: number;
  workExperienceId: number;
}

export interface CreateWorkExperienceDto {
  cvId: number;
  companyId: number;
  jobTitle: string;
  description: string;
  startYear: number;
  startMonth: number;
  endYear?: number | null;
  endMonth?: number | null;
  highlight: boolean;
}

export interface Service {
  deleteWorkExperience(
    deleteWorkExperienceDto: DeleteWorkExperienceDto
  ): Promise<void>;
  createWorkExperience(
    createWorkExperienceDto: CreateWorkExperienceDto
  ): Promise<WorkExperience>;
  patchWorkExperience(
    patchWorkExperienceDto: PatchWorkExperienceDto
  ): Promise<void>;
  fetchCVWorkExperiences(cvId: number): Promise<void>;
}
