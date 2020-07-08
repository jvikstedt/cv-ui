<template>
  <v-form v-model="valid">
    <v-text-field
      v-model="createSkillSubjectDto.name"
      :counter="255"
      :rules="nameRules"
      label="Name"
      required
    ></v-text-field>

    <v-btn :disabled="!valid" color="success" class="mr-4" @click="submit">
      Submit
    </v-btn>
  </v-form>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { namespace } from "vuex-class";
import { SkillSubject, CreateSkillSubjectDto } from "@/model/skill";

const SkillSubjectStore = namespace("SkillSubjectStore");

@Component
export default class NewSkillSubjectForm extends Vue {
  @Prop({ required: true }) readonly afterCreate!: (
    skillSubject: SkillSubject
  ) => Promise<void>;

  @SkillSubjectStore.Action
  public createSkillSubject!: (
    createSkillSubjectDto: CreateSkillSubjectDto
  ) => Promise<SkillSubject>;

  private valid = false;
  private createSkillSubjectDto = new CreateSkillSubjectDto();

  private nameRules = [
    (v: string) => !!v || "Name is required",
    (v: string) =>
      (v && v.length <= 255) || "Name must be less than 10 characters"
  ];

  private async submit(): Promise<void> {
    const skillSubject = await this.createSkillSubject(
      this.createSkillSubjectDto
    );

    await this.afterCreate(skillSubject);
  }
}
</script>
