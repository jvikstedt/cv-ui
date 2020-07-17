export class School {
  id!: number;

  name!: string;

  createdAt!: Date;

  updatedAt!: Date;
}

export class CreateSchoolDto {
  name!: string;
}
