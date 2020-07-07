<template>
  <v-row>
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
import { Component, Vue, Prop } from "vue-property-decorator";
import { namespace } from "vuex-class";
import { Skill } from "@/model/skill";
import { ShowDialogDto } from "@/dialog";
import EditSkillDialog from "./components/EditSkillDialog.vue";
import NewSkillDialog from "./components/NewSkillDialog.vue";

const CVShowStore = namespace("CVShowStore");
const DialogStore = namespace("DialogStore");

@Component
export default class CVSkills extends Vue {
  @Prop({ required: true }) readonly id!: number;

  @CVShowStore.Getter
  public getCVSkills!: (id: number) => Skill[];

  @DialogStore.Action
  public showDialogAction!: (showDialogDto: ShowDialogDto) => Promise<void>;

  get skills(): Skill[] {
    return this.getCVSkills(this.id);
  }

  private async onSkillClick(skill: Skill) {
    this.showDialogAction({
      component: EditSkillDialog,
      props: { id: skill.id }
    });
  }

  private async newSkill() {
    this.showDialogAction({
      component: NewSkillDialog,
      props: { id: this.id }
    });
  }
}
</script>
