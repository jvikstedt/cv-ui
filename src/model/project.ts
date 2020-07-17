import { Company } from "./company";

export class Project {
  id!: number;

  name!: string;

  company!: Company;

  companyId!: number;

  createdAt!: Date;

  updatedAt!: Date;
}

export class CreateProjectDto {
  name!: string;
  companyId!: number;
}
