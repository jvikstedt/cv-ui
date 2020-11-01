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

export interface User {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  jobTitle: string;
  phone: string;
  location: string;
  workExperienceInYears: number;
  email: string;
  avatarId: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new schema.Entity("users");

@Module({
  dynamic: true,
  namespaced: true,
  name: "user",
  store,
})
class UserModule extends VuexModule {
  fetching = false;
  byId: { [key: number]: User } = {};
  allIds: number[] = [];

  get find() {
    return (id: number): User | undefined => {
      return this.byId[id];
    };
  }

  get list(): User[] {
    return R.reject(
      R.isNil,
      R.map((id) => this.find(id), this.allIds)
    ) as User[];
  }

  @Mutation
  public add(users: User[]): void {
    for (const user of users) {
      Vue.set(this.byId, user.id, user);

      if (this.allIds.includes(user.id)) continue;
      this.allIds = [...this.allIds, user.id];
    }
  }

  @Mutation
  public delete(ids: number[]): void {
    for (const id of ids) {
      const user = this.byId[id];
      if (user) {
        Vue.delete(this.byId, id);
        this.allIds = R.reject((userId) => R.equals(userId, id), this.allIds);
      }
    }
  }

  @MutationAction({ mutate: ["fetching"] })
  async setFetching(fetching: boolean) {
    return { fetching };
  }

  @Action
  public async saveUsers(data: User[]): Promise<void> {
    const normalizedData = normalize(data, [UserSchema]);
    const { users } = normalizedData.entities;
    this.add(R.values(users || {}));
  }
}

export default getModule(UserModule);
