import { Education } from "@/store/modules/education";
import PlaygroundService from "./playground/education";
import ApiService from "./api/education";

export const Playground = new PlaygroundService();
export const Api = new ApiService();

export interface PatchEducationDtoData {
  degree?: string;
  fieldOfStudy?: string;
  description?: string;
  startYear?: number;
  endYear?: number | null;
  highlight?: boolean;
}

export interface PatchEducationDto {
  cvId: number;
  educationId: number;
  data: PatchEducationDtoData;
}

export interface DeleteEducationDto {
  cvId: number;
  educationId: number;
}

export interface CreateEducationDto {
  cvId: number;
  schoolId: number;
  degree: string;
  fieldOfStudy: string;
  description: string;
  startYear: number;
  endYear?: number | null;
  highlight: boolean;
}

export interface Service {
  deleteEducation(deleteEducationDto: DeleteEducationDto): Promise<void>;
  createEducation(createEducationDto: CreateEducationDto): Promise<Education>;
  patchEducation(patchEducationDto: PatchEducationDto): Promise<void>;
  fetchCVEducations(cvId: number): Promise<void>;
}
