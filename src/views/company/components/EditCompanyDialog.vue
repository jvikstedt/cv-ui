<template>
  <v-card :loading="fetching">
    <template v-if="!fetching && company">
      <v-card-title class="headline">{{ company.name }}</v-card-title>
      <v-form
        ref="form"
        v-model="valid"
        lazy-validation
        :readonly="!canEdit"
        @submit.prevent="onSave"
      >
        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="red darken-1" text @click="onCancel"> Cancel </v-btn>

          <v-btn color="green darken-1" :disabled="!canEdit" text type="submit">
            Save
          </v-btn>
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
    </template>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Mixins } from "vue-property-decorator";
import { DialogFormMixin } from "@/mixins";
import CompanyModule, { Company } from "@/store/modules/company";
import { ServiceManager, CompanyService } from "@/services";
import AuthModule from "@/store/modules/auth";

@Component
export default class EditCompanyDialog extends Mixins(DialogFormMixin) {
  @Prop({ required: true }) readonly company!: Company;
  @Prop({ required: false }) readonly afterSave!: (
    company: Company
  ) => Promise<void>;
  name = "";

  canEdit = AuthModule.hasRole("ADMIN");

  get fetching(): boolean {
    return CompanyModule.fetching;
  }

  async created(): Promise<void> {
    this.name = this.company.name;
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
