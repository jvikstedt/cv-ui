import { User } from "./user";
import { Skill } from "./skill";

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
