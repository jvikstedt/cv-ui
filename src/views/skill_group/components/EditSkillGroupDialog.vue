<template>
  <v-card :loading="fetching">
    <template v-if="!fetching && skillGroup">
      <v-card-title class="headline">{{ skillGroup.name }}</v-card-title>
      <v-form
        ref="form"
        v-model="valid"
        lazy-validation
        @submit.prevent="onSave"
      >
        <v-card-actions>
          <v-spacer></v-spacer>

          <AuthorizedButton
            :errorTooltip="DeleteTooltipError"
            :endpoint="`/skill_groups/${skillGroup.id}`"
            method="delete"
          >
            <template v-slot:btn="item">
              <v-btn
                color="red darken-1"
                :disabled="!item.valid"
                text
                @click="onDelete"
              >
                Delete
              </v-btn>
            </template>
          </AuthorizedButton>

          <v-btn color="red darken-1" text @click="onCancel"> Cancel </v-btn>

          <AuthorizedButton
            :errorTooltip="UpdateTooltipError"
            :endpoint="`/skill_groups/${skillGroup.id}`"
            method="patch"
          >
            <template v-slot:btn="item">
              <v-btn
                color="green darken-1"
                :disabled="!item.valid"
                text
                type="submit"
              >
                Save
              </v-btn>
            </template>
          </AuthorizedButton>
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

      <SkillSubjectList :skillGroupId="skillGroup.id" />
    </template>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Mixins } from "vue-property-decorator";
import { DialogFormMixin } from "@/mixins";
import SkillGroupModule, { SkillGroup } from "@/store/modules/skill_group";
import { ServiceManager, SkillGroupService } from "@/services";
import AuthModule from "@/store/modules/auth";
import SkillSubjectList from "@/views/skill_subject/components/SkillSubjectList.vue";
import AuthorizedButton from "@/components/AuthorizedButton.vue";
import { ROLES } from "@/constants";

@Component({
  components: {
    SkillSubjectList,
    AuthorizedButton,
  },
})
export default class EditSkillGroupDialog extends Mixins(DialogFormMixin) {
  @Prop({ required: true }) readonly skillGroup!: SkillGroup;
  @Prop({ required: false }) readonly afterSave!: (
    skillGroup: SkillGroup
  ) => Promise<void>;
  @Prop({ required: false }) readonly afterDelete!: (
    skillGroup: SkillGroup
  ) => Promise<void>;
  name = "";

  canEdit = AuthModule.hasRole(ROLES.ADMIN);

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

  async onDelete(): Promise<void> {
    if (confirm("Are you sure you want to delete?")) {
      await ServiceManager.skillGroup.deleteSkillGroup(this.skillGroup.id);

      if (this.afterDelete) {
        await this.afterDelete(this.skillGroup);
      }
      this.popDialogComponent();
    }
  }
}
</script>
