import { Project } from "./project";

export class ProjectMembership {
  id!: number;

  description!: string;

  startYear!: number;
  startMonth!: number;

  endYear!: number;
  endMonth!: number;

  highlight!: boolean;

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

  endYear?: number | null;
  endMonth?: number | null;

  highlight?: boolean;
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

  endYear?: number | null;
  endMonth?: number | null;

  highlight!: boolean;
}
