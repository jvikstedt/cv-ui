export class School {
  id!: number;

  name!: string;

  createdAt!: Date;

  updatedAt!: Date;
}

export class Education {
  id!: number;

  degree!: string;

  fieldOfStudy!: string;

  description!: string;

  startYear!: number;

  endYear!: number;

  cvId!: number;

  school!: School;

  schoolId!: number;

  createdAt!: Date;

  updatedAt!: Date;
}

export class PatchEducationDtoData {
  degree?: string;

  fieldOfStudy?: string;

  description?: string;

  startYear?: number;

  endYear?: number;
}

export class PatchEducationDto {
  cvId!: number;
  educationId!: number;
  data!: PatchEducationDtoData;
}

export class DeleteEducationDto {
  cvId!: number;
  educationId!: number;
}

export class CreateEducationDto {
  cvId!: number;

  schoolId!: number;

  degree!: string;

  fieldOfStudy!: string;

  description!: string;

  startYear!: number;

  endYear?: number;
}

export class CreateSchoolDto {
  name!: string;
}
