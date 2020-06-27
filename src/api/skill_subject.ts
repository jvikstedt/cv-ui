import Api from "@/api/api";
import SkillSubject from "@/store/SkillSubject";

export interface SkillSubjectDto {
  name: string;
}

export interface SearchSkillSubjectDto {
  name: string;
  limit?: number;
}

export const CreateSkillSubject = async (
  skillSubjectDto: SkillSubjectDto
): Promise<SkillSubject> => {
  const skillSubject = await Api.post("/skill_subjects", skillSubjectDto);

  SkillSubject.insert({
    data: skillSubject
  });

  return skillSubject;
};

export const UpdateSkillSubject = async (
  skillSubjectId: number,
  skillSubjectDto: SkillSubjectDto
): Promise<SkillSubject> => {
  const skillSubject = await Api.put(
    `/skill_subjects/${skillSubjectId}`,
    skillSubjectDto
  );

  SkillSubject.insert({
    data: skillSubject
  });

  return skillSubject;
};

export const GetSkillSubjects = async (): Promise<SkillSubject[]> => {
  const skillSubjects = await Api.get("/skill_subjects");

  SkillSubject.insert({
    data: skillSubjects
  });

  return skillSubjects;
};

export const GetSkillSubjectById = async (
  skillSubjectId: number
): Promise<SkillSubject> => {
  const skillSubject = await Api.get(`/skill_subjects/${skillSubjectId}`);

  SkillSubject.insert({
    data: skillSubject
  });

  return skillSubject;
};

export const DeleteSkillSubjectById = async (
  skillSubjectId: number
): Promise<void> => {
  await Api.delete(`/skill_subjects/${skillSubjectId}`);

  SkillSubject.delete(skillSubjectId);
};

export const SearchSkillSubjects = async (
  searchSkillSubjectDto: SearchSkillSubjectDto
): Promise<SkillSubject[]> => {
  const skillSubjects = await Api.post(
    "/skill_subjects/search",
    searchSkillSubjectDto
  );

  SkillSubject.insert({
    data: skillSubjects
  });

  return skillSubjects;
};
