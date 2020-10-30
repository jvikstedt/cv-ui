<template>
  <v-card :loading="fetching">
    <template v-if="!fetching && school">
      <v-card-title class="headline">{{ school.name }}</v-card-title>
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
import SchoolModule, { School } from "@/store/modules/school";
import { ServiceManager, SchoolService } from "@/services";
import AuthModule from "@/store/modules/auth";

@Component
export default class EditSchoolDialog extends Mixins(DialogFormMixin) {
  @Prop({ required: true }) readonly school!: School;
  @Prop({ required: false }) readonly afterSave!: (
    school: School
  ) => Promise<void>;
  name = "";

  canEdit = AuthModule.hasRole("ADMIN");

  get fetching(): boolean {
    return SchoolModule.fetching;
  }

  async created(): Promise<void> {
    this.name = this.school.name;
  }

  async onSave(): Promise<void> {
    if (this.form.validate()) {
      const patchSchoolDto: SchoolService.PatchSchoolDto = {
        schoolId: this.school.id,
        data: {
          name: this.name,
        },
      };
      const school = await ServiceManager.school.patchSchool(patchSchoolDto);

      if (this.afterSave) {
        await this.afterSave(school);
      }
      this.popDialogComponent();
    }
  }
}
</script>
