import * as R from "ramda";
import { Component, Vue } from "vue-property-decorator";
import { CVSearchDto, CVSearchResult } from "@/store/modules/cv";
import SearchModule from "@/store/modules/search";

@Component
export default class SearchMixin extends Vue {
  searchKey = "Default";

  debounce = 0;

  searchingByKey = SearchModule.searchingByKey;

  resultsByKey = SearchModule.resultsByKey;

  searchCVs = SearchModule.searchCVs;

  searchAndDebounce(cvSearchDto: CVSearchDto, debounce = 350): void {
    clearTimeout(this.debounce);

    this.debounce = window.setTimeout(async () => {
      await this.searchCVs(cvSearchDto);
    }, debounce);
  }

  get results(): CVSearchResult[] {
    return this.resultsByKey(this.searchKey);
  }

  get searching(): boolean {
    return this.searchingByKey(this.searchKey);
  }

  onResultClick(cvSearchResult: CVSearchResult): void {
    const route = `/cv/${cvSearchResult.id}`;
    if (this.$route.path !== route) {
      this.$router.push(route);
    }
  }

  avatarSrc(cvSearchResult: CVSearchResult): string | null {
    if (cvSearchResult.avatarId) {
      return `/api/files/${cvSearchResult.avatarId}`;
    }
    return null;
  }

  initials(cvSearchResult: CVSearchResult): string {
    return R.toUpper(
      R.join(
        "",
        R.map((name: string) => name[0], R.split(" ", cvSearchResult.fullName))
      )
    );
  }
}
