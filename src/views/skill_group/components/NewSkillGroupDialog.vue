<template>
  <v-card>
    <v-card-title class="headline">New Skill group</v-card-title>

    <v-form v-model="valid">
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

        <v-btn :disabled="!valid" color="green darken-1" text @click="onSave">
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

const SkillGroupStore = namespace("SkillGroupStore");
const DialogStore = namespace("DialogStore");

@Component
export default class NewSkillGroupDialog extends Vue {
  @Prop({ required: true }) readonly afterCreate!: (
    skillGroup: SkillGroup
  ) => Promise<void>;

  @SkillGroupStore.Action
  public createSkillGroup!: (
    createSkillGroupDto: CreateSkillGroupDto
  ) => Promise<SkillGroup>;

  @DialogStore.Mutation
  public popDialogComponent!: () => void;

  private valid = false;
  private createSkillGroupDto = new CreateSkillGroupDto();

  private nameRules = [
    (v: string) => !!v || "Name is required",
    (v: string) =>
      (v && v.length <= 255) || "Name must be less than 10 characters"
  ];

  private async onSave(): Promise<void> {
    const skillGroup = await this.createSkillGroup(this.createSkillGroupDto);

    await this.afterCreate(skillGroup);
    this.popDialogComponent();
  }

  private async onCancel() {
    this.popDialogComponent();
  }
}
</script>
