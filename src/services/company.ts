import { Company } from "@/store/modules/company";
import PlaygroundService from "./playground/company";
import ApiService from "./api/company";

export const Playground = new PlaygroundService();
export const Api = new ApiService();

export interface CreateCompanyDto {
  name: string;
}

export interface SearchCompanyDto {
  name: string;
  limit?: number;
}

export interface Service {
  fetchCompanies(): Promise<void>;
  deleteCompany(id: number): Promise<void>;
  createCompany(createCompanyDto: CreateCompanyDto): Promise<Company>;
  searchCompanies(searchCompanyDto: SearchCompanyDto): Promise<Company[]>;
}
