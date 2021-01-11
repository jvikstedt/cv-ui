<template>
  <v-container style="max-width: 1024px">
    <v-card>
      <v-card-title class="headline">
        <v-icon left>mdi-merge</v-icon>
        Background jobs
        <v-spacer></v-spacer>
      </v-card-title>
      <v-card-text>
        <p>
          List of jobs created by you. Users with admin role can approve jobs.
        </p>
        <v-checkbox v-model="showAll" label="Show all" />
        <v-data-table
          :headers="headers"
          :items="jobs"
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
import JobModule, { Job } from "@/store/modules/job";
import { ServiceManager } from "@/services";
import { DataOptions } from "vuetify";
import { FormatDateTime } from "@/helpers";
import DialogModule from "@/store/modules/dialog";
import ReviewJobDialog from "./components/ReviewJobDialog.vue";

@Component
export default class CompanyListView extends Vue {
  fetching = JobModule.fetching;
  jobs: Job[] = [];
  job: Job | null = null;
  search = "";

  showAll = false;

  searchItems: Job[] = [];
  searchItemsTotal = 0;

  formatDateTime = FormatDateTime;

  options: DataOptions | Partial<DataOptions> = {
    sortBy: ["job.createdAt"],
    sortDesc: [true],
  };

  itemsTotal = 0;
  headers = [
    { text: "State", value: "state" },
    { text: "Runner", value: "runner" },
    { text: "Description", value: "description" },
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

  @Watch("searchItems")
  @Watch("showAll")
  async searchItemsChanged(): Promise<void> {
    if (this.showAll) {
      this.jobs = this.searchItems;
      this.itemsTotal = this.searchItemsTotal;
    } else {
      const items = R.filter(
        (i) => R.equals(i.state, "pending"),
        this.searchItems
      );
      this.jobs = items;
      this.itemsTotal = R.length(items);
    }
  }

  @Watch("options", { deep: true })
  async optionsChanged(): Promise<void> {
    const sortDesc = this.options.sortDesc || [];
    const page = this.options.page || 1;
    const itemsPerPage = this.options.itemsPerPage || 10;

    const orderColumnName = "job.createdAt";
    const orderSort = sortDesc[0] ? "DESC" : "ASC";

    const result = await ServiceManager.job.searchJobs({
      skip: (page - 1) * itemsPerPage,
      take: itemsPerPage,
      orderColumnName,
      orderSort,
    });

    this.searchItems = result.items;
    this.searchItemsTotal = result.total;
  }

  updateJob(job: Job): void {
    this.jobs = R.map((s) => {
      if (R.equals(s.id, job.id)) {
        return job;
      }
      return s;
    }, this.jobs);
  }

  async reviewItem(job: Job): Promise<void> {
    DialogModule.pushDialogComponent({
      component: ReviewJobDialog,
      props: {
        job,
        afterUpdate: this.updateJob,
      },
    });
  }

  async deleteItem(job: Job): Promise<void> {
    if (confirm("Are you sure you want to delete?")) {
      const deletedJob = await ServiceManager.job.deleteJob(job.id);

      this.updateJob(deletedJob);
    }
  }
}
</script>
