import * as R from "ramda";
import Vue from "vue";
import {
  Module,
  Mutation,
  Action,
  getModule,
  VuexModule,
  MutationAction,
} from "vuex-module-decorators";
import store from "@/store";
import { normalize, schema } from "normalizr";
import ProjectModule, { Project } from "@/store/modules/project";
import CompanyModule from "@/store/modules/company";
import MembershipSkillModule, {
  MembershipSkill,
} from "@/store/modules/membership_skill";
import SkillModule from "@/store/modules/skill";
import SkillSubjectModule from "@/store/modules/skill_subject";
import SkillGroupModule from "@/store/modules/skill_group";

export interface ProjectMembership {
  id: number;
  description: string;
  role: string;
  startYear: number;
  startMonth: number;
  endYear?: number | null;
  endMonth?: number | null;
  highlight: boolean;
  cvId: number;
  project?: Project;
  projectId: number;
  membershipSkills?: MembershipSkill[];
  createdAt: Date;
  updatedAt: Date;
}

const CompanySchema = new schema.Entity("companies");

const ProjectSchema = new schema.Entity("projects", {
  company: CompanySchema,
});

const SkillGroupSchema = new schema.Entity("skillGroups");

const SkillSubjectSchema = new schema.Entity("skillSubjects", {
  skillGroup: SkillGroupSchema,
});

const SkillSchema = new schema.Entity("skills", {
  skillSubject: SkillSubjectSchema,
});

const MembershipSkillSchema = new schema.Entity("membershipSkills", {
  skill: SkillSchema,
});

const ProjectMembershipSchema = new schema.Entity("projectMemberships", {
  project: ProjectSchema,
  membershipSkills: [MembershipSkillSchema],
});

@Module({
  dynamic: true,
  namespaced: true,
  name: "project_membership",
  store,
})
class ProjectMembershipModule extends VuexModule {
  fetching = false;
  byId: { [key: number]: ProjectMembership } = {};
  cvProjectMembershipIds: { [key: number]: number[] } = {};

  get find() {
    return (
      id: number,
      relations: string[] = ["project", "membershipSkills"]
    ): ProjectMembership | undefined => {
      const projectMembership = this.byId[id];
      if (!projectMembership) {
        return undefined;
      }

      let project: Project | undefined;
      let membershipSkills: MembershipSkill[] | undefined;

      if (R.includes("project", relations)) {
        project = ProjectModule.find(projectMembership.projectId);
        if (!project) {
          return undefined;
        }
      }

      if (R.includes("membershipSkills", relations)) {
        membershipSkills = R.reject(
          R.isNil,
          R.map(
            (n: unknown) => MembershipSkillModule.find(n as number),
            projectMembership.membershipSkills
          )
        ) as MembershipSkill[];
      }

      return {
        ...projectMembership,
        project,
        membershipSkills,
      };
    };
  }

  get listByCV() {
    return (cvId: number): ProjectMembership[] => {
      const ids = this.cvProjectMembershipIds[cvId] || [];
      return R.reject(
        R.isNil,
        R.map((id) => this.find(id, ["project", "membershipSkills"]), ids)
      ) as ProjectMembership[];
    };
  }

  @Mutation
  public add(projectMemberships: ProjectMembership[]): void {
    for (const projectMembership of projectMemberships) {
      Vue.set(this.byId, projectMembership.id, projectMembership);

      const ids = this.cvProjectMembershipIds[projectMembership.cvId] || [];
      if (ids.includes(projectMembership.id)) continue;
      Vue.set(this.cvProjectMembershipIds, projectMembership.cvId, [
        ...ids,
        projectMembership.id,
      ]);
    }
  }

  @Mutation
  public delete(ids: number[]): void {
    for (const id of ids) {
      const projectMembership = this.byId[id];
      if (projectMembership) {
        Vue.delete(this.byId, id);
        const cvProjectMembershipIds =
          this.cvProjectMembershipIds[projectMembership.cvId] || [];
        Vue.set(
          this.cvProjectMembershipIds,
          projectMembership.cvId,
          R.reject(
            (projectMembershipId) => R.equals(projectMembershipId, id),
            cvProjectMembershipIds
          )
        );

        MembershipSkillModule.delete(
          (projectMembership.membershipSkills as unknown) as number[]
        );
      }
    }
  }

  @Action
  public resetCV(cvId: number): void {
    this.delete(this.cvProjectMembershipIds[cvId] || []);
  }

  @MutationAction({ mutate: ["fetching"] })
  async setFetching(fetching: boolean) {
    return { fetching };
  }

  @Action
  public async saveProjectMemberships(
    data: ProjectMembership[]
  ): Promise<void> {
    const normalizedData = normalize(data, [ProjectMembershipSchema]);
    const {
      projects,
      projectMemberships,
      companies,
      skillGroups,
      skillSubjects,
      skills,
      membershipSkills,
    } = normalizedData.entities;
    CompanyModule.add(R.values(companies || {}));
    ProjectModule.add(R.values(projects || {}));
    SkillGroupModule.add(R.values(skillGroups || {}));
    SkillSubjectModule.add(R.values(skillSubjects || {}));
    SkillModule.add(R.values(skills || {}));
    MembershipSkillModule.add(R.values(membershipSkills || {}));
    this.add(R.values(projectMemberships || {}));
  }
}

export default getModule(ProjectMembershipModule);
