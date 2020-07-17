import Api from "@/api/api";
import { Company } from "@/model/company";

export interface SearchCompanyDto {
  name: string;
  limit?: number;
}

export const SearchCompanies = async (
  searchCompanyDto: SearchCompanyDto
): Promise<Company[]> => {
  const companies = await Api.post("/company/search", searchCompanyDto);

  return companies;
};
