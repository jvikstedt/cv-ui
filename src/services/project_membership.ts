import { ProjectMembership } from "@/store/modules/project_membership";
import PlaygroundService from "./playground/project_membership";
import ApiService from "./api/project_membership";
import { MembershipSkillDto } from "@/store/modules/membership_skill";

export const Playground = new PlaygroundService();
export const Api = new ApiService();

export interface PatchProjectMembershipDtoData {
  projectId?: number;
  description?: string;
  role?: string;
  startYear?: number;
  startMonth?: number;
  endYear?: number | null;
  endMonth?: number | null;
  highlight?: boolean;
  membershipSkills?: MembershipSkillDto[];
}

export interface PatchProjectMembershipDto {
  cvId: number;
  projectMembershipId: number;
  data: PatchProjectMembershipDtoData;
}

export interface DeleteProjectMembershipDto {
  cvId: number;
  projectMembershipId: number;
}

export interface CreateProjectMembershipDto {
  cvId: number;
  projectId: number;
  description: string;
  role: string;
  startYear: number;
  startMonth: number;
  endYear?: number | null;
  endMonth?: number | null;
  highlight: boolean;
  membershipSkills: MembershipSkillDto[];
}

export interface Service {
  deleteProjectMembership(
    deleteProjectMembershipDto: DeleteProjectMembershipDto
  ): Promise<void>;
  createProjectMembership(
    createProjectMembershipDto: CreateProjectMembershipDto
  ): Promise<ProjectMembership>;
  patchProjectMembership(
    patchProjectMembershipDto: PatchProjectMembershipDto
  ): Promise<void>;
  fetchCVProjectMemberships(cvId: number): Promise<void>;
}
