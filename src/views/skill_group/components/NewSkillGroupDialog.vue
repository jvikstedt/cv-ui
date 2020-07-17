<template>
  <v-card>
    <v-card-title class="headline">New skill group</v-card-title>

    <v-form ref="form" v-model="valid" lazy-validation @submit.prevent="onSave">
      <v-card-text>
        <v-text-field
          v-model="createSkillGroupDto.name"
          :counter="255"
          :rules="isRequiredRule"
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
import { Component, Prop, Mixins } from "vue-property-decorator";
import { namespace } from "vuex-class";
import { SkillGroup, CreateSkillGroupDto } from "@/model/skill";
import { DialogFormMixin } from "@/mixins";

const SkillGroupStore = namespace("SkillGroupStore");

@Component
export default class NewSkillGroupDialog extends Mixins(DialogFormMixin) {
  @Prop({ required: true }) readonly afterCreate!: (
    skillGroup: SkillGroup
  ) => Promise<void>;

  @SkillGroupStore.Action
  createSkillGroup!: (
    createSkillGroupDto: CreateSkillGroupDto
  ) => Promise<SkillGroup>;

  createSkillGroupDto = new CreateSkillGroupDto();

  async onSave(): Promise<void> {
    if (this.form.validate()) {
      const skillGroup = await this.createSkillGroup(this.createSkillGroupDto);

      await this.afterCreate(skillGroup);
      this.popDialogComponent();
    }
  }
}
</script>
