import Api from "@/api/api";
import { School } from "@/model/education";

export interface SearchSchoolDto {
  name: string;
  limit?: number;
}

export const SearchSchools = async (
  searchSchoolDto: SearchSchoolDto
): Promise<School[]> => {
  const schools = await Api.post("/schools/search", searchSchoolDto);

  return schools;
};
