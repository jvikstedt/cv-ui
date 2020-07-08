<template>
  <v-card>
    <v-card-title class="headline">{{ skill.skillSubject.name }}</v-card-title>
    <v-subheader>Experience in years</v-subheader>
    <v-card-text>
      <v-slider
        v-model="experienceInYears"
        class="align-center"
        :max="10"
        :min="1"
        hide-details
      >
        <template v-slot:append>
          <v-text-field
            v-model="experienceInYears"
            class="mt-0 pt-0"
            hide-details
            single-line
            type="number"
            style="width: 60px"
          ></v-text-field>
        </template>
      </v-slider>
    </v-card-text>

    <v-card-actions>
      <v-spacer></v-spacer>

      <v-btn color="red darken-1" text @click="onSkillDelete">
        Delete
      </v-btn>

      <v-btn color="green darken-1" text @click="onCancel">
        Cancel
      </v-btn>

      <v-btn color="green darken-1" text @click="onSave">
        Save
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { namespace } from "vuex-class";
import { PatchCVDto } from "@/model/cv";
import { Skill, PatchSkillDto } from "@/model/skill";

const CVShowStore = namespace("CVShowStore");
const DialogStore = namespace("DialogStore");

@Component
export default class EditSkillDialog extends Vue {
  @Prop({ required: true }) readonly id!: number;

  private experienceInYears = 1;

  @CVShowStore.Action
  public patchSkill!: (patchSkillDto: PatchSkillDto) => Promise<void>;

  @CVShowStore.Action
  public patchCV!: (patchCVDto: PatchCVDto) => Promise<void>;

  @DialogStore.Mutation
  public popDialogComponent!: () => void;

  @CVShowStore.Getter
  public getSkill!: (id: number) => Skill;

  @CVShowStore.Action
  public deleteSkill!: (id: number) => Promise<void>;

  get skill(): Skill {
    return this.getSkill(this.id);
  }

  private created() {
    this.experienceInYears = this.skill.experienceInYears;
  }

  private async onSkillDelete() {
    this.popDialogComponent();
    await this.deleteSkill(this.id);
  }

  private async onSave() {
    const patchSkillDto: PatchSkillDto = {
      id: this.id,
      data: {
        experienceInYears: this.experienceInYears
      }
    };
    await this.patchSkill(patchSkillDto);

    this.popDialogComponent();
  }

  private async onCancel() {
    this.popDialogComponent();
  }
}
</script>
