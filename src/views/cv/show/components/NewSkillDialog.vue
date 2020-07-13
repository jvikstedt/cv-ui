<template>
  <v-card>
    <v-card-title class="headline">New Skill</v-card-title>

    <v-card-text>
      <v-autocomplete
        name="skillSubject"
        v-model="skillSubject"
        :items="skillSubjects"
        :search-input.sync="search"
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

      <v-btn color="green darken-1" text @click="onSave">
        Save
      </v-btn>
    </v-card-actions>
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

const CVShowStore = namespace("CVShowStore");
const DialogStore = namespace("DialogStore");

@Component({
  components: {
    NewSkillSubjectDialog
  }
})
export default class NewSkillDialog extends Vue {
  @Prop({ required: true }) readonly id!: number;

  private experienceInYears = 1;
  private search = "";
  private skillSubjects: SkillSubject[] = [];
  private skillSubject: SkillSubject | null = null;
  private isCreatingSkillSubject = false;

  @CVShowStore.Getter
  public getCVSkills!: (id: number) => Skill[];

  @CVShowStore.Action
  public createSkill!: (createSkillDto: CreateSkillDto) => Promise<void>;

  @DialogStore.Mutation
  public popDialogComponent!: () => void;

  @DialogStore.Mutation
  public pushDialogComponent!: (dialogComponent: DialogComponent) => void;

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

  private async onSave() {
    if (this.skillSubject) {
      const createSkillDto: CreateSkillDto = {
        cvId: this.id,
        experienceInYears: this.experienceInYears,
        skillSubjectId: this.skillSubject.id
      };
      await this.createSkill(createSkillDto);

      this.popDialogComponent();
    }
  }

  private async onCancel() {
    this.popDialogComponent();
  }

  private async newSkillSubject() {
    this.pushDialogComponent({
      component: NewSkillSubjectDialog,
      props: { afterCreate: this.afterSkillSubjectCreate }
    });
  }

  private async afterSkillSubjectCreate(skillSubject: SkillSubject) {
    this.skillSubjects = [...this.skillSubjects, skillSubject];
    this.skillSubject = skillSubject;
  }
}
</script>
