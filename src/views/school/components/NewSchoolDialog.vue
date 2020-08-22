<template>
  <v-card>
    <v-card-title class="headline">New school</v-card-title>

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
import { School, CreateSchoolDto } from "@/model/school";
import { DialogFormMixin } from "@/mixins";

const SchoolStore = namespace("SchoolStore");

@Component
export default class NewSchoolDialog extends Mixins(DialogFormMixin) {
  @Prop({ required: true }) readonly afterCreate!: (
    school: School
  ) => Promise<void>;

  name = "";

  @SchoolStore.Action
  createSchool!: (createSchoolDto: CreateSchoolDto) => Promise<School>;

  async onSave(): Promise<void> {
    if (this.form.validate()) {
      const school = await this.createSchool({
        name: this.name
      });

      await this.afterCreate(school);
      this.popDialogComponent();
    }
  }
}
</script>
