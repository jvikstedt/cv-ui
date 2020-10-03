<template>
  <v-card>
    <v-card-title class="headline">New skill group</v-card-title>

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

        <v-btn color="red darken-1" text @click="onCancel"> Cancel </v-btn>

        <v-btn color="green darken-1" text type="submit"> Save </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Mixins } from "vue-property-decorator";
import { DialogFormMixin } from "@/mixins";
import SkillGroupModule, { SkillGroup } from "@/store/modules/skill_group";

@Component
export default class NewSkillGroupDialog extends Mixins(DialogFormMixin) {
  @Prop({ required: true }) readonly afterCreate!: (
    skillGroup: SkillGroup
  ) => Promise<void>;

  name = "";

  async onSave(): Promise<void> {
    if (this.form.validate()) {
      const skillGroup = await SkillGroupModule.createSkillGroup({
        name: this.name,
      });

      await this.afterCreate(skillGroup);
      this.popDialogComponent();
    }
  }
}
</script>
