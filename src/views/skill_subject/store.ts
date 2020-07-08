import Vue from "vue";
import { VuexModule, Module, Mutation, Action } from "vuex-module-decorators";
import Api from "@/api/api";
import { SkillSubject, CreateSkillSubjectDto } from "@/model/skill";

@Module({ namespaced: true })
export class SkillSubjectStore extends VuexModule {
  public skillSubjects: { [key: number]: SkillSubject } = {};
  public fetching = false;

  get getSkillSubjects() {
    return Object.values(this.skillSubjects);
  }

  @Mutation
  public addSkillSubjects(skillSubjects: SkillSubject[]): void {
    for (const skillSubject of skillSubjects) {
      Vue.set(this.skillSubjects, skillSubject.id, skillSubject);
    }
  }

  @Mutation
  public deleteSkillSubjects(ids: number[]): void {
    for (const id of ids) {
      Vue.delete(this.skillSubjects, id);
    }
  }

  @Mutation
  public setFetching(fetching: boolean): void {
    this.fetching = fetching;
  }

  @Action
  public async fetchSkillSubjects(): Promise<void> {
    this.context.commit("setFetching", true);

    const skillSubjects: SkillSubject[] = await Api.get("/skill_subjects");
    this.context.commit("addSkillSubjects", skillSubjects);

    this.context.commit("setFetching", false);
  }

  @Action
  public async deleteSkillSubject(id: number): Promise<void> {
    await Api.delete(`/skill_subjects/${id}`);
    this.context.commit("deleteSkillSubjects", [id]);
  }

  @Action
  public async createSkillSubject(
    createSkillSubjectDto: CreateSkillSubjectDto
  ): Promise<SkillSubject> {
    const skillSubject: SkillSubject = await Api.post(
      "/skill_subjects",
      createSkillSubjectDto
    );
    this.context.commit("addSkillSubjects", [skillSubject]);

    return skillSubject;
  }
}
