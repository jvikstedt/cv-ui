<template>
  <v-card>
    <v-card-title class="headline">New skill subject</v-card-title>

    <v-form v-model="valid">
      <v-card-text>
        <v-autocomplete
          v-model="selectedSkillGroup"
          :items="skillGroups"
          :search-input.sync="search"
          item-text="name"
          item-value="id"
          label="Skill group"
          placeholder="Start typing to search"
          @change="onSelect"
          return-object
        >
          <template v-slot:append-outer>
            <v-btn @click="newSkillSubject">New</v-btn>
          </template>
        </v-autocomplete>

        <v-text-field
          v-model="name"
          :counter="255"
          :rules="nameRules"
          label="Name"
          required
        ></v-text-field>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn color="green darken-1" text @click="onCancel">
          Cancel
        </v-btn>

        <v-btn :disabled="!valid" color="green darken-1" text @click="onSave">
          Save
        </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { namespace } from "vuex-class";
import { DialogComponent } from "@/dialog";
import { SkillSubject, CreateSkillSubjectDto, SkillGroup } from "@/model/skill";
import NewSkillGroupDialog from "@/views/skill_group/components/NewSkillGroupDialog.vue";
import { SearchSkillGroups } from "@/api/skill_group";

const SkillSubjectStore = namespace("SkillSubjectStore");
const DialogStore = namespace("DialogStore");

@Component
export default class NewSkillSubjectDialog extends Vue {
  @Prop({ required: true }) readonly afterCreate!: (
    skillSubject: SkillSubject
  ) => Promise<void>;

  public name = "";
  public skillGroupId!: number;

  @SkillSubjectStore.Action
  public createSkillSubject!: (
    createSkillSubjectDto: CreateSkillSubjectDto
  ) => Promise<SkillSubject>;

  @DialogStore.Mutation
  public popDialogComponent!: () => void;

  @DialogStore.Mutation
  public pushDialogComponent!: (dialogComponent: DialogComponent) => void;

  private valid = false;

  private search = "";
  private skillGroups: SkillGroup[] = [];
  private selectedSkillGroup: SkillGroup | null = null;

  @Watch("search")
  async searchChanged(keyword: string) {
    this.skillGroups = await SearchSkillGroups({
      name: keyword || "",
      limit: 10
    });
  }

  private nameRules = [
    (v: string) => !!v || "Name is required",
    (v: string) =>
      (v && v.length <= 255) || "Name must be less than 10 characters"
  ];

  private async onSelect(skillGroup: SkillGroup) {
    this.skillGroupId = skillGroup.id;
  }

  private async onSave(): Promise<void> {
    const skillSubject = await this.createSkillSubject({
      name: this.name,
      skillGroupId: this.skillGroupId
    });

    await this.afterCreate(skillSubject);
    this.popDialogComponent();
  }

  private async onCancel() {
    this.popDialogComponent();
  }

  private async newSkillSubject() {
    this.pushDialogComponent({
      component: NewSkillGroupDialog,
      props: { afterCreate: this.afterSkillGroupCreate }
    });
  }

  private async afterSkillGroupCreate(skillGroup: SkillGroup) {
    this.skillGroups = [...this.skillGroups, skillGroup];
    this.selectedSkillGroup = skillGroup;
    this.skillGroupId = skillGroup.id;
  }
}
</script>
