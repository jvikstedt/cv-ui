<template>
  <v-container class="grey" style="max-width: 1024px" fluid v-if="cv">
    <v-btn color="primary darken-1" text @click="onExport">
      Export
    </v-btn>
    <CVInfoBlock :user="cvUser" :cv="cv" />
    <SkillList :skills="cvSkills" />
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import CVInfoBlock from "@/views/cv/CVInfoBlock.vue";
import { SkillList } from "./skills";
import CV from "@/store/CV";
import User from "@/store/User";
import Skill from "@/store/Skill";

import { GetCVDetailsById } from "@/api/cv";

@Component({
  components: {
    CVInfoBlock,
    SkillList
  }
})
export default class CVShowView extends Vue {
  public id: number | null = null;

  get cv(): CV | null {
    if (this.id) {
      return CV.query()
        .with("user")
        .with("skills")
        .with("skills.skillSubject")
        .find(this.id);
    }

    return null;
  }

  get cvSkills(): Skill[] {
    return this.cv ? this.cv.skills : [];
  }

  get cvUser(): User | null {
    return this.cv ? this.cv.user : null;
  }

  private onExport() {
    this.$router.push(`/cv/${this.id}/pdf`);
  }

  private async created() {
    try {
      const idStr = this.$route.params.id;
      this.id = parseInt(idStr, 10);

      await GetCVDetailsById(this.id);
    } catch (err) {
      // TODO Handle this better, maybe some error notification
      this.$router.push("/");
    }
  }
}
</script>
