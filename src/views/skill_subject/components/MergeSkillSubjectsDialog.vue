<template>
  <v-card>
    <v-card-title class="headline"
      >New merge request (skill subjects)</v-card-title
    >
    <v-form ref="form" v-model="valid" lazy-validation @submit.prevent="onSave">
      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn color="red darken-1" text @click="onCancel"> Cancel </v-btn>

        <v-btn color="green darken-1" text type="submit"> Create </v-btn>
      </v-card-actions>
      <v-card-text>
        <v-autocomplete
          name="sourceSkillSubject"
          v-model="sourceSkillSubject"
          :items="skillSubjects"
          :search-input.sync="sourceSearch"
          :rules="isRequiredRule"
          item-text="name"
          item-value="id"
          label="Source skill subject"
          placeholder="Start typing to search"
          return-object
        >
          <template slot="selection" slot-scope="data">
            {{ data.item.name }} ({{ data.item.skillGroup.name }})
          </template>
          <template slot="item" slot-scope="data">
            {{ data.item.name }} ({{ data.item.skillGroup.name }})
          </template>
        </v-autocomplete>

        <v-autocomplete
          name="targetSkillSubject"
          v-model="targetSkillSubject"
          :items="skillSubjects"
          :search-input.sync="targetSearch"
          :rules="isRequiredRule"
          item-text="name"
          item-value="id"
          label="Target skill subject"
          placeholder="Start typing to search"
          return-object
        >
          <template slot="selection" slot-scope="data">
            {{ data.item.name }} ({{ data.item.skillGroup.name }})
          </template>
          <template slot="item" slot-scope="data">
            {{ data.item.name }} ({{ data.item.skillGroup.name }})
          </template>
        </v-autocomplete>

        <v-text-field
          v-model="description"
          name="description"
          :counter="255"
          label="Description"
          :rules="isRequiredRule"
          required
        ></v-text-field>
      </v-card-text>
    </v-form>
  </v-card>
</template>

<script lang="ts">
import { Component, Watch, Mixins, Prop } from "vue-property-decorator";
import SkillSubjectModule, {
  SkillSubject,
} from "@/store/modules/skill_subject";
import { DialogFormMixin } from "@/mixins";
import { ServiceManager } from "@/services";
import { MergeRequest } from "@/store/modules/merge_request";

@Component
export default class MergeSkillSubjectsDialog extends Mixins(DialogFormMixin) {
  @Prop({ required: true }) readonly afterCreate!: (
    mergeRequest: MergeRequest
  ) => Promise<void>;

  sourceSearch = "";
  targetSearch = "";
  description = "";
  sourceSkillSubject: SkillSubject | null = null;
  targetSkillSubject: SkillSubject | null = null;

  get skillSubjects(): SkillSubject[] {
    return SkillSubjectModule.list;
  }

  @Watch("sourceSearch")
  @Watch("targetSearch")
  async searchChanged(keyword: string): Promise<void> {
    await ServiceManager.skillSubject.searchSkillSubjects({
      name: keyword || "",
    });
  }

  async onSave(): Promise<void> {
    if (
      this.form.validate() &&
      this.sourceSkillSubject &&
      this.targetSkillSubject
    ) {
      const mergeRequest = await ServiceManager.mergeRequest.createMergeRequest(
        {
          entity: "SkillSubject",
          sourceId: this.sourceSkillSubject.id,
          targetId: this.targetSkillSubject.id,
          description: this.description,
        }
      );

      await this.afterCreate(mergeRequest);
      this.popDialogComponent();
    }
  }
}
</script>
