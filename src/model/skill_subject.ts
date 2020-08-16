import { SkillGroup } from "./skill_group";

export class SkillSubject {
  id!: number;

  name!: string;

  skillGroup!: SkillGroup;

  skillGroupId!: number;

  createdAt!: Date;

  updatedAt!: Date;
}

export class CreateSkillSubjectDto {
  name!: string;

  skillGroupId!: number;
}

export class PatchSkillSubjectDtoData {
  name?: string;
}

export class PatchSkillSubjectDto {
  skillSubjectId!: number;
  data!: PatchSkillSubjectDtoData;
}
