<template>
  <v-container style="max-width: 1024px">
    <v-card>
      <v-card-title class="headline">
        <v-icon left>mdi-domain</v-icon>
        Companies
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
      </v-card-title>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="newCompanyDialog"> New </v-btn>
      </v-card-actions>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="companies"
          :options.sync="options"
          :loading="fetching"
          :server-items-length="itemsTotal"
          class="elevation-1"
          :footer-props="{
            ['items-per-page-options']: [5, 10, 15],
          }"
        >
          <template v-slot:[`item.actions`]="{ item }">
            <v-icon small class="mr-2" @click="editItem(item)">
              mdi-pencil
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
import NewCompanyDialog from "./components/NewCompanyDialog.vue";
import CompanyModule, { Company } from "@/store/modules/company";
import EditCompanyDialog from "./components/EditCompanyDialog.vue";
import DialogModule from "@/store/modules/dialog";
import { ServiceManager } from "@/services";
import { DataOptions } from "vuetify";

@Component
export default class CompanyListView extends Vue {
  fetching = CompanyModule.fetching;
  companies: Company[] = [];
  company: Company | null = null;
  search = "";

  options: DataOptions | Partial<DataOptions> = {
    sortBy: ["name"],
    sortDesc: [false],
  };

  itemsTotal = 0;
  headers = [
    { text: "Name", value: "name" },
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

    const orderColumnName = "company.name";
    const orderSort = sortDesc[0] ? "DESC" : "ASC";

    const result = await ServiceManager.company.searchCompanies({
      skip: (page - 1) * itemsPerPage,
      take: itemsPerPage,
      orderColumnName,
      orderSort,
      name: this.search,
    });

    this.companies = result.items;
    this.itemsTotal = result.total;
  }

  async afterCreate(company: Company): Promise<void> {
    this.companies = [company, ...this.companies];
  }

  async afterSave(company: Company): Promise<void> {
    this.companies = R.map((s) => {
      if (R.equals(s.id, company.id)) {
        return company;
      }
      return s;
    }, this.companies);
  }

  async afterDelete(company: Company): Promise<void> {
    this.companies = R.reject(
      (s) => R.equals(s.id, company.id),
      this.companies
    );
  }

  newCompanyDialog(): void {
    DialogModule.pushDialogComponent({
      component: NewCompanyDialog,
      props: { afterCreate: this.afterCreate },
    });
  }

  editItem(company: Company): void {
    DialogModule.pushDialogComponent({
      component: EditCompanyDialog,
      props: {
        company: company,
        afterSave: this.afterSave,
        afterDelete: this.afterDelete,
      },
    });
  }
}
</script>
