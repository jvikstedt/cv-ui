<template>
  <v-card>
    <v-card-title class="headline">New skill group</v-card-title>

    <v-form ref="form" v-model="valid" lazy-validation @submit.prevent="onSave">
      <v-card-text>
        <v-text-field
          v-model="createSkillGroupDto.name"
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
import { SkillGroup, CreateSkillGroupDto } from "@/model/skill";
import { VForm } from "@/types";

const SkillGroupStore = namespace("SkillGroupStore");
const DialogStore = namespace("DialogStore");

@Component
export default class NewSkillGroupDialog extends Vue {
  @Prop({ required: true }) readonly afterCreate!: (
    skillGroup: SkillGroup
  ) => Promise<void>;

  @SkillGroupStore.Action
  createSkillGroup!: (
    createSkillGroupDto: CreateSkillGroupDto
  ) => Promise<SkillGroup>;

  @DialogStore.Mutation
  popDialogComponent!: () => void;

  get form(): VForm {
    return this.$refs.form as VForm;
  }

  valid = false;
  createSkillGroupDto = new CreateSkillGroupDto();

  nameRules = [(v: string) => !!v || "Name is required"];

  async onSave(): Promise<void> {
    if (this.form.validate()) {
      const skillGroup = await this.createSkillGroup(this.createSkillGroupDto);

      await this.afterCreate(skillGroup);
      this.popDialogComponent();
    }
  }

  async onCancel() {
    this.popDialogComponent();
  }
}
</script>
