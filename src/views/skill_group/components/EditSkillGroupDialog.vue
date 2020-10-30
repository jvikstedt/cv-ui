<template>
  <v-card :loading="fetching">
    <template v-if="!fetching && skillGroup">
      <v-card-title class="headline">{{ skillGroup.name }}</v-card-title>
      <v-form
        ref="form"
        v-model="valid"
        lazy-validation
        :readonly="!canEdit"
        @submit.prevent="onSave"
      >
        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="red darken-1" text @click="onCancel"> Cancel </v-btn>

          <v-btn color="green darken-1" :disabled="!canEdit" text type="submit">
            Save
          </v-btn>
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
import SkillGroupModule, { SkillGroup } from "@/store/modules/skill_group";
import { ServiceManager, SkillGroupService } from "@/services";
import AuthModule from "@/store/modules/auth";

@Component
export default class EditSkillGroupDialog extends Mixins(DialogFormMixin) {
  @Prop({ required: true }) readonly skillGroup!: SkillGroup;
  @Prop({ required: false }) readonly afterSave!: (
    skillGroup: SkillGroup
  ) => Promise<void>;
  name = "";

  canEdit = AuthModule.hasRole("ADMIN");

  get fetching(): boolean {
    return SkillGroupModule.fetching;
  }

  async created(): Promise<void> {
    this.name = this.skillGroup.name;
  }

  async onSave(): Promise<void> {
    if (this.form.validate()) {
      const patchSkillGroupDto: SkillGroupService.PatchSkillGroupDto = {
        skillGroupId: this.skillGroup.id,
        data: {
          name: this.name,
        },
      };
      const skillGroup = await ServiceManager.skillGroup.patchSkillGroup(
        patchSkillGroupDto
      );

      if (this.afterSave) {
        await this.afterSave(skillGroup);
      }
      this.popDialogComponent();
    }
  }
}
</script>
