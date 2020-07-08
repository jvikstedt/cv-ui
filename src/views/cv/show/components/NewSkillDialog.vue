<template>
  <v-card>
    <v-card-title class="headline">New Skill</v-card-title>

    <v-card-text>
      <v-autocomplete
        v-model="selectedSkillSubject"
        :items="skillSubjects"
        :search-input.sync="search"
        item-text="name"
        item-value="id"
        label="Skill subject"
        placeholder="Start typing to search"
        return-object
      >
        <template v-slot:append-outer>
          <v-btn @click="isCreatingSkillSubject = !isCreatingSkillSubject">
            {{ isCreatingSkillSubject ? "Cancel" : "New" }}
          </v-btn>
        </template>
      </v-autocomplete>

      <template v-if="isCreatingSkillSubject">
        <NewSkillSubjectForm :afterCreate="afterSkillSubjectCreate" />
      </template>
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
import NewSkillSubjectForm from "@/views/skill_subject/components/NewSkillSubjectForm.vue";

const CVShowStore = namespace("CVShowStore");
const DialogStore = namespace("DialogStore");

@Component({
  components: {
    NewSkillSubjectForm
  }
})
export default class NewSkillDialog extends Vue {
  @Prop({ required: true }) readonly id!: number;

  private experienceInYears = 1;
  private search = "";
  private skillSubjects: SkillSubject[] = [];
  private selectedSkillSubject: SkillSubject | null = null;
  private isCreatingSkillSubject = false;

  @CVShowStore.Getter
  public getCVSkills!: (id: number) => Skill[];

  @CVShowStore.Action
  public createSkill!: (createSkillDto: CreateSkillDto) => Promise<void>;

  @DialogStore.Action
  public hideDialogAction!: () => void;

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
    if (this.selectedSkillSubject) {
      const createSkillDto: CreateSkillDto = {
        cvId: this.id,
        experienceInYears: this.experienceInYears,
        skillSubjectId: this.selectedSkillSubject.id
      };
      await this.createSkill(createSkillDto);

      this.hideDialogAction();
    }
  }

  private async onCancel() {
    this.hideDialogAction();
  }

  private async afterSkillSubjectCreate(skillSubject: SkillSubject) {
    this.skillSubjects = [...this.skillSubjects, skillSubject];
    this.selectedSkillSubject = skillSubject;

    this.isCreatingSkillSubject = false;
  }
}
</script>
