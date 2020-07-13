import * as R from "ramda";
import { VuexModule, Module, Mutation, Action } from "vuex-module-decorators";
import jwt from "jwt-decode";
import Api from "@/api/api";
import { TokenData, AuthCredentialsDto } from "@/model/user";

const getUserFromLocalStorage = (): TokenData => {
  const accessToken = localStorage.getItem("accessToken");
  if (accessToken) {
    return jwt(accessToken);
  }
  return new TokenData();
};

@Module({ namespaced: true })
export class AuthStore extends VuexModule {
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

  get canEditCV() {
    return (cvId: number): boolean => R.includes(cvId, this.user.cvIds);
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
    password
  }: AuthCredentialsDto): Promise<void> {
    this.context.commit("setStatus", "loading");
    try {
      const { accessToken } = await Api.post("/auth/signin", {
        username,
        password
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
        idToken
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
