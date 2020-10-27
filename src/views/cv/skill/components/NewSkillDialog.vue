<template>
  <v-card>
    <v-card-title class="headline">New Skill</v-card-title>

    <v-form ref="form" v-model="valid" lazy-validation @submit.prevent="onSave">
      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn color="red darken-1" text @click="onCancel"> Cancel </v-btn>

        <v-btn color="green darken-1" text type="submit"> Save </v-btn>
      </v-card-actions>
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
          <template slot="selection" slot-scope="data">
            {{ data.item.name }} ({{ data.item.skillGroup.name }})
          </template>
          <template slot="item" slot-scope="data">
            {{ data.item.name }} ({{ data.item.skillGroup.name }})
          </template>
          <template v-slot:append-outer>
            <v-btn @click="newSkillSubject">New</v-btn>
          </template>
        </v-autocomplete>
      </v-card-text>

      <v-card-text>
        <v-subheader>Experience in years</v-subheader>
        <v-slider
          v-model="experienceInYears"
          class="align-center"
          :max="10"
          :min="0"
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
    </v-form>
  </v-card>
</template>

<script lang="ts">
import * as R from "ramda";
import { Component, Prop, Watch, Mixins } from "vue-property-decorator";
import SkillSubjectModule, {
  SkillSubject,
} from "@/store/modules/skill_subject";
import NewSkillSubjectDialog from "@/views/skill_subject/components/NewSkillSubjectDialog.vue";
import { DialogFormMixin } from "@/mixins";
import { Skill } from "@/store/modules/skill";
import { ServiceManager, SkillService } from "@/services";

@Component({
  components: {
    NewSkillSubjectDialog,
  },
})
export default class NewSkillDialog extends Mixins(DialogFormMixin) {
  @Prop({ required: true }) readonly cvId!: number;
  @Prop({ required: true, default: [] })
  readonly existingSkills!: Skill[];

  @Prop({ required: false }) readonly afterCreate!: (
    skill: Skill
  ) => Promise<void>;

  experienceInYears = 0;
  interestLevel = 1;
  highlight = false;
  search = "";
  skillSubject: SkillSubject | null = null;

  get skillSubjects(): SkillSubject[] {
    return R.reject(
      (skillSubject: SkillSubject) =>
        !!R.find(
          (skill: Skill) => R.equals(skillSubject.id, skill.skillSubject.id),
          this.existingSkills
        ),
      SkillSubjectModule.list
    );
  }

  @Watch("search")
  async searchChanged(keyword: string): Promise<void> {
    await ServiceManager.skillSubject.searchSkillSubjects({
      name: keyword || "",
    });
  }

  async onSave(): Promise<void> {
    if (this.form.validate() && this.skillSubject) {
      const createSkillDto: SkillService.CreateSkillDto = {
        cvId: this.cvId,
        experienceInYears: this.experienceInYears,
        interestLevel: this.interestLevel,
        highlight: this.highlight,
        skillSubjectId: this.skillSubject.id,
      };
      const skill = await ServiceManager.skill.createSkill(createSkillDto);

      if (this.afterCreate) {
        await this.afterCreate(skill);
      }

      this.popDialogComponent();
    }
  }

  newSkillSubject(): void {
    this.pushDialogComponent({
      component: NewSkillSubjectDialog,
      props: { afterCreate: this.afterSkillSubjectCreate },
    });
  }

  afterSkillSubjectCreate(skillSubject: SkillSubject): void {
    this.skillSubject = skillSubject;
  }
}
</script>
