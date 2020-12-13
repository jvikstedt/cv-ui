<template>
  <v-card :loading="fetching">
    <template v-if="!fetching && school">
      <v-card-title class="headline">{{ school.name }}</v-card-title>
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
        <h2>People who studied in this school</h2>
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
import SchoolModule, { School } from "@/store/modules/school";
import { ServiceManager, SchoolService } from "@/services";
import AuthModule from "@/store/modules/auth";
import { CVSearchDto } from "@/store/modules/cv";

@Component
export default class EditSchoolDialog extends Mixins(
  SearchMixin,
  DialogFormMixin
) {
  @Prop({ required: true }) readonly school!: School;
  @Prop({ required: false }) readonly afterSave!: (
    school: School
  ) => Promise<void>;
  searchKey = "EducationshipSearchKey";
  name = "";

  canEdit = AuthModule.hasRole("ADMIN");

  get fetching(): boolean {
    return SchoolModule.fetching;
  }

  async created(): Promise<void> {
    this.name = this.school.name;

    const cvSearchDto = new CVSearchDto({
      key: this.searchKey,
      data: {
        educations: [{ required: true, schoolId: this.school.id }],
        limit: 5,
      },
    });
    await this.searchCVs(cvSearchDto);
  }

  async onSave(): Promise<void> {
    if (this.form.validate()) {
      const patchSchoolDto: SchoolService.PatchSchoolDto = {
        schoolId: this.school.id,
        data: {
          name: this.name,
        },
      };
      const school = await ServiceManager.school.patchSchool(patchSchoolDto);

      if (this.afterSave) {
        await this.afterSave(school);
      }
      this.popDialogComponent();
    }
  }
}
</script>
