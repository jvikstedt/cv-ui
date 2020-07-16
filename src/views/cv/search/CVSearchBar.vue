<template>
  <v-autocomplete
    v-model="cv"
    :items="results"
    label="Search"
    item-text="fullName"
    return-object
    single-line
    append-outer-icon="mdi-magnify"
    dense
    hide-details
    filled
    :loading="searching"
    :search-input.sync="searchInput"
    @focus="search('', 0)"
    @change="onSelect"
    @click:append-outer="advancedSearch"
  >
    <template v-slot:item="data">
      <v-list-item-avatar tile size="50" color="indigo">
        <v-img v-if="avatarSrc(data.item)" :src="avatarSrc(data.item)"></v-img>
        <span v-else class="white--text headline">{{
          initials(data.item)
        }}</span>
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title v-html="data.item.fullName"></v-list-item-title>
        <!-- <v-list-item-subtitle
          v-html="data.item.description"
          ></v-list-item-subtitle> -->
      </v-list-item-content>
    </template>
  </v-autocomplete>
</template>

<script lang="ts">
import * as R from "ramda";
import { Component, Vue, Watch } from "vue-property-decorator";
import { namespace } from "vuex-class";
import { CV, CVSearchResult, CVSearchDto } from "@/model/cv";
import { DialogComponent } from "@/dialog";
import { CVSearchView } from "@/views/cv/search";

const CVSearchStore = namespace("CVSearchStore");
const DialogStore = namespace("DialogStore");

@Component
export default class CVSearchBar extends Vue {
  cv: CV | null = null;
  searchInput = null;
  debounce = 0;

  @CVSearchStore.Getter
  searchingByKey!: (key: string) => boolean;

  @CVSearchStore.Getter
  resultsByKey!: (key: string) => CVSearchResult[];

  @CVSearchStore.Action
  searchCVs!: (cvSearchDto: CVSearchDto) => Promise<void>;

  @DialogStore.Mutation
  pushDialogComponent!: (dialogComponent: DialogComponent) => void;

  @Watch("searchInput")
  async searchInputChanged(input: string) {
    await this.search(input, 500);
  }

  get results(): CVSearchResult[] {
    return this.resultsByKey("CVSearchBar");
  }

  get searching(): boolean {
    return this.searchingByKey("CVSearchBar");
  }

  async search(input: string, debounce: number) {
    clearTimeout(this.debounce);

    this.debounce = window.setTimeout(async () => {
      const cvSearchDto = new CVSearchDto({
        key: "CVSearchBar",
        data: { fullName: input || "" }
      });
      await this.searchCVs(cvSearchDto);
    }, debounce);
  }

  async onSelect(cv: CV) {
    this.$nextTick(() => {
      this.cv = null;
    });
    const route = `/cv/${cv.id}`;
    if (this.$route.path !== route) {
      this.$router.push(route);
    }
  }

  advancedSearch() {
    this.pushDialogComponent({
      component: CVSearchView,
      props: {}
    });
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
</script>
