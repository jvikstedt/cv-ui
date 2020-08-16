<template>
  <v-card>
    <v-card-title class="headline">Skill subjects</v-card-title>
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
import { namespace } from "vuex-class";
import NewSkillSubjectDialog from "./components/NewSkillSubjectDialog.vue";
import { DialogComponent } from "@/dialog";
import { SkillSubject } from "@/model/skill_subject";
import { SearchSkillSubjects } from "@/api/skill_subject";
import EditSkillSubjectDialog from "./components/EditSkillSubjectDialog.vue";

const DialogStore = namespace("DialogStore");

@Component
export default class SkillSubjectListView extends Vue {
  @DialogStore.Mutation
  pushDialogComponent!: (dialogComponent: DialogComponent) => void;

  search = "";
  skillSubjects: SkillSubject[] = [];
  skillSubject: SkillSubject | null = null;

  @Watch("search")
  async searchChanged(newValue: string) {
    const skillSubjects = await SearchSkillSubjects({
      name: newValue || "",
      limit: 10
    });
    this.skillSubjects = skillSubjects;
  }

  newSkillSubject() {
    this.pushDialogComponent({
      component: NewSkillSubjectDialog,
      props: {}
    });
  }

  async onSelect(skillSubject: SkillSubject) {
    this.$nextTick(() => {
      this.skillSubject = null;
    });

    this.pushDialogComponent({
      component: EditSkillSubjectDialog,
      props: { skillSubjectId: skillSubject.id }
    });
  }
}
</script>
