import * as R from "ramda";
import {
  VuexModule,
  Module,
  Mutation,
  Action,
  getModule,
} from "vuex-module-decorators";
import jwt from "jwt-decode";
import Api from "@/api/api";
import store from "@/store";

export const ADMIN_ROLE = "ADMIN";

export class TokenData {
  cvIds!: number[];
  firstName!: string;
  lastName!: string;
  userId!: number;
  templateIds!: number[];
  username!: string;
  roles!: string[];
}

export class AuthCredentialsDto {
  username!: string;
  password!: string;
}

const getUserFromLocalStorage = (): TokenData => {
  const accessToken = localStorage.getItem("accessToken");
  if (accessToken) {
    return jwt(accessToken);
  }
  return new TokenData();
};

@Module({
  dynamic: true,
  namespaced: true,
  name: "auth",
  store,
})
class AuthModule extends VuexModule {
  public accessToken = localStorage.getItem("accessToken") || "";
  public tokenData = getUserFromLocalStorage();
  public status = "";

  get isLoggedIn(): boolean {
    return !!this.accessToken;
  }

  get authStatus(): string {
    return this.status;
  }

  get user(): TokenData {
    return this.tokenData;
  }

  get hasRole() {
    return (role: string): boolean => R.includes(role, this.user.roles);
  }

  get canEditCV() {
    return (cvId: number): boolean =>
      R.includes(cvId, this.user.cvIds) ||
      R.includes(ADMIN_ROLE, this.user.roles);
  }

  @Mutation
  public authSuccess(accessToken: string): void {
    this.accessToken = accessToken;
    this.status = "success";
    this.tokenData = jwt(accessToken);
  }

  @Mutation
  public authFailed(): void {
    this.status = "error";
  }

  @Mutation
  public logout(): void {
    this.accessToken = "";
    this.tokenData = new TokenData();
    this.status = "";
  }

  @Mutation
  public setStatus(status: string): void {
    this.status = status;
  }

  @Action
  public async signIn({
    username,
    password,
  }: AuthCredentialsDto): Promise<void> {
    this.context.commit("setStatus", "loading");
    try {
      const { accessToken } = await Api.post("/auth/signin", {
        username,
        password,
      });
      localStorage.setItem("accessToken", accessToken);
      this.context.commit("authSuccess", accessToken);
    } catch (err) {
      localStorage.removeItem("accessToken");
      this.context.commit("authFailed");
    }
  }

  @Action
  public async googleSignIn(idToken: string): Promise<void> {
    this.context.commit("setStatus", "loading");
    try {
      const { accessToken } = await Api.post("/auth/google/signin", {
        idToken,
      });
      localStorage.setItem("accessToken", accessToken);
      this.context.commit("authSuccess", accessToken);
    } catch (err) {
      localStorage.removeItem("accessToken");
      this.context.commit("authFailed");
    }
  }

  @Action
  public async logoutAction(): Promise<void> {
    localStorage.removeItem("accessToken");
    this.context.commit("logout");
  }
}

export default getModule(AuthModule);
