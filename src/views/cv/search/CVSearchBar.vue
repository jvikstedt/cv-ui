<template>
  <v-autocomplete
    v-model="cv"
    name="searchbar"
    :items="results"
    label="Search by name"
    item-text="fullName"
    return-object
    single-line
    append-outer-icon="mdi-magnify"
    dense
    hide-details
    filled
    :loading="searching"
    :search-input.sync="searchInput"
    @focus="search('')"
    @change="onSelect"
    @click:append-outer="openAdvancedSearch"
    dark
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
import { Component, Watch, Mixins } from "vue-property-decorator";
import { CV, CVSearchDto } from "@/model/cv";
import { CVSearchView } from "@/views/cv/search";
import { SearchMixin, DialogMixin } from "@/mixins";

@Component
export default class CVSearchBar extends Mixins(SearchMixin, DialogMixin) {
  searchKey = "CVSearchBar";

  cv: CV | null = null;
  searchInput = null;

  @Watch("searchInput")
  async searchInputChanged(input: string) {
    await this.search(input);
  }

  async search(input: string) {
    const cvSearchDto = new CVSearchDto({
      key: this.searchKey,
      data: {
        fullName: input || "",
        sorts: [{ field: "updatedAt", order: "desc" }]
      }
    });

    this.searchAndDebounce(cvSearchDto, R.isEmpty(input || "") ? 0 : 350);
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

  openAdvancedSearch() {
    this.pushDialogComponent({
      component: CVSearchView,
      props: {}
    });
  }
}
</script>
