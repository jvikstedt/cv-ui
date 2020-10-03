<template>
  <v-card>
    <v-card-title class="headline">New skill subject</v-card-title>

    <v-form ref="form" v-model="valid" lazy-validation @submit.prevent="onSave">
      <v-card-text>
        <v-autocomplete
          v-model="skillGroup"
          :items="skillGroups"
          :search-input.sync="search"
          item-text="name"
          item-value="id"
          label="Skill group"
          placeholder="Start typing to search"
          :rules="isRequiredRule"
          return-object
        >
          <template v-slot:append-outer>
            <v-btn @click="newSkillGroup">New</v-btn>
          </template>
        </v-autocomplete>

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

        <v-btn color="red darken-1" text @click="onCancel"> Cancel </v-btn>

        <v-btn color="green darken-1" text type="submit"> Save </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Watch, Mixins } from "vue-property-decorator";
import SkillGroupModule, { SkillGroup } from "@/store/modules/skill_group";
import NewSkillGroupDialog from "@/views/skill_group/components/NewSkillGroupDialog.vue";
import { DialogFormMixin } from "@/mixins";
import SkillSubjectModule, {
  SkillSubject,
} from "@/store/modules/skill_subject";

@Component
export default class NewSkillSubjectDialog extends Mixins(DialogFormMixin) {
  @Prop({ required: false }) readonly afterCreate!: (
    skillSubject: SkillSubject
  ) => Promise<void>;

  name = "";

  search = "";
  skillGroups: SkillGroup[] = [];
  skillGroup: SkillGroup | null = null;

  @Watch("search")
  async searchChanged(input: string): Promise<void> {
    this.skillGroups = await SkillGroupModule.searchSkillGroups({
      name: input || "",
      limit: 10,
    });
  }

  async onSave(): Promise<void> {
    if (this.form.validate() && this.skillGroup) {
      const skillSubject = await SkillSubjectModule.createSkillSubject({
        name: this.name,
        skillGroupId: this.skillGroup.id,
      });

      if (this.afterCreate) {
        await this.afterCreate(skillSubject);
      }
      this.popDialogComponent();
    }
  }

  newSkillGroup(): void {
    this.pushDialogComponent({
      component: NewSkillGroupDialog,
      props: { afterCreate: this.afterSkillGroupCreate },
    });
  }

  afterSkillGroupCreate(skillGroup: SkillGroup): void {
    this.skillGroups = [...this.skillGroups, skillGroup];
    this.skillGroup = skillGroup;
  }
}
</script>
