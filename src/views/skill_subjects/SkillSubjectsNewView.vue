<template>
  <SkillSubjectForm :onSubmit="onSubmit" />
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import SkillSubjectForm from "./components/SkillSubjectForm.vue";
import { SkillSubjectDto, CreateSkillSubject } from "@/api/skill_subject";

@Component({
  components: {
    SkillSubjectForm
  }
})
export default class SkillSubjectsNewView extends Vue {
  private async onSubmit(skillSubjectDto: SkillSubjectDto): Promise<void> {
    await CreateSkillSubject(skillSubjectDto);
    this.$router.push("/skill_subjects");
  }
}
</script>
