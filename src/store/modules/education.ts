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
import SchoolModule, { School } from "@/store/modules/school";

export interface Education {
  id: number;
  degree: string;
  fieldOfStudy: string;
  description: string;
  startYear: number;
  endYear: number;
  highlight: boolean;
  cvId: number;
  school: School;
  schoolId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface PatchEducationDtoData {
  degree?: string;
  fieldOfStudy?: string;
  description?: string;
  startYear?: number;
  endYear?: number | null;
  highlight?: boolean;
}

export interface PatchEducationDto {
  cvId: number;
  educationId: number;
  data: PatchEducationDtoData;
}

export interface DeleteEducationDto {
  cvId: number;
  educationId: number;
}

export interface CreateEducationDto {
  cvId: number;
  schoolId: number;
  degree: string;
  fieldOfStudy: string;
  description: string;
  startYear: number;
  endYear?: number | null;
  highlight: boolean;
}

const SchoolSchema = new schema.Entity("schools");

const EducationSchema = new schema.Entity("educations", {
  school: SchoolSchema,
});

@Module({
  dynamic: true,
  namespaced: true,
  name: "education",
  store,
})
class EducationModule extends VuexModule {
  fetching = false;
  byId: { [key: number]: Education } = {};
  cvEducationIds: { [key: number]: number[] } = {};

  get find() {
    return (id: number): Education | undefined => {
      const education = this.byId[id];
      if (!education) {
        return undefined;
      }

      const school = SchoolModule.find(education.schoolId);
      if (!school) {
        return undefined;
      }

      return {
        ...education,
        school,
      };
    };
  }

  get listByCV() {
    return (cvId: number): Education[] => {
      const ids = this.cvEducationIds[cvId] || [];
      return R.reject(
        R.isNil,
        R.map((id) => this.find(id), ids)
      ) as Education[];
    };
  }

  @Mutation
  public add(educations: Education[]): void {
    for (const education of educations) {
      Vue.set(this.byId, education.id, education);

      const ids = this.cvEducationIds[education.cvId] || [];
      if (ids.includes(education.id)) continue;
      Vue.set(this.cvEducationIds, education.cvId, [...ids, education.id]);
    }
  }

  @Mutation
  public delete(ids: number[]): void {
    for (const id of ids) {
      const education = this.byId[id];
      if (education) {
        Vue.delete(this.byId, id);
        const cvEducationIds = this.cvEducationIds[education.cvId] || [];
        Vue.set(
          this.cvEducationIds,
          education.cvId,
          R.reject((educationId) => R.equals(educationId, id), cvEducationIds)
        );
      }
    }
  }

  @MutationAction({ mutate: ["fetching"] })
  async setFetching(fetching: boolean) {
    return { fetching };
  }

  @Action
  public async fetchCVEducations(cvId: number): Promise<void> {
    await this.setFetching(true);
    const educations: Education[] = await Api.get(`/cv/${cvId}/educations`);

    await this.saveEducations({
      entity: educations,
      schema: [EducationSchema],
    });
    await this.setFetching(false);
  }

  @Action
  public async patchEducation({
    cvId,
    educationId,
    data,
  }: PatchEducationDto): Promise<void> {
    const education: Education = await Api.patch(
      `/cv/${cvId}/educations/${educationId}`,
      data
    );

    await this.saveEducations({ entity: education, schema: EducationSchema });
  }

  @Action
  public async deleteEducation(
    deleteEducationDto: DeleteEducationDto
  ): Promise<void> {
    await Api.delete(
      `/cv/${deleteEducationDto.cvId}/educations/${deleteEducationDto.educationId}`
    );
    this.delete([deleteEducationDto.educationId]);
  }

  @Action
  public async createEducation(
    createEducationDto: CreateEducationDto
  ): Promise<Education> {
    const education: Education = await Api.post(
      `/cv/${createEducationDto.cvId}/educations`,
      createEducationDto
    );
    await this.saveEducations({ entity: education, schema: EducationSchema });

    return education;
  }

  @Action
  private async saveEducations(data: {
    entity: Education | Education[];
    schema: Schema;
  }): Promise<void> {
    const normalizedData = normalize(data.entity, data.schema);
    const { schools, educations } = normalizedData.entities;
    SchoolModule.add(R.values(schools || {}));
    this.add(R.values(educations || {}));
  }
}

export default getModule(EducationModule);
