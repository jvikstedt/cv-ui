<template>
  <v-card :loading="searching">
    <v-card-title class="headline">Search</v-card-title>

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

      <v-btn id="search-view-search-btn" @click="onSearch">
        Search
      </v-btn>

      <v-btn color="green darken-1" text @click="onCancel">
        Close
      </v-btn>

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
  CVSearchResultSkill
} from "@/model/cv";
import { namespace } from "vuex-class";
import { SkillSubject } from "@/model/skill_subject";
import { SearchSkillSubjects } from "@/api/skill_subject";
import { SearchMixin, DialogFormMixin } from "@/mixins";

const CVSearchStore = namespace("CVSearchStore");

@Component
export default class CVSearchView extends Mixins(SearchMixin, DialogFormMixin) {
  searchKey = "CVSearchView";

  searchInput = null;
  selectedSkillSubject: SkillSubject | null = null;
  skillSubjects: SkillSubject[] = [];

  @CVSearchStore.State
  searchData!: CVSearchDtoData;

  @CVSearchStore.Mutation
  setSearchData!: (searchData: CVSearchDtoData) => void;

  @Watch("searchInput")
  async searchInputChanged(input: string) {
    const skillSubjects = await SearchSkillSubjects({
      name: input || "",
      limit: 10
    });

    this.skillSubjects = R.reject(
      (skillSubject: SkillSubject) =>
        !!R.find(
          (skill: CVSearchDtoSkill) =>
            R.equals(skill.skillSubjectId, skillSubject.id),
          this.searchData.skills || []
        ),
      skillSubjects
    );
  }

  @Watch("searchData")
  async searchDataChanged() {
    await this.onSearch();
  }

  async created() {
    await this.searchInputChanged("");
  }

  commonSkills(cvSearchResult: CVSearchResult) {
    return R.filter(
      resultSkill =>
        !!R.find(
          skill => R.equals(skill.skillSubjectId, resultSkill.skillSubjectId),
          this.searchData.skills || []
        ),
      cvSearchResult.skills
    );
  }

  onResultClick(cvSearchResult: CVSearchResult) {
    this.popDialogComponent();
    const route = `/cv/${cvSearchResult.id}`;
    if (this.$route.path !== route) {
      this.$router.push(route);
    }
  }

  async onSearch() {
    const cvSearchDto = new CVSearchDto({
      key: this.searchKey,
      data: this.searchData
    });
    await this.searchAndDebounce(cvSearchDto, 100);
  }

  async removeSelectedSkillSubject(resultSkill: CVSearchResultSkill) {
    this.setSearchData({
      ...this.searchData,
      skills: R.reject(
        skill => R.equals(skill.skillSubjectId, resultSkill.skillSubjectId),
        this.searchData.skills || []
      )
    });
  }

  async onSelect(skillSubject: SkillSubject) {
    this.$nextTick(() => {
      this.selectedSkillSubject = null;
    });

    const searchDtoSkill = new CVSearchDtoSkill();
    searchDtoSkill.skillSubjectId = skillSubject.id;
    searchDtoSkill.name = skillSubject.name;

    this.setSearchData({
      ...this.searchData,
      skills: [...(this.searchData.skills || []), searchDtoSkill]
    });
  }

  setSkillRequired(required: boolean, skill: CVSearchDtoSkill) {
    this.setSearchData({
      ...this.searchData,
      skills: R.map(s => {
        if (R.equals(s.skillSubjectId, skill.skillSubjectId)) {
          return { ...s, required };
        }
        return s;
      }, this.searchData.skills || [])
    });
  }

  setText(text: string) {
    this.setSearchData({
      ...this.searchData,
      text
    });
  }
}
</script>
