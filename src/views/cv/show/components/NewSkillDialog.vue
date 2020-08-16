<template>
  <v-card>
    <v-card-title class="headline">New Skill</v-card-title>

    <v-form ref="form" v-model="valid" lazy-validation @submit.prevent="onSave">
      <v-card-text>
        <v-autocomplete
          name="skillSubject"
          v-model="skillSubject"
          :items="skillSubjects"
          :search-input.sync="search"
          :rules="isRequiredRule"
          item-text="name"
          item-value="id"
          label="Skill subject"
          placeholder="Start typing to search"
          return-object
        >
          <template v-slot:append-outer>
            <v-btn @click="newSkillSubject">New</v-btn>
          </template>
        </v-autocomplete>
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

        <v-checkbox v-model="highlight" label="Highlight"></v-checkbox>
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
import * as R from "ramda";
import { Component, Prop, Watch, Mixins } from "vue-property-decorator";
import { namespace } from "vuex-class";
import { Skill, CreateSkillDto } from "@/model/skill";
import { SkillSubject } from "@/model/skill_subject";
import { SearchSkillSubjects } from "@/api/skill_subject";
import NewSkillSubjectDialog from "@/views/skill_subject/components/NewSkillSubjectDialog.vue";
import { DialogFormMixin } from "@/mixins";

const CVShowStore = namespace("CVShowStore");

@Component({
  components: {
    NewSkillSubjectDialog
  }
})
export default class NewSkillDialog extends Mixins(DialogFormMixin) {
  @Prop({ required: true }) readonly id!: number;
  @Prop({ required: false }) readonly afterCreate!: (
    skill: Skill
  ) => Promise<void>;

  experienceInYears = 1;
  highlight = false;
  search = "";
  skillSubjects: SkillSubject[] = [];
  skillSubject: SkillSubject | null = null;

  @CVShowStore.Getter
  getCVSkills!: (id: number) => Skill[];

  @CVShowStore.Action
  createSkill!: (createSkillDto: CreateSkillDto) => Promise<Skill>;

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
          this.getCVSkills(this.id)
        ),
      skillSubjects
    );
  }

  async onSave() {
    if (this.form.validate() && this.skillSubject) {
      const createSkillDto: CreateSkillDto = {
        cvId: this.id,
        experienceInYears: this.experienceInYears,
        highlight: this.highlight,
        skillSubjectId: this.skillSubject.id
      };
      const skill = await this.createSkill(createSkillDto);

      if (this.afterCreate) {
        await this.afterCreate(skill);
      }

      this.popDialogComponent();
    }
  }

  async newSkillSubject() {
    this.pushDialogComponent({
      component: NewSkillSubjectDialog,
      props: { afterCreate: this.afterSkillSubjectCreate }
    });
  }

  async afterSkillSubjectCreate(skillSubject: SkillSubject) {
    this.skillSubjects = [...this.skillSubjects, skillSubject];
    this.skillSubject = skillSubject;
  }
}
</script>
