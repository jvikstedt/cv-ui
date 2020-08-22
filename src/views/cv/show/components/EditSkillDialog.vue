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

        <v-btn color="red darken-1" text @click="onSkillDelete">
          Delete
        </v-btn>

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
import { PatchCVDto } from "@/model/cv";
import { Skill, PatchSkillDto, DeleteSkillDto } from "@/model/skill";
import { DialogFormMixin } from "@/mixins";

const CVShowStore = namespace("CVShowStore");

@Component
export default class EditSkillDialog extends Mixins(DialogFormMixin) {
  @Prop({ required: true }) readonly skillId!: number;

  experienceInYears = 1;
  interestLevel = 1;
  highlight = false;

  @CVShowStore.Action
  patchSkill!: (patchSkillDto: PatchSkillDto) => Promise<void>;

  @CVShowStore.Action
  patchCV!: (patchCVDto: PatchCVDto) => Promise<void>;

  @CVShowStore.Getter
  getSkill!: (skillId: number) => Skill;

  @CVShowStore.Action
  deleteSkill!: (deleteSkillDto: DeleteSkillDto) => Promise<void>;

  get skill(): Skill {
    return this.getSkill(this.skillId);
  }

  created() {
    this.experienceInYears = this.skill.experienceInYears;
    this.interestLevel = this.skill.interestLevel;
    this.highlight = this.skill.highlight;
  }

  async onSkillDelete() {
    this.popDialogComponent();

    const skill = this.getSkill(this.skillId);

    const deleteSkillDto = {
      cvId: skill.cvId,
      skillId: skill.id
    };

    await this.deleteSkill(deleteSkillDto);
  }

  async onSave() {
    if (this.form.validate()) {
      const skill = this.getSkill(this.skillId);

      const patchSkillDto: PatchSkillDto = {
        cvId: skill.cvId,
        skillId: skill.id,
        data: {
          experienceInYears: this.experienceInYears,
          interestLevel: this.interestLevel,
          highlight: this.highlight
        }
      };
      await this.patchSkill(patchSkillDto);

      this.popDialogComponent();
    }
  }
}
</script>
