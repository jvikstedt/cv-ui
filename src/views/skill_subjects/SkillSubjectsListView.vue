<template>
  <div>
    <div class="my-2">
      <v-btn color="primary" dark @click="newSkillSubject"
        >New skill subject</v-btn
      >
    </div>
    <v-card class="mx-auto" max-width="400" tile>
      <v-list-item
        two-line
        v-for="skillSubject in skillSubjects"
        :key="skillSubject.id"
      >
        <v-list-item-content>
          <v-list-item-title>{{ skillSubject.name }}</v-list-item-title>
          <v-list-item-subtitle
            v-text="skillSubject.updatedAt"
          ></v-list-item-subtitle>
        </v-list-item-content>

        <v-list-item-action @click="editSkillSubject(skillSubject.id)">
          <v-btn icon>
            <v-icon color="blue lighten-1">mdi-pencil</v-icon>
          </v-btn>
        </v-list-item-action>
        <v-list-item-action @click="deleteSkillSubjectById(skillSubject.id)">
          <v-btn icon>
            <v-icon color="red lighten-1">mdi-delete</v-icon>
          </v-btn>
        </v-list-item-action>
      </v-list-item>
    </v-card>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import SkillSubject from "@/store/SkillSubject";
import { GetSkillSubjects, DeleteSkillSubjectById } from "@/api/skill_subject";

@Component
export default class SkillSubjectsListView extends Vue {
  get skillSubjects(): SkillSubject[] {
    return SkillSubject.all();
  }

  private async mounted(): Promise<void> {
    await GetSkillSubjects();
  }

  private editSkillSubject(id: number): void {
    this.$router.push(`/skill_subjects/${id}/edit`);
  }

  private async deleteSkillSubjectById(id: number): Promise<void> {
    await DeleteSkillSubjectById(id);
  }

  private newSkillSubject(): void {
    this.$router.push("/skill_subjects/new");
  }
}
</script>
