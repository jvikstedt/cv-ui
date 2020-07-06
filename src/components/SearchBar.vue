<template>
  <v-autocomplete
    v-model="cv"
    :items="cvs"
    label="Search"
    item-text="fullName"
    return-object
    single-line
    prepend-icon="mdi-magnify"
    dense
    hide-details
    filled
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
import CV from "@/store/CV";
import { SearchCVs, SearchCVDto } from "@/api/cv";

@Component
export default class SearchBar extends Vue {
  private cv: CV | null = null;
  private cvs: CV[] = [];
  private searchInput = "";
  private debounce = 0;

  @Watch("searchInput")
  async searchInputChanged(input: string) {
    clearTimeout(this.debounce);

    this.debounce = window.setTimeout(async () => {
      const searchCVDto = new SearchCVDto({ fullName: input || "" });
      this.cvs = await SearchCVs(searchCVDto);
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
