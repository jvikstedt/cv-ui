<template>
  <v-card :loading="fetching">
    <template v-if="!fetching && project">
      <v-card-title class="headline"
        >{{ project.company.name }} / {{ project.name }}</v-card-title
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
        <h2>Project members</h2>
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
import ProjectModule, { Project } from "@/store/modules/project";
import { ServiceManager, ProjectService } from "@/services";
import AuthModule from "@/store/modules/auth";
import { CVSearchDto } from "@/store/modules/cv";

@Component
export default class EditProjectDialog extends Mixins(
  SearchMixin,
  DialogFormMixin
) {
  @Prop({ required: true }) readonly project!: Project;
  @Prop({ required: false }) readonly afterSave!: (
    project: Project
  ) => Promise<void>;
  searchKey = "ProjectMembershipSearchKey";
  name = "";

  canEdit = AuthModule.hasRole("ADMIN");

  get fetching(): boolean {
    return ProjectModule.fetching;
  }

  async created(): Promise<void> {
    this.name = this.project.name;

    const cvSearchDto = new CVSearchDto({
      key: this.searchKey,
      data: {
        projectMemberships: [{ required: true, projectId: this.project.id }],
        limit: 5,
      },
    });
    await this.searchCVs(cvSearchDto);
  }

  async onSave(): Promise<void> {
    if (this.form.validate()) {
      const patchProjectDto: ProjectService.PatchProjectDto = {
        projectId: this.project.id,
        data: {
          name: this.name,
        },
      };
      const project = await ServiceManager.project.patchProject(
        patchProjectDto
      );

      if (this.afterSave) {
        await this.afterSave(project);
      }
      this.popDialogComponent();
    }
  }
}
</script>
