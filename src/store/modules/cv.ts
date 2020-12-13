import * as R from "ramda";
import Vue from "vue";
import {
  VuexModule,
  Module,
  Mutation,
  Action,
  getModule,
  MutationAction,
} from "vuex-module-decorators";
import store from "@/store";
import { normalize, schema } from "normalizr";
import UserModule, { User } from "@/store/modules/user";

export interface CV {
  id: number;
  description: string;
  user: User;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
}

export class CVSearchDtoSkill {
  required? = false;
  skillSubjectId!: number;
  name?: string;
}

export class CVSearchDtoWorkExperience {
  required? = false;
  companyId!: number;
}

export class CVSearchDtoEducation {
  required? = false;
  schoolId!: number;
}

export class CVSearchDtoProjectMembership {
  required? = false;
  projectId!: number;
}

export class Sort {
  field!: string;
  order?: string;
}

export class CVSearchDtoData {
  fullName?: string = "";
  text?: string = "";
  limit?: number = 10;
  skills?: CVSearchDtoSkill[] = [];
  workExperiences?: CVSearchDtoWorkExperience[] = [];
  educations?: CVSearchDtoEducation[] = [];
  projectMemberships?: CVSearchDtoProjectMembership[] = [];
  sorts?: Sort[];

  public constructor(init?: Partial<CVSearchDto>) {
    Object.assign(this, init);
  }
}

export class CVSearchDto {
  key!: string;
  data!: CVSearchDtoData;

  public constructor(init?: Partial<CVSearchDto>) {
    Object.assign(this, init);
  }
}

export class CVSearchResultSkill {
  skillSubjectId!: number;
  experienceInYears!: number;
  interestLevel!: number;
  highlight!: boolean;
  name!: string;
}

export class CVSearchResult {
  id!: number;
  description!: string;
  userId!: number;
  username!: string;
  avatarId!: string;
  fullName!: string;
  skills!: CVSearchResultSkill[];
}

const UserSchema = new schema.Entity("users");

const CVSchema = new schema.Entity("cvs", {
  user: UserSchema,
});

@Module({
  dynamic: true,
  namespaced: true,
  name: "cv",
  store,
})
class CVModule extends VuexModule {
  fetching = false;
  byId: { [key: number]: CV } = {};
  allIds: number[] = [];

  get find() {
    return (id: number): CV | undefined => {
      const cv = this.byId[id];
      if (!cv) {
        return undefined;
      }

      const user = UserModule.find(cv.userId);
      if (!user) {
        return undefined;
      }

      return {
        ...cv,
        user,
      };
    };
  }

  get list(): CV[] {
    return R.reject(
      R.isNil,
      R.map((id) => this.find(id), this.allIds)
    ) as CV[];
  }

  @Mutation
  public add(cvs: CV[]): void {
    for (const cv of cvs) {
      Vue.set(this.byId, cv.id, cv);

      if (this.allIds.includes(cv.id)) continue;
      this.allIds = [...this.allIds, cv.id];
    }
  }

  @Mutation
  public delete(ids: number[]): void {
    for (const id of ids) {
      const cv = this.byId[id];
      if (cv) {
        Vue.delete(this.byId, id);
        this.allIds = R.reject((cvId) => R.equals(cvId, id), this.allIds);
      }
    }
  }

  @MutationAction({ mutate: ["fetching"] })
  async setFetching(fetching: boolean) {
    return { fetching };
  }

  @Action
  public async saveCVs(data: CV[]): Promise<void> {
    const normalizedData = normalize(data, [CVSchema]);
    const { users, cvs } = normalizedData.entities;
    UserModule.add(R.values(users || {}));
    this.add(R.values(cvs || {}));
  }
}

export default getModule(CVModule);
