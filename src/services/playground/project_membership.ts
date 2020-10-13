import * as R from "ramda";
import ApiService from "@/services/api/project_membership";
import ProjectMembershipModule, {
  ProjectMembership,
} from "@/store/modules/project_membership";
import {
  CreateProjectMembershipDto,
  DeleteProjectMembershipDto,
  PatchProjectMembershipDto,
} from "../project_membership";
import MembershipSkillModule, {
  MembershipSkill,
  MembershipSkillDto,
} from "@/store/modules/membership_skill";
import ProjectModule from "@/store/modules/project";
import { Playground as SkillPlayground } from "@/services/skill";

export default class ProjectMembershipService extends ApiService {
  public async createProjectMembership(
    createProjectMembershipDto: CreateProjectMembershipDto
  ): Promise<ProjectMembership> {
    const id =
      (R.defaultTo(
        0,
        R.last(
          ProjectMembershipModule.cvProjectMembershipIds[
            createProjectMembershipDto.cvId
          ].sort()
        )
      ) as number) + 1;

    const membershipSkills = this.getMembershipSkills(
      createProjectMembershipDto.membershipSkills,
      createProjectMembershipDto.cvId,
      id
    );

    const projectMembership = {
      ...createProjectMembershipDto,
      id,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      project: ProjectModule.find(createProjectMembershipDto.projectId)!,
      membershipSkills,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await ProjectMembershipModule.saveProjectMemberships([projectMembership]);

    return projectMembership;
  }

  public async patchProjectMembership({
    cvId,
    projectMembershipId,
    data,
  }: PatchProjectMembershipDto): Promise<void> {
    const originalProjectMembership = ProjectMembershipModule.find(
      projectMembershipId
    );
    if (!originalProjectMembership) {
      return;
    }
    const projectMembership = originalProjectMembership;

    if (data.membershipSkills) {
      projectMembership.membershipSkills = this.getMembershipSkills(
        data.membershipSkills,
        cvId,
        projectMembershipId
      );
    }

    projectMembership.description =
      data.description || projectMembership.description;
    projectMembership.role = data.role || projectMembership.role;
    projectMembership.startYear = data.startYear || projectMembership.startYear;
    projectMembership.startMonth =
      data.startMonth || projectMembership.startMonth;
    projectMembership.endYear = data.endYear;
    projectMembership.endMonth = data.endMonth;
    projectMembership.highlight = data.highlight || projectMembership.highlight;

    // ProjectMembership is deleted to force deletion of membershipSkills
    // This is because backend does the same and will return membershipSkills
    // with different ids
    ProjectMembershipModule.delete([projectMembershipId]);
    await ProjectMembershipModule.saveProjectMemberships([projectMembership]);
  }

  public async deleteProjectMembership(
    deleteProjectMembershipDto: DeleteProjectMembershipDto
  ): Promise<void> {
    ProjectMembershipModule.delete([
      deleteProjectMembershipDto.projectMembershipId,
    ]);
  }

  public getMembershipSkills(
    membershipSkills: MembershipSkillDto[],
    cvId: number,
    projectMembershipId: number
  ): MembershipSkill[] {
    let id =
      (R.defaultTo(0, R.last(MembershipSkillModule.allIds.sort())) as number) +
      1;

    return R.map((m) => {
      const skill = SkillPlayground.findPlaygroundSkill(cvId, m.skillSubjectId);
      id = id + 1;
      return {
        id,
        skillId: skill.id,
        skill: skill,
        experienceInYears: m.experienceInYears,
        automaticCalculation: m.automaticCalculation,
        projectMembershipId: projectMembershipId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }, membershipSkills);
  }
}
