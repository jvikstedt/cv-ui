import * as R from "ramda";
import Vue from "vue";
import {
  Module,
  Mutation,
  getModule,
  VuexModule,
} from "vuex-module-decorators";
import store from "@/store";
import SkillModule, { Skill } from "@/store/modules/skill";

export interface MembershipSkill {
  id: number;
  experienceInYears: number;
  automaticCalculation: boolean;
  projectMembershipId: number;
  skill: Skill;
  skillId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface MembershipSkillDto {
  skillSubjectId: number;
  automaticCalculation: boolean;
  experienceInYears: number;
}

@Module({
  dynamic: true,
  namespaced: true,
  name: "membership_skill",
  store,
})
class MembershipSkillModule extends VuexModule {
  fetching = false;
  byId: { [key: number]: MembershipSkill } = {};
  allIds: number[] = [];

  get find() {
    return (id: number): MembershipSkill | undefined => {
      const memberhipSkill = this.byId[id];
      if (!memberhipSkill) {
        return undefined;
      }

      const skill = SkillModule.find(memberhipSkill.skillId);
      if (!skill) {
        return undefined;
      }

      return {
        ...memberhipSkill,
        skill,
      };
    };
  }

  get list(): MembershipSkill[] {
    return R.reject(
      R.isNil,
      R.map((id) => this.find(id), this.allIds)
    ) as MembershipSkill[];
  }

  @Mutation
  public add(membershipSkills: MembershipSkill[]): void {
    for (const memberhipSkill of membershipSkills) {
      Vue.set(this.byId, memberhipSkill.id, memberhipSkill);

      if (this.allIds.includes(memberhipSkill.id)) continue;
      this.allIds = [...this.allIds, memberhipSkill.id];
    }
  }

  @Mutation
  public delete(ids: number[]): void {
    for (const id of ids) {
      const memberhipSkill = this.byId[id];
      if (memberhipSkill) {
        Vue.delete(this.byId, id);
        this.allIds = R.reject(
          (membershipSkillId) => R.equals(membershipSkillId, id),
          this.allIds
        );
      }
    }
  }
}

export default getModule(MembershipSkillModule);
