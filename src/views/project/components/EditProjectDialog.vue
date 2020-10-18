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
    </template>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Mixins } from "vue-property-decorator";
import { DialogFormMixin } from "@/mixins";
import ProjectModule, { Project } from "@/store/modules/project";
import { ServiceManager, ProjectService } from "@/services";

@Component
export default class EditProjectDialog extends Mixins(DialogFormMixin) {
  @Prop({ required: true }) readonly project!: Project;
  @Prop({ required: false }) readonly afterSave!: (
    project: Project
  ) => Promise<void>;

  name = "";

  get fetching(): boolean {
    return ProjectModule.fetching;
  }

  async created(): Promise<void> {
    this.name = this.project.name;
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
