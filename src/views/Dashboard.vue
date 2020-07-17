<template>
  <v-container class="grey" style="max-width: 1024px" fluid>
    <v-row>
      <v-col sm="6">
        <v-btn color="primary" @click="openMyCV">
          My CV
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
                <v-img v-if="avatarSrc(item)" :src="avatarSrc(item)"></v-img>
                <span v-else class="white--text headline">{{
                  initials(item)
                }}</span>
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title v-html="item.fullName"></v-list-item-title>
                <v-list-item-subtitle>
                  {{ item.updatedAt }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </template>
        </template>
        <p v-else>No results!</p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import { namespace } from "vuex-class";
import { CVSearchDto } from "@/model/cv";
import { TokenData } from "@/model/user";
import { SearchMixin } from "@/mixins";

const AuthStore = namespace("AuthStore");

@Component
export default class Dashboard extends Mixins(SearchMixin) {
  searchKey = "Dashboard";

  @AuthStore.Getter
  user!: TokenData;

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
}
</script>
