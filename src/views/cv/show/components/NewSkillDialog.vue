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
          :rules="skillSubjectRules"
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
              :rules="experienceInYearsRules"
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
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { namespace } from "vuex-class";
import { Skill, CreateSkillDto, SkillSubject } from "@/model/skill";
import { SearchSkillSubjects } from "@/api/skill_subject";
import NewSkillSubjectDialog from "@/views/skill_subject/components/NewSkillSubjectDialog.vue";
import { DialogComponent } from "@/dialog";
import { VForm } from "@/types";

const CVShowStore = namespace("CVShowStore");
const DialogStore = namespace("DialogStore");

@Component({
  components: {
    NewSkillSubjectDialog
  }
})
export default class NewSkillDialog extends Vue {
  @Prop({ required: true }) readonly id!: number;

  valid = false;
  experienceInYears = 1;
  experienceInYearsRules = [
    (experienceInYears: number) =>
      !!experienceInYears || "Experience in years is required"
  ];
  search = "";
  skillSubjects: SkillSubject[] = [];
  skillSubject: SkillSubject | null = null;
  skillSubjectRules = [
    (skillSubject: SkillSubject) =>
      !!skillSubject || "Skill subject is required"
  ];

  @CVShowStore.Getter
  getCVSkills!: (id: number) => Skill[];

  @CVShowStore.Action
  createSkill!: (createSkillDto: CreateSkillDto) => Promise<void>;

  @DialogStore.Mutation
  popDialogComponent!: () => void;

  @DialogStore.Mutation
  pushDialogComponent!: (dialogComponent: DialogComponent) => void;

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

  get form(): VForm {
    return this.$refs.form as VForm;
  }

  async onSave() {
    if (this.form.validate() && this.skillSubject) {
      const createSkillDto: CreateSkillDto = {
        cvId: this.id,
        experienceInYears: this.experienceInYears,
        skillSubjectId: this.skillSubject.id
      };
      await this.createSkill(createSkillDto);

      this.popDialogComponent();
    }
  }

  async onCancel() {
    this.popDialogComponent();
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
