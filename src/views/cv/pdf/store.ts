import { VuexModule, Module, Mutation, Action } from "vuex-module-decorators";
import Api from "@/api/api";
import { CV, Skill, CVExportData } from "@/model";

@Module({ namespaced: true })
export class CVPDFStore extends VuexModule {
  public cvData: CVExportData = new CVExportData();
  public fetching = false;

  @Mutation
  public setCVData(cvData: CVExportData): void {
    this.cvData = cvData;
  }

  @Mutation
  public setFetching(fetching: boolean): void {
    this.fetching = fetching;
  }

  @Action
  public async fetchCV(id: number): Promise<void> {
    this.context.commit("setFetching", true);

    const cv: CV = await Api.get(`/cv/${id}`);
    const skills: Skill[] = await Api.get(`/cv/${id}/skills`);

    const cvData: CVExportData = {
      ...cv,
      skills
    };

    this.context.commit("setCVData", cvData);

    this.context.commit("setFetching", false);
  }

  @Action
  public async setCVDataAction(cvData: CVExportData): Promise<void> {
    this.context.commit("setCVData", cvData);
  }
}
