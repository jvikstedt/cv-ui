<template>
  <v-card :loading="searching">
    <v-card-title class="headline">
      <v-icon left>mdi-magnify</v-icon>
      Search
    </v-card-title>

    <v-card-text>
      <v-text-field
        label="Text"
        :value="searchData.text"
        @input="setText"
        placeholder="Search by name, location, job title..."
      ></v-text-field>

      <v-autocomplete
        v-model="selectedSkillSubject"
        name="skill"
        :items="skillSubjects"
        :search-input.sync="searchInput"
        item-text="name"
        item-value="id"
        label="Skill"
        placeholder="Start typing to search"
        return-object
        @change="onSelect"
      ></v-autocomplete>

      <template v-for="skill in searchData.skills">
        <div :key="skill.skillSubjectId">
          <v-row class="ml-1 mr-1 mb-2">
            <p class="ma-0">{{ skill.name }}</p>
            <v-checkbox
              :value="skill.required"
              @change="setSkillRequired($event, skill)"
              label="Required"
              dense
              hide-details
              class="ma-0 pa-0 ml-2"
            ></v-checkbox>
            <v-btn
              height="auto"
              icon
              color="red lighten-2"
              @click="removeSelectedSkillSubject(skill)"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </v-row>
        </div>
      </template>

      <v-btn id="search-view-search-btn" color="primary" @click="onSearch">
        Search
        <v-icon right>mdi-magnify</v-icon>
      </v-btn>

      <v-btn color="red darken-1" text @click="onCancel"> Close </v-btn>

      <v-list class="mt-2">
        <template v-if="results.length">
          <template v-for="item in results">
            <v-list-item :key="item.id" @click="onResultClick(item)">
              <v-list-item-avatar tile size="50" color="indigo">
                <v-img v-if="avatarSrc(item)" :src="avatarSrc(item)"></v-img>
                <span v-else class="white--text headline">{{
                  initials(item)
                }}</span>
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title v-html="item.fullName"></v-list-item-title>
                <v-list-item-subtitle>
                  <v-chip
                    :key="skill.id"
                    class="ma-2"
                    :style="getChipStyle(skill)"
                    text-color="blue-grey darken-4"
                    v-for="skill in commonSkills(item)"
                  >
                    <v-avatar left class="">
                      {{ Math.ceil(skill.experienceInYears) }}
                    </v-avatar>
                    {{ skill.name }}
                    <v-icon v-if="skill.highlight" right>mdi-star</v-icon>
                  </v-chip>
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-divider
              :key="item.id + 'divider'"
              style="border-color: rgba(0, 0, 0, 0.3)"
            ></v-divider>
          </template>
        </template>
        <p v-else>No results!</p>
      </v-list>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import * as R from "ramda";
import { Component, Watch, Mixins } from "vue-property-decorator";
import {
  CVSearchDtoSkill,
  CVSearchResult,
  CVSearchDtoData,
  CVSearchDto,
  CVSearchResultSkill,
} from "@/store/modules/cv";
import { SkillSubject } from "@/store/modules/skill_subject";
import { SearchMixin, DialogFormMixin } from "@/mixins";
import SearchModule from "@/store/modules/search";
import { ServiceManager } from "@/services";

@Component
export default class CVSearchView extends Mixins(SearchMixin, DialogFormMixin) {
  searchKey = "CVSearchView";

  searchInput = null;
  selectedSkillSubject: SkillSubject | null = null;
  skillSubjects: SkillSubject[] = [];

  get searchData(): CVSearchDtoData {
    return SearchModule.searchData;
  }

  getChipStyle(skill: CVSearchResultSkill): string {
    return `background-color: rgb(76,175,80, ${skill.interestLevel * (1 / 3)})`;
  }

  @Watch("searchInput")
  async searchInputChanged(input: string): Promise<void> {
    const skillSubjects = await ServiceManager.skillSubject.searchSkillSubjects(
      {
        name: input || "",
        limit: 10,
      }
    );

    this.skillSubjects = R.reject(
      (skillSubject: SkillSubject) =>
        !!R.find(
          (skill: CVSearchDtoSkill) =>
            R.equals(skill.skillSubjectId, skillSubject.id),
          SearchModule.searchData.skills || []
        ),
      skillSubjects
    );
  }

  @Watch("searchData")
  async searchDataChanged(): Promise<void> {
    await this.onSearch();
  }

  async created(): Promise<void> {
    await this.searchInputChanged("");
  }

  commonSkills(cvSearchResult: CVSearchResult): CVSearchResultSkill[] {
    return R.filter(
      (resultSkill) =>
        !!R.find(
          (skill) => R.equals(skill.skillSubjectId, resultSkill.skillSubjectId),
          this.searchData.skills || []
        ),
      cvSearchResult.skills
    );
  }

  onResultClick(cvSearchResult: CVSearchResult): void {
    this.popDialogComponent();
    const route = `/cv/${cvSearchResult.id}`;
    if (this.$route.path !== route) {
      this.$router.push(route);
    }
  }

  async onSearch(): Promise<void> {
    const cvSearchDto = new CVSearchDto({
      key: this.searchKey,
      data: this.searchData,
    });
    await this.searchAndDebounce(cvSearchDto, 100);
  }

  removeSelectedSkillSubject(resultSkill: CVSearchResultSkill): void {
    SearchModule.setSearchData({
      ...this.searchData,
      skills: R.reject(
        (skill) => R.equals(skill.skillSubjectId, resultSkill.skillSubjectId),
        this.searchData.skills || []
      ),
    });
  }

  onSelect(skillSubject: SkillSubject): void {
    this.$nextTick(() => {
      this.selectedSkillSubject = null;
    });

    const searchDtoSkill = new CVSearchDtoSkill();
    searchDtoSkill.skillSubjectId = skillSubject.id;
    searchDtoSkill.name = skillSubject.name;

    SearchModule.setSearchData({
      ...this.searchData,
      skills: [...(this.searchData.skills || []), searchDtoSkill],
    });
  }

  setSkillRequired(required: boolean, skill: CVSearchDtoSkill): void {
    SearchModule.setSearchData({
      ...this.searchData,
      skills: R.map((s) => {
        if (R.equals(s.skillSubjectId, skill.skillSubjectId)) {
          return { ...s, required };
        }
        return s;
      }, this.searchData.skills || []),
    });
  }

  setText(text: string): void {
    SearchModule.setSearchData({
      ...this.searchData,
      text,
    });
  }
}
</script>
