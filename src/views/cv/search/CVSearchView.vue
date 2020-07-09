<template>
  <v-card>
    <v-card-title class="headline">Search</v-card-title>

    <v-card-text>
      <v-text-field label="name" v-model="fullName"></v-text-field>

      <v-autocomplete
        v-model="selectedSkillSubject"
        :items="skillSubjects"
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
        <template v-if="searching">
          <v-progress-circular
            indeterminate
            color="primary"
          ></v-progress-circular>
        </template>
        <template v-else-if="results.length">
          <template v-for="item in results">
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
    </v-card-text>

    <v-card-actions>
      <v-spacer></v-spacer>

      <v-btn color="green darken-1" text @click="onCancel">
        Close
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import * as R from "ramda";
import { Component, Vue, Watch } from "vue-property-decorator";
import { namespace } from "vuex-class";
import { CVSearchDtoSkill, CVSearchDto, CVSearchResult } from "@/model/cv";
import { SkillSubject } from "@/model/skill";
import { SearchSkillSubjects } from "@/api/skill_subject";

class SkillSearchOption extends CVSearchDtoSkill {
  name!: string;
}

const CVSearchStore = namespace("CVSearchStore");
const DialogStore = namespace("DialogStore");

@Component
export default class CVSearchView extends Vue {
  private fullName = "";

  private search = "";
  private selectedSkillSubject: SkillSubject | null = null;
  private skillSubjects: SkillSubject[] = [];

  private skillSearchOptions: SkillSearchOption[] = [];

  @CVSearchStore.State
  public searching!: boolean;

  @CVSearchStore.State
  public results!: CVSearchResult[];

  @CVSearchStore.Action
  public searchCVs!: (cvSearchDto: CVSearchDto) => Promise<void>;

  @DialogStore.Mutation
  public popDialogComponent!: () => void;

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

  private commonSkills(cvSearchResult: CVSearchResult) {
    return R.filter(
      skill =>
        !!R.find(
          option => R.equals(option.skillSubjectId, skill.skillSubjectId),
          this.skillSearchOptions
        ),
      cvSearchResult.skills
    );
  }

  private onResultClick(cvSearchResult: CVSearchResult) {
    this.popDialogComponent();
    this.$router.push(`/cv/${cvSearchResult.id}`);
  }

  private async onSearch() {
    const cvSearchDto = new CVSearchDto({
      fullName: this.fullName,
      skills: this.skillSearchOptions
    });
    await this.searchCVs(cvSearchDto);
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

  private async onCancel() {
    this.popDialogComponent();
  }
}
</script>
