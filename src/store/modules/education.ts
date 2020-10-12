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
import SchoolModule, { School } from "@/store/modules/school";

export interface Education {
  id: number;
  degree: string;
  fieldOfStudy: string;
  description: string;
  startYear: number;
  endYear?: number | null;
  highlight: boolean;
  cvId: number;
  school: School;
  schoolId: number;
  createdAt: Date;
  updatedAt: Date;
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

  @Action
  public resetCV(cvId: number): void {
    this.delete(this.cvEducationIds[cvId] || []);
  }

  @MutationAction({ mutate: ["fetching"] })
  async setFetching(fetching: boolean) {
    return { fetching };
  }

  @Action
  public async saveEducations(data: Education[]): Promise<void> {
    const normalizedData = normalize(data, [EducationSchema]);
    const { schools, educations } = normalizedData.entities;
    SchoolModule.add(R.values(schools || {}));
    this.add(R.values(educations || {}));
  }
}

export default getModule(EducationModule);
