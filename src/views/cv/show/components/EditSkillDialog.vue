<template>
  <v-card>
    <v-card-title class="headline">{{ skill.skillSubject.name }}</v-card-title>

    <v-form ref="form" v-model="valid" lazy-validation @submit.prevent="onSave">
      <v-card-text>
        <v-subheader>Experience in years</v-subheader>
        <v-slider
          v-model="experienceInYears"
          class="align-center"
          :max="10"
          :min="1"
          hide-details
        >
          <template v-slot:append>
            <v-text-field
              name="experienceInYears"
              v-model="experienceInYears"
              :rules="isRequiredRule"
              class="mt-0 pt-0"
              hide-details
              single-line
              type="number"
              style="width: 60px"
            ></v-text-field>
          </template>
        </v-slider>

        <v-subheader>Interest level</v-subheader>
        <v-slider
          v-model="interestLevel"
          class="align-center"
          :max="3"
          :min="1"
          hide-details
        >
          <template v-slot:append>
            <v-text-field
              name="interestLevel"
              v-model="interestLevel"
              :rules="isRequiredRule"
              class="mt-0 pt-0"
              hide-details
              single-line
              type="number"
              style="width: 60px"
            ></v-text-field>
          </template>
        </v-slider>

        <v-checkbox v-model="highlight" label="Highlight"></v-checkbox>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn color="red darken-1" text @click="onSkillDelete"> Delete </v-btn>

        <v-btn color="red darken-1" text @click="onCancel"> Cancel </v-btn>

        <v-btn color="green darken-1" text type="submit"> Save </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Mixins } from "vue-property-decorator";
import { DialogFormMixin } from "@/mixins";
import SkillModule, { Skill, PatchSkillDto } from "@/store/modules/skill";

@Component
export default class EditSkillDialog extends Mixins(DialogFormMixin) {
  @Prop({ required: true }) readonly skill!: Skill;

  experienceInYears = 1;
  interestLevel = 1;
  highlight = false;

  created(): void {
    this.experienceInYears = this.skill.experienceInYears;
    this.interestLevel = this.skill.interestLevel;
    this.highlight = this.skill.highlight;
  }

  async onSkillDelete(): Promise<void> {
    await SkillModule.deleteSkill({
      cvId: this.skill.cvId,
      skillId: this.skill.id,
    });
    this.popDialogComponent();
  }

  async onSave(): Promise<void> {
    if (this.form.validate()) {
      const patchSkillDto: PatchSkillDto = {
        cvId: this.skill.cvId,
        skillId: this.skill.id,
        data: {
          experienceInYears: this.experienceInYears,
          interestLevel: this.interestLevel,
          highlight: this.highlight,
        },
      };
      await SkillModule.patchSkill(patchSkillDto);

      this.popDialogComponent();
    }
  }
}
</script>
