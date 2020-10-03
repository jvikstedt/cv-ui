<template>
  <v-card>
    <v-card-title class="headline">
      <v-icon left>mdi-code-braces</v-icon>
      Skills
    </v-card-title>
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
        @change="onSelect"
        @click="searchChanged('')"
      >
        <template v-slot:append-outer>
          <v-btn color="primary" @click="newSkillSubject">New</v-btn>
        </template>
      </v-autocomplete>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import NewSkillSubjectDialog from "./components/NewSkillSubjectDialog.vue";
import { SkillSubject } from "@/store/modules/skill_subject";
import EditSkillSubjectDialog from "./components/EditSkillSubjectDialog.vue";
import DialogModule from "@/store/modules/dialog";
import SkillSubjectModule from "@/store/modules/skill_subject";

@Component
export default class SkillSubjectListView extends Vue {
  search = "";
  skillSubjects: SkillSubject[] = [];
  skillSubject: SkillSubject | null = null;

  @Watch("search")
  async searchChanged(newValue: string): Promise<void> {
    const skillSubjects = await SkillSubjectModule.searchSkillSubjects({
      name: newValue || "",
      limit: 10,
    });
    this.skillSubjects = skillSubjects;
  }

  newSkillSubject(): void {
    DialogModule.pushDialogComponent({
      component: NewSkillSubjectDialog,
      props: {},
    });
  }

  onSelect(skillSubject: SkillSubject): void {
    this.$nextTick(() => {
      this.skillSubject = null;
    });

    DialogModule.pushDialogComponent({
      component: EditSkillSubjectDialog,
      props: { skillSubject: skillSubject },
    });
  }
}
</script>
