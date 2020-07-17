import { SkillSubject } from "./skill_subject";

export class Skill {
  id!: number;

  experienceInYears!: number;

  cvId!: number;

  skillSubject!: SkillSubject;

  skillSubjectId!: number;

  createdAt!: Date;

  updatedAt!: Date;
}

export class PatchSkillDtoData {
  experienceInYears!: number;
}

export class PatchSkillDto {
  cvId!: number;
  skillId!: number;
  data!: PatchSkillDtoData;
}

export class DeleteSkillDto {
  cvId!: number;
  skillId!: number;
}

export class CreateSkillDto {
  cvId!: number;

  skillSubjectId!: number;

  experienceInYears!: number;
}
