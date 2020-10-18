import { School } from "@/store/modules/school";
import PlaygroundService from "./playground/school";
import ApiService from "./api/school";

export const Playground = new PlaygroundService();
export const Api = new ApiService();

export interface CreateSchoolDto {
  name: string;
}

export interface PatchSchoolDtoData {
  name?: string;
}

export interface PatchSchoolDto {
  schoolId: number;
  data: PatchSchoolDtoData;
}

export interface SearchSchoolDto {
  name?: string;

  take?: number;

  skip?: number;

  orderColumnName?: string;

  orderSort?: "ASC" | "DESC";
}

export interface SchoolSearchResult {
  items: School[];
  total: number;
}

export interface Service {
  fetchSchools(): Promise<void>;
  deleteSchool(id: number): Promise<void>;
  createSchool(createSchoolDto: CreateSchoolDto): Promise<School>;
  patchSchool(patchSchoolDto: PatchSchoolDto): Promise<School>;
  searchSchools(searchSchoolDto: SearchSchoolDto): Promise<SchoolSearchResult>;
}
