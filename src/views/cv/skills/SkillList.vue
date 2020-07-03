<template>
  <v-row>
    <v-dialog v-model="dialog" max-width="600" persistent>
      <v-card>
        <v-card-title class="headline">{{
          selectedSkill ? selectedSkill.skillSubject.name : "New Skill"
        }}</v-card-title>

        <v-card-text v-if="!selectedSkill">
          <v-autocomplete
            v-model="selectedSkillSubject"
            :items="skillSubjects"
            :loading="isLoading"
            :search-input.sync="search"
            item-text="name"
            item-value="id"
            label="Skill subject"
            placeholder="Start typing to search"
            return-object
          ></v-autocomplete>
        </v-card-text>

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

          <v-btn
            color="red darken-1"
            text
            @click="onSkillDelete"
            v-if="selectedSkill"
          >
            Delete
          </v-btn>

          <v-btn color="green darken-1" text @click="onSkillCancel">
            Cancel
          </v-btn>

          <v-btn color="green darken-1" text @click="onSkillSave">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-col cols="12">
      <h3>Skills</h3>
      <v-chip
        class="ma-2"
        color="green"
        text-color="white"
        v-for="skill in skills"
        :key="skill.id"
        @click="onSkillClick(skill)"
      >
        <v-avatar left class="green darken-4">
          {{ skill.experienceInYears }}
        </v-avatar>
        {{ skill.skillSubject.name }}
      </v-chip>
    </v-col>
    <v-col cols="12">
      <v-btn color="primary" dark @click="newSkill">New Skill</v-btn>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import * as R from "ramda";
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import Skill from "@/store/Skill";
import {
  UpdateSkillDto,
  UpdateSkill,
  CreateSkillDto,
  CreateSkill,
  DeleteSkillById
} from "@/api/skill";
import SkillSubject from "@/store/SkillSubject";
import { SearchSkillSubjects } from "@/api/skill_subject";

@Component
export default class SkillList extends Vue {
  @Prop({ required: true }) readonly skills!: Skill[];

  private dialog = false;
  private selectedSkill: Skill | null = null;
  private experienceInYears = 1;
  private search = "";
  private isLoading = false;
  private selectedSkillSubject: SkillSubject | null = null;

  private skillSubjects: SkillSubject[] = [];

  @Watch("search")
  async searchChanged(keyword: string) {
    const skillSubjects = await SearchSkillSubjects({
      name: keyword || "",
      limit: 10
    });

    this.skillSubjects = R.reject(
      (skillSubject: SkillSubject) =>
        !!R.find(
          (skill: Skill) => R.equals(skillSubject.id, skill.skillSubject.id),
          this.skills
        ),
      skillSubjects
    );
  }

  private async onSkillClick(skill: Skill) {
    this.resetFields();
    this.dialog = true;

    this.selectedSkill = skill;
    this.experienceInYears = skill.experienceInYears;
  }

  private async newSkill() {
    this.resetFields();
    this.dialog = true;
  }

  private async onSkillCancel() {
    this.resetFields();
  }

  private async onSkillDelete() {
    if (this.selectedSkill) {
      await DeleteSkillById(this.selectedSkill.id);
    }
    this.resetFields();
  }

  private async onSkillSave() {
    if (this.selectedSkill) {
      const updateSkillDto: UpdateSkillDto = {
        experienceInYears: this.experienceInYears
      };
      await UpdateSkill(this.selectedSkill.id, updateSkillDto);
    } else if (this.selectedSkillSubject) {
      const createSkillDto: CreateSkillDto = {
        cvId: 2,
        experienceInYears: this.experienceInYears,
        skillSubjectId: this.selectedSkillSubject.id
      };
      await CreateSkill(createSkillDto);
    }

    this.resetFields();
  }

  private resetFields() {
    this.dialog = false;
    this.selectedSkill = null;
    this.selectedSkillSubject = null;
    this.search = "";
    this.dialog = false;
    this.isLoading = false;
    this.experienceInYears = 1;
    this.skillSubjects = [];
  }
}
</script>
