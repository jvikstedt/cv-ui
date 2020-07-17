import Api from "@/api/api";
import { SkillGroup } from "@/model/skill_group";

export interface SearchSkillGroupDto {
  name: string;
  limit?: number;
}

export const SearchSkillGroups = async (
  searchSkillGroupDto: SearchSkillGroupDto
): Promise<SkillGroup[]> => {
  const skillGroups = await Api.post(
    "/skill_groups/search",
    searchSkillGroupDto
  );

  return skillGroups;
};
