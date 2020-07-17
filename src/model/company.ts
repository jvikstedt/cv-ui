export class CreateCompanyDto {
  name!: string;
}

export class Company {
  id!: number;

  name!: string;

  createdAt!: Date;

  updatedAt!: Date;
}
