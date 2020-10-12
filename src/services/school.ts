import { School } from "@/store/modules/school";
import PlaygroundService from "./playground/school";
import ApiService from "./api/school";

export const Playground = new PlaygroundService();
export const Api = new ApiService();

export interface CreateSchoolDto {
  name: string;
}

export interface SearchSchoolDto {
  name: string;
  limit?: number;
}

export interface Service {
  fetchSchools(): Promise<void>;
  deleteSchool(id: number): Promise<void>;
  createSchool(createSchoolDto: CreateSchoolDto): Promise<School>;
  searchSchools(searchSchoolDto: SearchSchoolDto): Promise<School[]>;
}
