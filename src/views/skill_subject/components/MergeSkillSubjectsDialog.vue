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
        <p>
          This will create a new background job which requires admin approval.
        </p>
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
import { Job } from "@/store/modules/job";

@Component
export default class MergeSkillSubjectsDialog extends Mixins(DialogFormMixin) {
  @Prop({ required: true }) readonly afterCreate!: (job: Job) => Promise<void>;

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
      const description = `${this.sourceSkillSubject.name} -> ${this.targetSkillSubject.name}`;
      const job = await ServiceManager.job.createJob({
        runner: "SkillSubjectMerge",
        data: {
          sourceId: this.sourceSkillSubject.id,
          targetId: this.targetSkillSubject.id,
        },
        description,
      });

      await this.afterCreate(job);
      this.popDialogComponent();
    }
  }
}
</script>
