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
        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="red darken-1" text @click="onCancel"> Cancel </v-btn>

          <v-btn color="green darken-1" text type="submit"> Save </v-btn>
        </v-card-actions>
        <v-card-text>
          <v-text-field
            v-model="name"
            :counter="255"
            :rules="isRequiredRule"
            label="Name"
            required
          ></v-text-field>
        </v-card-text>
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
import { DialogFormMixin, SearchMixin } from "@/mixins";
import { CVSearchDto } from "@/store/modules/cv";
import SkillSubjectModule, {
  SkillSubject,
} from "@/store/modules/skill_subject";
import { ServiceManager, SkillSubjectService } from "@/services";

@Component
export default class EditSkillSubjectDialog extends Mixins(
  SearchMixin,
  DialogFormMixin
) {
  @Prop({ required: true }) readonly skillSubject!: SkillSubject;
  @Prop({ required: false }) readonly afterSave!: (
    skillSubject: SkillSubject
  ) => Promise<void>;
  searchKey = "SkillSearchKey";

  name = "";

  get fetching(): boolean {
    return SkillSubjectModule.fetching;
  }

  async created(): Promise<void> {
    this.name = this.skillSubject.name;

    const cvSearchDto = new CVSearchDto({
      key: this.searchKey,
      data: {
        skills: [{ required: true, skillSubjectId: this.skillSubject.id }],
        limit: 5,
      },
    });
    await this.searchCVs(cvSearchDto);
  }

  async onSave(): Promise<void> {
    if (this.form.validate()) {
      const patchSkillSubjectDto: SkillSubjectService.PatchSkillSubjectDto = {
        skillSubjectId: this.skillSubject.id,
        data: {
          name: this.name,
        },
      };
      const skillSubject = await ServiceManager.skillSubject.patchSkillSubject(
        patchSkillSubjectDto
      );

      if (this.afterSave) {
        await this.afterSave(skillSubject);
      }
      this.popDialogComponent();
    }
  }
}
</script>
