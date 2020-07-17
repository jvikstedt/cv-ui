export class SkillGroup {
  id!: number;

  name!: string;

  createdAt!: Date;

  updatedAt!: Date;
}

export class CreateSkillGroupDto {
  name!: string;
}
