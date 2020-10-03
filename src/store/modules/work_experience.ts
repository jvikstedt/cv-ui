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
import Api from "@/api/api";
import store from "@/store";
import { normalize, schema, Schema } from "normalizr";
import CompanyModule, { Company } from "@/store/modules/company";

export interface WorkExperience {
  id: number;
  jobTitle: string;
  description: string;
  startYear: number;
  startMonth: number;
  endYear: number;
  endMonth: number;
  cvId: number;
  company: Company;
  companyId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface PatchWorkExperienceDtoData {
  jobTitle?: string;
  description?: string;
  startYear?: number;
  startMonth?: number;
  endYear?: number | null;
  endMonth?: number | null;
}

export interface PatchWorkExperienceDto {
  cvId: number;
  workExperienceId: number;
  data: PatchWorkExperienceDtoData;
}

export interface DeleteWorkExperienceDto {
  cvId: number;
  workExperienceId: number;
}

export interface CreateWorkExperienceDto {
  cvId: number;
  companyId: number;
  jobTitle: string;
  description: string;
  startYear: number;
  startMonth: number;
  endYear?: number | null;
  endMonth?: number | null;
}

const CompanySchema = new schema.Entity("companies");

const WorkExperienceSchema = new schema.Entity("workExperiences", {
  company: CompanySchema,
});

@Module({
  dynamic: true,
  namespaced: true,
  name: "work_experience",
  store,
})
class WorkExperienceModule extends VuexModule {
  fetching = false;
  byId: { [key: number]: WorkExperience } = {};
  cvWorkExperienceIds: { [key: number]: number[] } = {};

  get find() {
    return (id: number): WorkExperience | undefined => {
      const workExperience = this.byId[id];
      if (!workExperience) {
        return undefined;
      }

      const company = CompanyModule.find(workExperience.companyId);
      if (!company) {
        return undefined;
      }

      return {
        ...workExperience,
        company,
      };
    };
  }

  get listByCV() {
    return (cvId: number): WorkExperience[] => {
      const ids = this.cvWorkExperienceIds[cvId] || [];
      return R.reject(
        R.isNil,
        R.map((id) => this.find(id), ids)
      ) as WorkExperience[];
    };
  }

  @Mutation
  public add(workExperiences: WorkExperience[]): void {
    for (const workExperience of workExperiences) {
      Vue.set(this.byId, workExperience.id, workExperience);

      const ids = this.cvWorkExperienceIds[workExperience.cvId] || [];
      if (ids.includes(workExperience.id)) continue;
      Vue.set(this.cvWorkExperienceIds, workExperience.cvId, [
        ...ids,
        workExperience.id,
      ]);
    }
  }

  @Mutation
  public delete(ids: number[]): void {
    for (const id of ids) {
      const workExperience = this.byId[id];
      if (workExperience) {
        Vue.delete(this.byId, id);
        const cvWorkExperienceIds =
          this.cvWorkExperienceIds[workExperience.cvId] || [];
        Vue.set(
          this.cvWorkExperienceIds,
          workExperience.cvId,
          R.reject(
            (workExperienceId) => R.equals(workExperienceId, id),
            cvWorkExperienceIds
          )
        );
      }
    }
  }

  @MutationAction({ mutate: ["fetching"] })
  async setFetching(fetching: boolean) {
    return { fetching };
  }

  @Action
  public async fetchCVWorkExperiences(cvId: number): Promise<void> {
    await this.setFetching(true);
    const workExperiences: WorkExperience[] = await Api.get(
      `/cv/${cvId}/work_experience`
    );

    await this.saveWorkExperiences({
      entity: workExperiences,
      schema: [WorkExperienceSchema],
    });
    await this.setFetching(false);
  }

  @Action
  public async patchWorkExperience({
    cvId,
    workExperienceId,
    data,
  }: PatchWorkExperienceDto): Promise<void> {
    const workExperience: WorkExperience = await Api.patch(
      `/cv/${cvId}/work_experience/${workExperienceId}`,
      data
    );

    await this.saveWorkExperiences({
      entity: workExperience,
      schema: WorkExperienceSchema,
    });
  }

  @Action
  public async deleteWorkExperience(
    deleteWorkExperienceDto: DeleteWorkExperienceDto
  ): Promise<void> {
    await Api.delete(
      `/cv/${deleteWorkExperienceDto.cvId}/work_experience/${deleteWorkExperienceDto.workExperienceId}`
    );
    this.delete([deleteWorkExperienceDto.workExperienceId]);
  }

  @Action
  public async createWorkExperience(
    createWorkExperienceDto: CreateWorkExperienceDto
  ): Promise<WorkExperience> {
    const workExperience: WorkExperience = await Api.post(
      `/cv/${createWorkExperienceDto.cvId}/work_experience`,
      createWorkExperienceDto
    );
    await this.saveWorkExperiences({
      entity: workExperience,
      schema: WorkExperienceSchema,
    });

    return workExperience;
  }

  @Action
  private async saveWorkExperiences(data: {
    entity: WorkExperience | WorkExperience[];
    schema: Schema;
  }): Promise<void> {
    const normalizedData = normalize(data.entity, data.schema);
    const { companies, workExperiences } = normalizedData.entities;
    CompanyModule.add(R.values(companies || {}));
    this.add(R.values(workExperiences || {}));
  }
}

export default getModule(WorkExperienceModule);
