import { VuexModule, Module, Mutation, Action } from "vuex-module-decorators";
import Api from "@/api/api";
import { CVSearchResult, CVSearchDto } from "@/model/cv";

@Module({ namespaced: true })
export class CVSearchStore extends VuexModule {
  public results: CVSearchResult[] = [];
  public searching = false;

  @Mutation
  public setResults(results: CVSearchResult[]): void {
    this.results = results;
  }

  @Mutation
  public setSearching(searching: boolean): void {
    this.searching = searching;
  }

  @Action
  public async searchCVs(cvSearchDto: CVSearchDto): Promise<void> {
    this.context.commit("setSearching", true);

    const results: CVSearchResult[] = await Api.post("/cv/search", cvSearchDto);
    this.context.commit("setResults", results);

    this.context.commit("setSearching", false);
  }
}
