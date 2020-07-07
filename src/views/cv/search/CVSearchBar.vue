<template>
  <v-autocomplete
    v-model="cv"
    :items="results"
    label="Search"
    item-text="fullName"
    return-object
    single-line
    prepend-icon="mdi-magnify"
    dense
    hide-details
    filled
    :loading="searching"
    :search-input.sync="searchInput"
    @change="onSelect"
  >
    <template v-slot:item="data">
      <v-list-item-avatar>
        <img :src="'/api/files/' + data.item.avatarId" />
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
import { Component, Vue, Watch } from "vue-property-decorator";
import { namespace } from "vuex-class";
import { CV, CVSearchResult, CVSearchDto } from "@/model/cv";

const CVSearchStore = namespace("CVSearchStore");

@Component
export default class CVSearchBar extends Vue {
  private cv: CV | null = null;
  private searchInput = "";
  private debounce = 0;

  @CVSearchStore.State
  public searching!: boolean;

  @CVSearchStore.State
  public results!: CVSearchResult[];

  @CVSearchStore.Action
  public searchCVs!: (cvSearchDto: CVSearchDto) => Promise<void>;

  @Watch("searchInput")
  async searchInputChanged(input: string) {
    clearTimeout(this.debounce);

    this.debounce = window.setTimeout(async () => {
      const cvSearchDto = new CVSearchDto({ fullName: input || "" });
      await this.searchCVs(cvSearchDto);
    }, 500);
  }

  private async onSelect(cv: CV) {
    this.$nextTick(() => {
      this.cv = null;
    });
    const route = `/cv/${cv.id}`;
    if (this.$route.path !== route) {
      this.$router.push(route);
    }
  }
}
</script>
