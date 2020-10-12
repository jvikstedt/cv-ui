import Api from "@/api/api";
import ProjectMembershipModule, {
  ProjectMembership,
} from "@/store/modules/project_membership";
import {
  CreateProjectMembershipDto,
  DeleteProjectMembershipDto,
  PatchProjectMembershipDto,
} from "../project_membership";

export default class ProjectMembershipService {
  public async fetchCVProjectMemberships(cvId: number): Promise<void> {
    await ProjectMembershipModule.setFetching(true);
    const projectMemberships: ProjectMembership[] = await Api.get(
      `/cv/${cvId}/project_membership`
    );

    ProjectMembershipModule.resetCV(cvId);
    await ProjectMembershipModule.saveProjectMemberships(projectMemberships);
    await ProjectMembershipModule.setFetching(false);
  }

  public async createProjectMembership(
    createProjectMembershipDto: CreateProjectMembershipDto
  ): Promise<ProjectMembership> {
    const projectMembership: ProjectMembership = await Api.post(
      `/cv/${createProjectMembershipDto.cvId}/project_membership`,
      createProjectMembershipDto
    );
    await ProjectMembershipModule.saveProjectMemberships([projectMembership]);

    return projectMembership;
  }

  public async deleteProjectMembership(
    deleteProjectMembershipDto: DeleteProjectMembershipDto
  ): Promise<void> {
    await Api.delete(
      `/cv/${deleteProjectMembershipDto.cvId}/project_membership/${deleteProjectMembershipDto.projectMembershipId}`
    );
    ProjectMembershipModule.delete([
      deleteProjectMembershipDto.projectMembershipId,
    ]);
  }

  public async patchProjectMembership({
    cvId,
    projectMembershipId,
    data,
  }: PatchProjectMembershipDto): Promise<void> {
    const projectMembership: ProjectMembership = await Api.patch(
      `/cv/${cvId}/project_membership/${projectMembershipId}`,
      data
    );

    ProjectMembershipModule.delete([projectMembershipId]);
    await ProjectMembershipModule.saveProjectMemberships([projectMembership]);
  }
}
