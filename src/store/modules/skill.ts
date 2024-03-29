import * as R from "ramda";
import Vue from "vue";
import { DateTime } from "luxon";
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
import SkillSubjectModule, {
  SkillSubject,
} from "@/store/modules/skill_subject";
import SkillGroupModule from "@/store/modules/skill_group";
import MembershipSkillModule, {
  MembershipSkill,
} from "@/store/modules/membership_skill";

export interface Skill {
  id: number;
  experienceInYears: number;
  interestLevel: number;
  highlight: boolean;
  cvId: number;
  skillSubject: SkillSubject;
  skillSubjectId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface SkillExperienceProject {
  automaticCalculation: boolean;
  experience: number;
  projectName: string;
  companyName: string;
}

export interface SkillExperience {
  totalExperience: number;
  extraExperience: number;
  projectExperience: number;

  projects: SkillExperienceProject[];
}

const SkillGroupSchema = new schema.Entity("skillGroups");

const SkillSubjectSchema = new schema.Entity("skillSubjects", {
  skillGroup: SkillGroupSchema,
});

const SkillSchema = new schema.Entity("skills", {
  skillSubject: SkillSubjectSchema,
});

const calculateMembershipSkillExperience = (
  membershipSkill: MembershipSkill
): number => {
  const projectMembership = membershipSkill.projectMembership;

  if (!membershipSkill.automaticCalculation) {
    return membershipSkill.experienceInYears;
  }

  if (!projectMembership) {
    return 0;
  }

  const diff = (DateTime.utc(
    projectMembership.endYear || DateTime.utc().year,
    projectMembership.endMonth || DateTime.utc().month
  ).diff(
    DateTime.utc(projectMembership.startYear, projectMembership.startMonth),
    ["years"]
  ) as unknown) as any; // eslint-disable-line @typescript-eslint/no-explicit-any

  if (R.isNil(diff["values"]) || R.isNil(diff["values"].years)) {
    return 0;
  }

  const experience = diff["values"].years;
  return Math.round(experience * 100) / 100;
};

@Module({
  dynamic: true,
  namespaced: true,
  name: "skill",
  store,
})
class SkillModule extends VuexModule {
  fetching = false;
  byId: { [key: number]: Skill } = {};
  cvSkillIds: { [key: number]: number[] } = {};

  get find() {
    return (id: number): Skill | undefined => {
      const skill = this.byId[id];
      if (!skill) {
        return undefined;
      }

      const skillSubject = SkillSubjectModule.find(skill.skillSubjectId);
      if (!skillSubject) {
        return undefined;
      }

      return {
        ...skill,
        skillSubject,
      };
    };
  }

  get findBySkillSubject() {
    return (cvId: number, skillSubjectId: number): Skill | undefined => {
      const skills = this.listByCV(cvId);
      const skill = R.find(
        (s) => R.equals(s.skillSubjectId, skillSubjectId),
        skills
      );

      if (!skill) {
        return undefined;
      }

      return this.find(skill.id);
    };
  }

  get listByCV() {
    return (cvId: number): Skill[] => {
      const ids = this.cvSkillIds[cvId] || [];
      return R.reject(
        R.isNil,
        R.map((id) => this.find(id), ids)
      ) as Skill[];
    };
  }

  get skillExperience() {
    return (id: number): SkillExperience | undefined => {
      const skill = this.byId[id];
      if (!skill) {
        return undefined;
      }
      const membershipSkills = MembershipSkillModule.findBySkill(id);

      const skillExperienceProjects: SkillExperienceProject[] = R.map(
        (memberhipSkill) => {
          return {
            experience: calculateMembershipSkillExperience(memberhipSkill),
            automaticCalculation: memberhipSkill.automaticCalculation,
            projectName:
              memberhipSkill.projectMembership?.project?.name || "Unknown",
            companyName:
              memberhipSkill.projectMembership?.project?.company?.name ||
              "Unknown",
          };
        },
        membershipSkills
      );

      let projectExperience = R.sum(
        R.map((project) => project.experience, skillExperienceProjects)
      );
      projectExperience = Math.round(projectExperience * 100) / 100;

      return {
        totalExperience: projectExperience + skill.experienceInYears,
        extraExperience: skill.experienceInYears,
        projectExperience,
        projects: skillExperienceProjects,
      };
    };
  }

  @Mutation
  public add(skills: Skill[]): void {
    for (const skill of skills) {
      Vue.set(this.byId, skill.id, skill);

      const ids = this.cvSkillIds[skill.cvId] || [];
      if (ids.includes(skill.id)) continue;
      Vue.set(this.cvSkillIds, skill.cvId, [...ids, skill.id]);
    }
  }

  @Mutation
  public delete(ids: number[]): void {
    for (const id of ids) {
      const skill = this.byId[id];
      if (skill) {
        Vue.delete(this.byId, id);
        const cvSkillIds = this.cvSkillIds[skill.cvId] || [];
        Vue.set(
          this.cvSkillIds,
          skill.cvId,
          R.reject((skillId) => R.equals(skillId, id), cvSkillIds)
        );
      }
    }
  }

  @Action
  public resetCV(cvId: number): void {
    this.delete(this.cvSkillIds[cvId] || []);
  }

  @MutationAction({ mutate: ["fetching"] })
  async setFetching(fetching: boolean) {
    return { fetching };
  }

  @Action
  public async saveSkills(data: Skill[]): Promise<void> {
    const normalizedData = normalize(data, [SkillSchema]);
    const { skillGroups, skillSubjects, skills } = normalizedData.entities;
    SkillGroupModule.add(R.values(skillGroups || {}));
    SkillSubjectModule.add(R.values(skillSubjects || {}));
    this.add(R.values(skills || {}));
  }
}

export default getModule(SkillModule);
