import Api from "@/api/api";
import { SkillSubject } from "@/model/skill";

export interface SearchSkillSubjectDto {
  name: string;
  limit?: number;
}

export const SearchSkillSubjects = async (
  searchSkillSubjectDto: SearchSkillSubjectDto
): Promise<SkillSubject[]> => {
  const skillSubjects = await Api.post(
    "/skill_subjects/search",
    searchSkillSubjectDto
  );

  return skillSubjects;
};
