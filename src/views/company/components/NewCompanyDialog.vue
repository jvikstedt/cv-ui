<template>
  <v-card>
    <v-card-title class="headline">New company</v-card-title>

    <v-form ref="form" v-model="valid" lazy-validation @submit.prevent="onSave">
      <v-card-text>
        <v-text-field
          v-model="name"
          :counter="255"
          :rules="isRequiredRule"
          label="Name"
          required
        ></v-text-field>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn color="red darken-1" text @click="onCancel">
          Cancel
        </v-btn>

        <v-btn color="green darken-1" text type="submit">
          Save
        </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Mixins } from "vue-property-decorator";
import { namespace } from "vuex-class";
import { Company, CreateCompanyDto } from "@/model/company";
import { DialogFormMixin } from "@/mixins";

const CompanyStore = namespace("CompanyStore");

@Component
export default class NewCompanyDialog extends Mixins(DialogFormMixin) {
  @Prop({ required: true }) readonly afterCreate!: (
    company: Company
  ) => Promise<void>;

  name = "";

  @CompanyStore.Action
  createCompany!: (createCompanyDto: CreateCompanyDto) => Promise<Company>;

  async onSave(): Promise<void> {
    if (this.form.validate()) {
      const company = await this.createCompany({
        name: this.name
      });

      await this.afterCreate(company);
      this.popDialogComponent();
    }
  }
}
</script>
