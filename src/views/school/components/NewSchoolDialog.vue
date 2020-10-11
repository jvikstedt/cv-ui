<template>
  <v-card>
    <v-card-title class="headline">New school</v-card-title>

    <v-form ref="form" v-model="valid" lazy-validation @submit.prevent="onSave">
      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn color="red darken-1" text @click="onCancel"> Cancel </v-btn>

        <v-btn color="green darken-1" text type="submit"> Save </v-btn>
      </v-card-actions>
      <v-card-text>
        <v-text-field
          v-model="name"
          :counter="255"
          :rules="isRequiredRule"
          label="Name"
          required
        ></v-text-field>
      </v-card-text>
    </v-form>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Mixins } from "vue-property-decorator";
import { DialogFormMixin } from "@/mixins";
import SchoolModule, { School } from "@/store/modules/school";

@Component
export default class NewSchoolDialog extends Mixins(DialogFormMixin) {
  @Prop({ required: true }) readonly afterCreate!: (
    school: School
  ) => Promise<void>;

  name = "";

  async onSave(): Promise<void> {
    if (this.form.validate()) {
      const school = await SchoolModule.createSchool({
        name: this.name,
      });

      await this.afterCreate(school);
      this.popDialogComponent();
    }
  }
}
</script>
