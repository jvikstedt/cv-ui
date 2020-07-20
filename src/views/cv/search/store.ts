import Vue from "vue";
import { VuexModule, Module, Mutation, Action } from "vuex-module-decorators";
import Api from "@/api/api";
import { CVSearchResult, CVSearchDtoData, CVSearchDto } from "@/model/cv";

class CVSearchResultContainer {
  key!: string;
  results: CVSearchResult[] = [];
}

class CVSearchingContainer {
  key!: string;
  searching = false;
}

@Module({ namespaced: true })
export class CVSearchStore extends VuexModule {
  public results: { [key: string]: CVSearchResult[] } = {};
  public searching: { [key: string]: boolean } = {};

  public searchData: CVSearchDtoData = new CVSearchDtoData();

  get resultsByKey() {
    return (key: string): CVSearchResult[] => this.results[key] || [];
  }

  get searchingByKey() {
    return (key: string): boolean => this.searching[key] || false;
  }

  @Mutation
  public setResults(container: CVSearchResultContainer): void {
    Vue.set(this.results, container.key, container.results);
  }

  @Mutation
  public setSearching(container: CVSearchingContainer): void {
    Vue.set(this.searching, container.key, container.searching);
  }

  @Mutation
  public setSearchData(searchData: CVSearchDtoData): void {
    this.searchData = searchData;
  }

  @Action
  public async searchCVs(cvSearchDto: CVSearchDto): Promise<void> {
    this.context.commit("setSearching", {
      key: cvSearchDto.key,
      searching: true
    });

    const results: CVSearchResult[] = await Api.post(
      "/cv/search",
      cvSearchDto.data
    );
    this.context.commit("setResults", { key: cvSearchDto.key, results });

    this.context.commit("setSearching", {
      key: cvSearchDto.key,
      searching: false
    });
  }
}
