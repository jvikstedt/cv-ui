<template>
  <v-card>
    <v-card-title class="headline">New skill subject</v-card-title>

    <v-form ref="form" v-model="valid" lazy-validation>
      <v-card-text>
        <v-autocomplete
          v-model="skillGroup"
          :items="skillGroups"
          :search-input.sync="search"
          item-text="name"
          item-value="id"
          label="Skill group"
          placeholder="Start typing to search"
          :rules="skillGroupRules"
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

        <v-btn color="green darken-1" text @click="onSave">
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
import { VForm } from "@/types";

const SkillSubjectStore = namespace("SkillSubjectStore");
const DialogStore = namespace("DialogStore");

@Component
export default class NewSkillSubjectDialog extends Vue {
  @Prop({ required: true }) readonly afterCreate!: (
    skillSubject: SkillSubject
  ) => Promise<void>;

  @SkillSubjectStore.Action
  public createSkillSubject!: (
    createSkillSubjectDto: CreateSkillSubjectDto
  ) => Promise<SkillSubject>;

  @DialogStore.Mutation
  public popDialogComponent!: () => void;

  @DialogStore.Mutation
  public pushDialogComponent!: (dialogComponent: DialogComponent) => void;

  get form(): VForm {
    return this.$refs.form as VForm;
  }

  public valid = false;

  public search = "";
  public name = "";
  public nameRules = [(name: string) => !!name || "Name is required"];

  public skillGroups: SkillGroup[] = [];
  public skillGroup: SkillGroup | null = null;
  public skillGroupRules = [
    (skillGroup: SkillGroup) => !!skillGroup || "Skill group is required"
  ];

  @Watch("search")
  public async searchChanged(input: string) {
    this.skillGroups = await SearchSkillGroups({
      name: input || "",
      limit: 10
    });
  }

  public async onSave(): Promise<void> {
    if (this.form.validate() && this.skillGroup) {
      const skillSubject = await this.createSkillSubject({
        name: this.name,
        skillGroupId: this.skillGroup.id
      });

      await this.afterCreate(skillSubject);
      this.popDialogComponent();
    }
  }

  public async onCancel() {
    this.popDialogComponent();
  }

  public async newSkillSubject() {
    this.pushDialogComponent({
      component: NewSkillGroupDialog,
      props: { afterCreate: this.afterSkillGroupCreate }
    });
  }

  public async afterSkillGroupCreate(skillGroup: SkillGroup) {
    this.skillGroups = [...this.skillGroups, skillGroup];
    this.skillGroup = skillGroup;
  }
}
</script>
