<template>
  <v-form v-model="valid">
    <v-text-field
      v-model="skillSubjectDto.name"
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
import { SkillSubjectDto } from "@/api/skill_subject";

@Component
export default class SkillSubjectForm extends Vue {
  @Prop({ required: true }) readonly onSubmit!: (
    skillSubjectDto: SkillSubjectDto
  ) => Promise<void>;
  @Prop({
    type: Object,
    default: () => ({
      name: ""
    })
  })
  readonly initialSkillSubjectDto!: SkillSubjectDto;

  private valid = false;
  private skillSubjectDto: SkillSubjectDto = {
    ...this.initialSkillSubjectDto
  };

  private nameRules = [
    (v: string) => !!v || "Name is required",
    (v: string) =>
      (v && v.length <= 255) || "Name must be less than 10 characters"
  ];

  private async submit(): Promise<void> {
    await this.onSubmit(this.skillSubjectDto);
  }
}
</script>
