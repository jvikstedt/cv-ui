import Api from "@/api/api";
import Skill from "@/store/Skill";

export interface CreateSkillDto {
  cvId: number;

  skillSubjectId: number;

  experienceInYears: number;
}

export interface UpdateSkillDto {
  experienceInYears: number;
}

export const CreateSkill = async (
  createSkillDto: CreateSkillDto
): Promise<Skill> => {
  const skill = await Api.post("/skills", createSkillDto);

  Skill.insert({
    data: skill
  });

  return skill;
};

export const UpdateSkill = async (
  skillId: number,
  updateSkillDto: UpdateSkillDto
): Promise<Skill> => {
  const skill = await Api.put(`/skills/${skillId}`, updateSkillDto);

  Skill.insert({
    data: skill
  });

  return skill;
};

export const DeleteSkillById = async (skillId: number): Promise<void> => {
  await Api.delete(`/skills/${skillId}`);

  Skill.delete(skillId);
};
