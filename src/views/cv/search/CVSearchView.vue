<template>
  <v-container class="grey" style="max-width: 1024px" fluid>
    <v-text-field label="name" v-model="fullName"></v-text-field>

    <v-autocomplete
      v-model="selectedSkillSubject"
      :items="skillSubjects"
      :loading="isLoading"
      :search-input.sync="search"
      item-text="name"
      item-value="id"
      label="Skill subject"
      placeholder="Start typing to search"
      return-object
      @change="onSelect"
    ></v-autocomplete>

    <template v-for="option in skillSearchOptions">
      <div :key="option.skillSubjectId">
        <v-row class="ml-1 mr-1 mb-2">
          <p class="ma-0">{{ option.name }}</p>
          <v-checkbox
            v-model="option.required"
            label="Required"
            dense
            hide-details
            class="ma-0 pa-0 ml-2"
          ></v-checkbox>
          <v-btn
            height="auto"
            icon
            color="red lighten-2"
            @click="removeSelectedSkillSubject(option)"
          >
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </v-row>
      </div>
    </template>

    <v-btn @click="onSearch">
      Search
    </v-btn>

    <v-list class="mt-2">
      <template v-if="cvs.length">
        <template v-for="item in cvs">
          <v-list-item :key="item.id" @click="onResultClick(item)">
            <v-list-item-avatar>
              <img :src="'/api/files/' + item.avatarId" />
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title v-html="item.fullName"></v-list-item-title>
              <v-list-item-subtitle>
                <v-chip
                  class="ma-2"
                  color="green"
                  text-color="white"
                  v-for="skill in commonSkills(item)"
                  :key="skill.id"
                >
                  {{ skill.name }}
                </v-chip>
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </template>
      </template>
      <p v-else>No results!</p>
    </v-list>
  </v-container>
</template>

<script lang="ts">
import * as R from "ramda";
import { Component, Vue, Watch } from "vue-property-decorator";
import { SearchCVs, SearchCVDto, SkillSearch } from "@/api/cv";
import CV from "@/store/CV";
import SkillSubject from "@/store/SkillSubject";
import { SearchSkillSubjects } from "@/api/skill_subject";

class SkillSearchOption extends SkillSearch {
  name!: string;
}

@Component({
  components: {}
})
export default class CVSearchView extends Vue {
  private fullName = "";
  private cvs: CV[] = [];

  private search = "";
  private isLoading = false;
  private selectedSkillSubject: SkillSubject | null = null;
  private skillSubjects: SkillSubject[] = [];

  private skillSearchOptions: SkillSearchOption[] = [];

  @Watch("search")
  async searchChanged(keyword: string) {
    const skillSubjects = await SearchSkillSubjects({
      name: keyword || "",
      limit: 10
    });

    this.skillSubjects = R.reject(
      (skillSubject: SkillSubject) =>
        !!R.find(
          (skillSearchOption: SkillSearchOption) =>
            R.equals(skillSearchOption.skillSubjectId, skillSubject.id),
          this.skillSearchOptions
        ),
      skillSubjects
    );
  }

  private commonSkills(cv: CV) {
    return R.filter(
      skill =>
        !!R.find(
          option => R.equals(option.skillSubjectId, skill.skillSubjectId),
          this.skillSearchOptions
        ),
      cv.skills
    );
  }

  private onResultClick(cv: CV) {
    this.$router.push(`/cv/${cv.id}`);
  }

  private async onSearch() {
    const searchCVDto = new SearchCVDto({
      fullName: this.fullName,
      skills: this.skillSearchOptions
    });
    this.cvs = await SearchCVs(searchCVDto);
  }

  private async removeSelectedSkillSubject(
    skillSearchOption: SkillSearchOption
  ) {
    this.skillSearchOptions = R.reject(
      option =>
        R.equals(option.skillSubjectId, skillSearchOption.skillSubjectId),
      this.skillSearchOptions
    );
  }

  private async onSelect(skillSubject: SkillSubject) {
    this.$nextTick(() => {
      this.selectedSkillSubject = null;
    });

    const skillSearchOption = new SkillSearchOption();
    skillSearchOption.skillSubjectId = skillSubject.id;
    skillSearchOption.name = skillSubject.name;

    this.skillSearchOptions = [...this.skillSearchOptions, skillSearchOption];
  }
}
</script>
