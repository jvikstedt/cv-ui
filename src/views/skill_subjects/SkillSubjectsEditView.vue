<template>
  <div v-if="skillSubject">
    <skillSubjectForm
      :onSubmit="onSubmit"
      :initialSkillSubjectDto="skillSubject"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import SkillSubjectForm from "./components/SkillSubjectForm.vue";
import SkillSubject from "@/store/SkillSubject";
import {
  SkillSubjectDto,
  GetSkillSubjectById,
  UpdateSkillSubject
} from "@/api/skill_subject";

@Component({
  components: {
    SkillSubjectForm
  }
})
export default class SkillSubjectsEditView extends Vue {
  public id: number | null = null;

  private async onSubmit(skillSubjectDto: SkillSubjectDto): Promise<void> {
    if (this.id) {
      await UpdateSkillSubject(this.id, skillSubjectDto);
    }
    this.$router.push("/skill_subjects");
  }

  get skillSubject(): SkillSubject | null {
    if (this.id) {
      return SkillSubject.find(this.id);
    }
    return null;
  }

  private async created() {
    try {
      const idStr = this.$route.params.id;
      this.id = parseInt(idStr, 10);
      await GetSkillSubjectById(this.id);
    } catch (err) {
      this.$router.push("/skill_subjects");
    }
  }
}
</script>
