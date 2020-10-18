import { Company } from "@/store/modules/company";
import PlaygroundService from "./playground/company";
import ApiService from "./api/company";

export const Playground = new PlaygroundService();
export const Api = new ApiService();

export interface CreateCompanyDto {
  name: string;
}

export interface PatchCompanyDtoData {
  name?: string;
}

export interface PatchCompanyDto {
  companyId: number;
  data: PatchCompanyDtoData;
}

export interface SearchCompanyDto {
  name?: string;

  take?: number;

  skip?: number;

  orderColumnName?: string;

  orderSort?: "ASC" | "DESC";
}

export interface CompanySearchResult {
  items: Company[];
  total: number;
}

export interface Service {
  fetchCompanies(): Promise<void>;
  deleteCompany(id: number): Promise<void>;
  createCompany(createCompanyDto: CreateCompanyDto): Promise<Company>;
  patchCompany(patchCompanyDto: PatchCompanyDto): Promise<Company>;
  searchCompanies(
    searchCompanyDto: SearchCompanyDto
  ): Promise<CompanySearchResult>;
}
