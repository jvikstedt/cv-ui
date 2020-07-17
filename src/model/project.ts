export class Project {
  id!: number;

  name!: string;

  createdAt!: Date;

  updatedAt!: Date;
}

export class ProjectMembership {
  id!: number;

  description!: string;

  startYear!: number;
  startMonth!: number;

  endYear!: number;
  endMonth!: number;

  cvId!: number;

  project!: Project;

  projectId!: number;

  createdAt!: Date;

  updatedAt!: Date;
}

export class PatchProjectMembershipDtoData {
  description?: string;

  startYear?: number;
  startMonth?: number;

  endYear?: number;
  endMonth?: number;
}

export class PatchProjectMembershipDto {
  cvId!: number;
  projectMembershipId!: number;
  data!: PatchProjectMembershipDtoData;
}

export class DeleteProjectMembershipDto {
  cvId!: number;
  projectMembershipId!: number;
}

export class CreateProjectMembershipDto {
  cvId!: number;

  projectId!: number;

  description!: string;

  startYear!: number;
  startMonth!: number;

  endYear?: number;
  endMonth?: number;
}

export class CreateProjectDto {
  name!: string;
}
