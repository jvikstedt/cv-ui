<template>
  <v-card :loading="fetching">
    <template v-if="!fetching && company">
      <v-card-title class="headline">{{ company.name }}</v-card-title>
      <v-form
        ref="form"
        v-model="valid"
        lazy-validation
        @submit.prevent="onSave"
      >
        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="red darken-1" text @click="onCancel"> Cancel </v-btn>

          <v-btn color="green darken-1" text type="submit"> Save </v-btn>
        </v-card-actions>
        <v-card-text>
          <v-text-field
            name="name"
            v-model="name"
            :counter="255"
            :rules="isRequiredRule"
            label="Name"
            required
          ></v-text-field>
        </v-card-text>
      </v-form>

      <v-card-text>
        <h2>People who worked in this company</h2>
        <v-list class="mt-2">
          <template v-if="results.length">
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
                </v-list-item-content>
              </v-list-item>
            </template>
          </template>
          <p v-else>No people</p>
        </v-list>
      </v-card-text>

      <ProjectList :companyId="company.id" />
    </template>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Mixins } from "vue-property-decorator";
import { DialogFormMixin, SearchMixin } from "@/mixins";
import CompanyModule, { Company } from "@/store/modules/company";
import { ServiceManager, CompanyService } from "@/services";
import AuthModule from "@/store/modules/auth";
import ProjectList from "@/views/project/components/ProjectList.vue";
import { CVSearchDto } from "@/store/modules/cv";

@Component({
  components: {
    ProjectList,
  },
})
export default class EditCompanyDialog extends Mixins(
  SearchMixin,
  DialogFormMixin
) {
  @Prop({ required: true }) readonly company!: Company;
  @Prop({ required: false }) readonly afterSave!: (
    company: Company
  ) => Promise<void>;
  searchKey = "WorkExperienceSearchKey";
  name = "";

  canEdit = AuthModule.hasRole("ADMIN");

  get fetching(): boolean {
    return CompanyModule.fetching;
  }

  async created(): Promise<void> {
    this.name = this.company.name;

    const cvSearchDto = new CVSearchDto({
      key: this.searchKey,
      data: {
        workExperiences: [{ required: true, companyId: this.company.id }],
        limit: 5,
      },
    });
    await this.searchCVs(cvSearchDto);
  }

  async onSave(): Promise<void> {
    if (this.form.validate()) {
      const patchCompanyDto: CompanyService.PatchCompanyDto = {
        companyId: this.company.id,
        data: {
          name: this.name,
        },
      };
      const company = await ServiceManager.company.patchCompany(
        patchCompanyDto
      );

      if (this.afterSave) {
        await this.afterSave(company);
      }
      this.popDialogComponent();
    }
  }
}
</script>
