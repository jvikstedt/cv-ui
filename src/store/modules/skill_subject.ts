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
import Api from "@/api/api";
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

export interface CreateSkillSubjectDto {
  name: string;
  skillGroupId: number;
}

export interface PatchSkillSubjectDtoData {
  name?: string;
}

export interface PatchSkillSubjectDto {
  skillSubjectId: number;
  data: PatchSkillSubjectDtoData;
}

export interface SearchSkillSubjectDto {
  name: string;
  limit?: number;
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

  @Action
  public async fetchSkillSubjects(): Promise<void> {
    await this.setFetching(true);

    const skillSubjects: SkillSubject[] = await Api.get("/skill_subjects");
    await this.saveSkillSubjects(skillSubjects);

    await this.setFetching(false);
  }

  @Action
  public async deleteSkillSubject(id: number): Promise<void> {
    await Api.delete(`/skill_subjects/${id}`);
    this.delete([id]);
  }

  @Action
  public async createSkillSubject(
    createSkillSubjectDto: CreateSkillSubjectDto
  ): Promise<SkillSubject> {
    const skillSubject: SkillSubject = await Api.post(
      "/skill_Subjects",
      createSkillSubjectDto
    );
    await this.saveSkillSubjects([skillSubject]);

    return skillSubject;
  }

  @Action
  public async patchSkillSubject({
    skillSubjectId,
    data,
  }: PatchSkillSubjectDto): Promise<void> {
    const skillSubject: SkillSubject = await Api.patch(
      `/skill_subjects/${skillSubjectId}`,
      data
    );
    await this.saveSkillSubjects([skillSubject]);
  }

  @Action
  public async searchSkillSubjects(
    searchSkillSubjectDto: SearchSkillSubjectDto
  ): Promise<SkillSubject[]> {
    const skillSubjects: SkillSubject[] = await Api.post(
      "/skill_Subjects/search",
      searchSkillSubjectDto
    );
    await this.saveSkillSubjects(skillSubjects);

    return skillSubjects;
  }

  @MutationAction({ mutate: ["fetching"] })
  async setFetching(fetching: boolean) {
    return { fetching };
  }

  @Action
  private async saveSkillSubjects(data: SkillSubject[]): Promise<void> {
    const normalizedData = normalize(data, [SkillSubjectSchema]);
    const { skillGroups, skillSubjects } = normalizedData.entities;
    SkillGroupModule.add(R.values(skillGroups || {}));
    this.add(R.values(skillSubjects || {}));
  }
}

export default getModule(SkillSubjectModule);
