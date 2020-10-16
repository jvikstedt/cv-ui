<template>
  <v-card>
    <v-card-title class="headline">{{ skill.skillSubject.name }}</v-card-title>

    <v-form ref="form" v-model="valid" lazy-validation @submit.prevent="onSave">
      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn v-if="canEdit" color="red darken-1" text @click="onSkillDelete">
          Delete
        </v-btn>

        <v-btn color="red darken-1" text @click="onCancel"> Cancel </v-btn>

        <v-btn v-if="canEdit" color="green darken-1" text type="submit">
          Save
        </v-btn>
      </v-card-actions>
      <v-card-text>
        <v-subheader>Extra experience in years</v-subheader>
        <v-slider
          v-model="experienceInYears"
          class="align-center"
          :max="10"
          :min="0"
          hide-details
          :readonly="!canEdit"
        >
          <template v-slot:append>
            <v-text-field
              name="experienceInYears"
              v-model="experienceInYears"
              class="mt-0 pt-0"
              hide-details
              single-line
              type="number"
              style="width: 60px"
              :readonly="!canEdit"
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
          :readonly="!canEdit"
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
              :readonly="!canEdit"
            ></v-text-field>
          </template>
        </v-slider>

        <v-checkbox
          v-model="highlight"
          label="Highlight"
          :readonly="!canEdit"
        ></v-checkbox>

        <div v-if="skillExperience">
          <v-subheader>
            Total experience: ~
            {{
              Math.ceil(
                skillExperience.totalExperience +
                  (experienceInYears - skill.experienceInYears)
              )
            }}
            years ( {{ experienceInYears }} +
            {{ skillExperience.projectExperience }} =
            {{
              Math.round(
                (skillExperience.totalExperience +
                  (experienceInYears - skill.experienceInYears)) *
                  100
              ) / 100
            }}
            )
          </v-subheader>
          <v-simple-table>
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-left">Project name</th>
                  <th class="text-left">Auto calculation</th>
                  <th class="text-left">Experience</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="m in skillExperience.projects" :key="m.id">
                  <td>
                    {{ m.companyName }} /
                    {{ m.projectName }}
                  </td>
                  <td>{{ `${m.automaticCalculation ? "Yes" : "No"}` }}</td>
                  <td>{{ m.experience }} years</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </div>
      </v-card-text>
    </v-form>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Mixins } from "vue-property-decorator";
import { DialogFormMixin } from "@/mixins";
import SkillModule, { Skill, SkillExperience } from "@/store/modules/skill";
import { ServiceManager, SkillService } from "@/services";

@Component
export default class EditSkillDialog extends Mixins(DialogFormMixin) {
  @Prop({ required: true }) readonly skill!: Skill;
  @Prop({ required: false }) readonly canEdit!: boolean;

  experienceInYears = 1;
  interestLevel = 1;
  highlight = false;

  get skillExperience(): SkillExperience | undefined {
    return SkillModule.skillExperience(this.skill.id);
  }

  created(): void {
    this.experienceInYears = this.skill.experienceInYears;
    this.interestLevel = this.skill.interestLevel;
    this.highlight = this.skill.highlight;
  }

  async onSkillDelete(): Promise<void> {
    if (confirm("Are you sure you want to delete?")) {
      await ServiceManager.skill.deleteSkill({
        cvId: this.skill.cvId,
        skillId: this.skill.id,
      });
      this.popDialogComponent();
    }
  }

  async onSave(): Promise<void> {
    if (this.form.validate()) {
      const patchSkillDto: SkillService.PatchSkillDto = {
        cvId: this.skill.cvId,
        skillId: this.skill.id,
        data: {
          experienceInYears: this.experienceInYears,
          interestLevel: this.interestLevel,
          highlight: this.highlight,
        },
      };
      await ServiceManager.skill.patchSkill(patchSkillDto);

      this.popDialogComponent();
    }
  }
}
</script>
