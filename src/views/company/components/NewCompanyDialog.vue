<template>
  <v-card>
    <v-card-title class="headline">New company</v-card-title>

    <v-form ref="form" v-model="valid" lazy-validation @submit.prevent="onSave">
      <v-card-text>
        <v-text-field
          v-model="name"
          :counter="255"
          :rules="nameRules"
          label="Name"
          required
        ></v-text-field>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn color="green darken-1" text @click="onCancel">
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
import { Component, Vue, Prop } from "vue-property-decorator";
import { namespace } from "vuex-class";
import { DialogComponent } from "@/dialog";
import { Company, CreateCompanyDto } from "@/model/work_experience";
import { VForm } from "@/types";

const CompanyStore = namespace("CompanyStore");
const DialogStore = namespace("DialogStore");

@Component
export default class NewCompanyDialog extends Vue {
  @Prop({ required: true }) readonly afterCreate!: (
    company: Company
  ) => Promise<void>;

  valid = false;
  name = "";
  nameRules = [(v: string) => !!v || "Name is required"];

  @CompanyStore.Action
  createCompany!: (createCompanyDto: CreateCompanyDto) => Promise<Company>;

  @DialogStore.Mutation
  popDialogComponent!: () => void;

  @DialogStore.Mutation
  pushDialogComponent!: (dialogComponent: DialogComponent) => void;

  get form(): VForm {
    return this.$refs.form as VForm;
  }

  async onSave(): Promise<void> {
    if (this.form.validate()) {
      const company = await this.createCompany({
        name: this.name
      });

      await this.afterCreate(company);
      this.popDialogComponent();
    }
  }

  async onCancel() {
    this.popDialogComponent();
  }
}
</script>
