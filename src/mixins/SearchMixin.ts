import * as R from "ramda";
import { Component, Vue } from "vue-property-decorator";
import { namespace } from "vuex-class";
import { CVSearchDto, CVSearchResult } from "@/model/cv";

const CVSearchStore = namespace("CVSearchStore");

@Component
export default class SearchMixin extends Vue {
  searchKey = "Default";

  @CVSearchStore.Getter
  searchingByKey!: (key: string) => boolean;

  @CVSearchStore.Getter
  resultsByKey!: (key: string) => CVSearchResult[];

  @CVSearchStore.Action
  searchCVs!: (cvSearchDto: CVSearchDto) => Promise<void>;

  debounce = 0;

  searchAndDebounce(cvSearchDto: CVSearchDto, debounce = 500): void {
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

  onResultClick(cvSearchResult: CVSearchResult) {
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
