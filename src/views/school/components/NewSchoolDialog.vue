<template>
  <v-card>
    <v-card-title class="headline">New school</v-card-title>

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
import { School, CreateSchoolDto } from "@/model/education";
import { VForm } from "@/types";

const SchoolStore = namespace("SchoolStore");
const DialogStore = namespace("DialogStore");

@Component
export default class NewSchoolDialog extends Vue {
  @Prop({ required: true }) readonly afterCreate!: (
    School: School
  ) => Promise<void>;

  valid = false;
  name = "";
  nameRules = [(v: string) => !!v || "Name is required"];

  @SchoolStore.Action
  createSchool!: (createSchoolDto: CreateSchoolDto) => Promise<School>;

  @DialogStore.Mutation
  popDialogComponent!: () => void;

  @DialogStore.Mutation
  pushDialogComponent!: (dialogComponent: DialogComponent) => void;

  get form(): VForm {
    return this.$refs.form as VForm;
  }

  async onSave(): Promise<void> {
    if (this.form.validate()) {
      const school = await this.createSchool({
        name: this.name
      });

      await this.afterCreate(school);
      this.popDialogComponent();
    }
  }

  async onCancel() {
    this.popDialogComponent();
  }
}
</script>
