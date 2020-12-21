<template>
  <v-card>
    <v-card-title class="headline">Merge skill subjects</v-card-title>
    <v-card-actions>
      <v-spacer></v-spacer>

      <v-btn color="red darken-1" text @click="onCancel"> Cancel </v-btn>

      <v-btn color="green darken-1" text @click="onMerge"> Merge </v-btn>
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
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { Component, Watch, Mixins } from "vue-property-decorator";
import SkillSubjectModule, {
  SkillSubject,
} from "@/store/modules/skill_subject";
import { DialogFormMixin } from "@/mixins";
import { ServiceManager } from "@/services";

@Component
export default class MergeSkillSubjectsDialog extends Mixins(DialogFormMixin) {
  sourceSearch = "";
  targetSearch = "";
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

  async onMerge(): Promise<void> {
    if (this.sourceSkillSubject && this.targetSkillSubject) {
      await ServiceManager.skillSubject.mergeSkillSubjects({
        sourceId: this.sourceSkillSubject.id,
        targetId: this.targetSkillSubject.id,
      });
      this.popDialogComponent();
    }
  }
}
</script>
