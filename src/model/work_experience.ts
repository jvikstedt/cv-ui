export class Company {
  id!: number;

  name!: string;

  createdAt!: Date;

  updatedAt!: Date;
}

export class WorkExperience {
  id!: number;

  jobTitle!: string;

  description!: string;

  startYear!: number;
  startMonth!: number;

  endYear!: number;
  endMonth!: number;

  cvId!: number;

  company!: Company;

  companyId!: number;

  createdAt!: Date;

  updatedAt!: Date;
}

export class PatchWorkExperienceDtoData {
  jobTitle?: string;

  description?: string;

  startYear?: number;
  startMonth?: number;

  endYear?: number;
  endMonth?: number;
}

export class PatchWorkExperienceDto {
  cvId!: number;
  workExperienceId!: number;
  data!: PatchWorkExperienceDtoData;
}

export class DeleteWorkExperienceDto {
  cvId!: number;
  workExperienceId!: number;
}

export class CreateWorkExperienceDto {
  cvId!: number;

  companyId!: number;

  jobTitle!: string;

  description!: string;

  startYear!: number;
  startMonth!: number;

  endYear?: number;
  endMonth?: number;
}

export class CreateCompanyDto {
  name!: string;
}
