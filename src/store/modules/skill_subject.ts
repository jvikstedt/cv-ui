import * as R from "ramda";
import Vue from "vue";
import {
  Module,
  Mutation,
  getModule,
  VuexModule,
  MutationAction,
  Action,
} from "vuex-module-decorators";
import { normalize, schema } from "normalizr";
import store from "@/store";
import { SkillGroup } from "@/store/modules/skill_group";
import SkillGroupModule from "@/store/modules/skill_group";

export interface SkillSubject {
  id: number;
  name: string;
  skillGroup: SkillGroup;
  skillGroupId: number;
  createdAt: Date;
  updatedAt: Date;
}

const SkillGroupSchema = new schema.Entity("skillGroups");

const SkillSubjectSchema = new schema.Entity("skillSubjects", {
  skillGroup: SkillGroupSchema,
});

@Module({
  dynamic: true,
  namespaced: true,
  name: "skill_subject",
  store,
})
class SkillSubjectModule extends VuexModule {
  fetching = false;
  byId: { [key: number]: SkillSubject } = {};
  allIds: number[] = [];

  get find() {
    return (id: number): SkillSubject | undefined => {
      const skillSubject = this.byId[id];
      if (!skillSubject) {
        return undefined;
      }

      const skillGroup = SkillGroupModule.find(skillSubject.skillGroupId);
      if (!skillGroup) {
        return undefined;
      }

      return {
        ...skillSubject,
        skillGroup,
      };
    };
  }

  get list(): SkillSubject[] {
    return R.reject(
      R.isNil,
      R.map((id) => this.find(id), this.allIds)
    ) as SkillSubject[];
  }

  @Mutation
  public add(skillSubjects: SkillSubject[]): void {
    for (const skillSubject of skillSubjects) {
      Vue.set(this.byId, skillSubject.id, skillSubject);

      if (this.allIds.includes(skillSubject.id)) continue;
      this.allIds = [...this.allIds, skillSubject.id];
    }
  }

  @Mutation
  public delete(ids: number[]): void {
    for (const id of ids) {
      const skillSubject = this.byId[id];
      if (skillSubject) {
        Vue.delete(this.byId, id);
        this.allIds = R.reject(
          (skillSubjectId) => R.equals(skillSubjectId, id),
          this.allIds
        );
      }
    }
  }

  @MutationAction({ mutate: ["fetching"] })
  async setFetching(fetching: boolean) {
    return { fetching };
  }

  @Action
  public async saveSkillSubjects(data: SkillSubject[]): Promise<void> {
    const normalizedData = normalize(data, [SkillSubjectSchema]);
    const { skillGroups, skillSubjects } = normalizedData.entities;
    SkillGroupModule.add(R.values(skillGroups || {}));
    this.add(R.values(skillSubjects || {}));
  }
}

export default getModule(SkillSubjectModule);
