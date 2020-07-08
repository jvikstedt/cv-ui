export class SkillSubject {
  id!: number;

  name!: string;

  createdAt!: Date;

  updatedAt!: Date;
}

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
  id!: number;
  data!: PatchSkillDtoData;
}

export class CreateSkillDto {
  cvId!: number;

  skillSubjectId!: number;

  experienceInYears!: number;
}

export class CreateSkillSubjectDto {
  name!: string;
}
