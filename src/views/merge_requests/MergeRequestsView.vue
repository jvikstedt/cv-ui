<template>
  <v-container style="max-width: 1024px">
    <v-card>
      <v-card-title class="headline">
        <v-icon left>mdi-merge</v-icon>
        Merge requests
        <v-spacer></v-spacer>
      </v-card-title>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="mergeRequests"
          :options.sync="options"
          :loading="fetching"
          :server-items-length="itemsTotal"
          class="elevation-1"
          :footer-props="{
            ['items-per-page-options']: [5, 10, 15],
          }"
        >
          <template v-slot:[`item.createdAt`]="{ item }">
            {{ formatDateTime(item.createdAt) }}
          </template>
          <template v-slot:[`item.actions`]="{ item }">
            <v-icon small class="mr-2" @click="reviewItem(item)">
              mdi-note-text-outline
            </v-icon>

            <v-icon
              v-if="item.state === 'pending'"
              small
              class="mr-2"
              @click="deleteItem(item)"
            >
              mdi-delete
            </v-icon>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import * as R from "ramda";
import { Component, Vue, Watch } from "vue-property-decorator";
import MergeRequestModule, {
  MergeRequest,
} from "@/store/modules/merge_request";
import { ServiceManager } from "@/services";
import { DataOptions } from "vuetify";
import { FormatDateTime } from "@/helpers";
import DialogModule from "@/store/modules/dialog";
import ReviewMergeRequestDialog from "./components/ReviewMergeRequestDialog.vue";

@Component
export default class CompanyListView extends Vue {
  fetching = MergeRequestModule.fetching;
  mergeRequests: MergeRequest[] = [];
  mergeRequest: MergeRequest | null = null;
  search = "";

  formatDateTime = FormatDateTime;

  options: DataOptions | Partial<DataOptions> = {
    sortBy: ["mergeRequest.createdAt"],
    sortDesc: [true],
  };

  itemsTotal = 0;
  headers = [
    { text: "State", value: "state" },
    { text: "Entity", value: "entity" },
    { text: "Source", value: "sourceName" },
    { text: "Target", value: "targetName" },
    { text: "Creator", value: "user.username" },
    { text: "Created at", value: "createdAt" },
    { text: "Actions", value: "actions", sortable: false },
  ];

  @Watch("search")
  async searchChanged(): Promise<void> {
    this.options = {
      ...this.options,
      page: 1,
    };
  }

  @Watch("options", { deep: true })
  async optionsChanged(): Promise<void> {
    const sortDesc = this.options.sortDesc || [];
    const page = this.options.page || 1;
    const itemsPerPage = this.options.itemsPerPage || 10;

    const orderColumnName = "mergeRequest.createdAt";
    const orderSort = sortDesc[0] ? "DESC" : "ASC";

    const result = await ServiceManager.mergeRequest.searchMergeRequests({
      skip: (page - 1) * itemsPerPage,
      take: itemsPerPage,
      orderColumnName,
      orderSort,
    });

    this.mergeRequests = result.items;
    this.itemsTotal = result.total;
  }

  updateMergeRequest(mergeRequest: MergeRequest): void {
    this.mergeRequests = R.map((s) => {
      if (R.equals(s.id, mergeRequest.id)) {
        return mergeRequest;
      }
      return s;
    }, this.mergeRequests);
  }

  async reviewItem(mergeRequest: MergeRequest): Promise<void> {
    DialogModule.pushDialogComponent({
      component: ReviewMergeRequestDialog,
      props: {
        mergeRequest,
        afterUpdate: this.updateMergeRequest,
      },
    });
  }

  async deleteItem(mergeRequest: MergeRequest): Promise<void> {
    if (confirm("Are you sure you want to delete?")) {
      const deletedMergeRequest = await ServiceManager.mergeRequest.deleteMergeRequest(
        mergeRequest.id
      );

      this.updateMergeRequest(deletedMergeRequest);
    }
  }
}
</script>
