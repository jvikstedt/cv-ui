<template>
  <v-container style="max-width: 1024px">
    <v-card color="grey lighten-1">
      <v-card-title class="headline">Dashboard</v-card-title>
      <v-card-text>
        <v-row>
          <v-col sm="6">
            <v-btn color="primary" @click="openMyCV" class="ma-2">
              My CV
            </v-btn>
            <v-btn color="primary" outlined @click="search" class="ma-2">
              Advanced Search
            </v-btn>
          </v-col>
          <v-col sm="6">
            <h3>Recently updated:</h3>
            <template v-if="searching">
              <v-progress-circular
                indeterminate
                color="primary"
              ></v-progress-circular>
            </template>
            <template v-else-if="results.length">
              <template v-for="item in results">
                <v-list-item :key="item.id" @click="onResultClick(item)">
                  <v-list-item-avatar tile size="50" color="indigo">
                    <v-img
                      v-if="avatarSrc(item)"
                      :src="avatarSrc(item)"
                    ></v-img>
                    <span v-else class="white--text headline">{{
                      initials(item)
                    }}</span>
                  </v-list-item-avatar>

                  <v-list-item-content>
                    <v-list-item-title
                      v-html="item.fullName"
                    ></v-list-item-title>
                    <v-list-item-subtitle>
                      {{ formatDateTime(item.updatedAt) }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </template>
            </template>
            <p v-else>No results!</p>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import { namespace } from "vuex-class";
import { DialogComponent } from "@/dialog";
import { CVSearchDto } from "@/model/cv";
import { TokenData } from "@/model/user";
import { SearchMixin } from "@/mixins";
import { CVSearchView } from "@/views/cv/search";
import { FormatDateTime } from "@/helpers";

const AuthStore = namespace("AuthStore");
const DialogStore = namespace("DialogStore");

@Component
export default class Dashboard extends Mixins(SearchMixin) {
  searchKey = "Dashboard";

  @AuthStore.Getter
  user!: TokenData;

  formatDateTime = FormatDateTime;

  @DialogStore.Mutation
  pushDialogComponent!: (dialogComponent: DialogComponent) => void;

  async created() {
    const cvSearchDto = new CVSearchDto({
      key: this.searchKey,
      data: {
        sorts: [{ field: "updatedAt", order: "desc" }]
      }
    });
    await this.searchCVs(cvSearchDto);
  }

  async openMyCV() {
    const cvId = this.user.cvIds[0];
    this.$router.push(`/cv/${cvId}`);
  }

  search() {
    this.pushDialogComponent({
      component: CVSearchView,
      props: {}
    });
  }
}
</script>
