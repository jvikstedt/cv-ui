export class File {
  id!: string;

  originalname!: string;

  encoding!: string;

  mimetype!: string;

  destination!: string;

  filename!: string;

  path!: string;

  size!: number;

  createdAt!: string;

  updatedAt!: string;
}

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

export class User {
  id!: number;

  username!: string;

  firstName!: string;

  lastName!: string;

  avatarId!: string;

  createdAt!: Date;

  updatedAt!: Date;
}

export class PatchUserDtoData {
  firstName!: string;

  lastName!: string;

  avatarId!: string;
}

export class PatchUserDto {
  id!: number;
  data!: PatchUserDtoData;
}

export class PatchCVDtoData {
  description!: string;
}

export class PatchCVDto {
  id!: number;
  data!: PatchCVDtoData;
}

export class CV {
  id!: number;

  description!: string;

  user!: User;

  userId!: number;

  createdAt!: Date;

  updatedAt!: Date;
}

export interface TemplateDto {
  id?: number;

  name: string;

  exporter?: string;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
}

export class Template {
  id!: number;

  name!: string;

  exporter!: string;

  userId!: number;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data!: any;

  createdAt!: Date;

  updatedAt!: Date;
}

export class CVSearchDtoSkill {
  required? = false;

  skillSubjectId!: number;
}

export class CVSearchDto {
  fullName?: string = "";

  limit?: number = 10;

  skills?: CVSearchDtoSkill[] = [];

  public constructor(init?: Partial<CVSearchDto>) {
    Object.assign(this, init);
  }
}

export class CVSearchResultSkill {
  skillSubjectId!: number;

  experienceInYears!: number;

  name!: string;
}

export class CVSearchResult {
  id!: number;

  description!: string;

  userId!: number;

  username!: string;

  avatarId!: string;

  fullName!: string;

  skills!: CVSearchResultSkill[];
}

export class CVExportData extends CV {
  skills!: Skill[];
}
