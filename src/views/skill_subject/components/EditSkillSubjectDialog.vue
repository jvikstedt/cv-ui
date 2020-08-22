<template>
  <v-card :loading="fetching">
    <template v-if="!fetching && skillSubject">
      <v-card-title class="headline"
        >{{ skillSubject.skillGroup.name }} /
        {{ skillSubject.name }}</v-card-title
      >
      <v-form
        ref="form"
        v-model="valid"
        lazy-validation
        @submit.prevent="onSave"
      >
        <v-card-text>
          <v-text-field
            v-model="name"
            :counter="255"
            :rules="isRequiredRule"
            label="Name"
            required
          ></v-text-field>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="red darken-1" text @click="onCancel">
            Cancel
          </v-btn>

          <v-btn color="green darken-1" text type="submit">
            Save
          </v-btn>
        </v-card-actions>
      </v-form>

      <v-card-text>
        <h2>People with this skill</h2>
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
                </v-list-item-content>
              </v-list-item>
            </template>
          </template>
          <p v-else>No people</p>
        </v-list>
      </v-card-text>
    </template>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Mixins } from "vue-property-decorator";
import { namespace } from "vuex-class";
import { DialogFormMixin, SearchMixin } from "@/mixins";
import { SkillSubject, PatchSkillSubjectDto } from "@/model/skill_subject";
import { CVSearchDto } from "../../../model/cv";

const SkillSubjectStore = namespace("SkillSubjectStore");

@Component
export default class EditSkillSubjectDialog extends Mixins(
  SearchMixin,
  DialogFormMixin
) {
  @Prop({ required: true }) readonly skillSubjectId!: number;
  searchKey = "SkillSearchKey";

  name = "";

  @SkillSubjectStore.State
  fetching!: boolean;

  @SkillSubjectStore.Getter
  getSkillSubject!: (skillSubjectId: number) => SkillSubject;

  @SkillSubjectStore.Action
  fetchSkillSubject!: (skillSubjectId: number) => Promise<SkillSubject>;

  @SkillSubjectStore.Action
  patchSkillSubject!: (
    patchSkillSubjectDto: PatchSkillSubjectDto
  ) => Promise<void>;

  get skillSubject(): SkillSubject {
    return this.getSkillSubject(this.skillSubjectId);
  }

  async created() {
    const skillSubject = await this.fetchSkillSubject(this.skillSubjectId);
    this.name = skillSubject.name;

    const cvSearchDto = new CVSearchDto({
      key: this.searchKey,
      data: {
        skills: [{ required: true, skillSubjectId: this.skillSubjectId }],
        limit: 5
      }
    });
    await this.searchCVs(cvSearchDto);
  }

  async onSave() {
    if (this.form.validate()) {
      const skillSubject = this.getSkillSubject(this.skillSubjectId);

      const patchSkillSubjectDto: PatchSkillSubjectDto = {
        skillSubjectId: skillSubject.id,
        data: {
          name: this.name
        }
      };
      await this.patchSkillSubject(patchSkillSubjectDto);

      this.popDialogComponent();
    }
  }
}
</script>
