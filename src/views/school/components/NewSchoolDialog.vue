<template>
  <v-card>
    <v-card-title class="headline">New school</v-card-title>

    <v-form v-model="valid">
      <v-card-text>
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
import { Component, Vue, Prop } from "vue-property-decorator";
import { namespace } from "vuex-class";
import { DialogComponent } from "@/dialog";
import { School, CreateSchoolDto } from "@/model/education";

const SchoolStore = namespace("SchoolStore");
const DialogStore = namespace("DialogStore");

@Component
export default class NewSchoolDialog extends Vue {
  @Prop({ required: true }) readonly afterCreate!: (
    School: School
  ) => Promise<void>;

  public name = "";

  @SchoolStore.Action
  public createSchool!: (createSchoolDto: CreateSchoolDto) => Promise<School>;

  @DialogStore.Mutation
  public popDialogComponent!: () => void;

  @DialogStore.Mutation
  public pushDialogComponent!: (dialogComponent: DialogComponent) => void;

  private valid = false;

  private nameRules = [
    (v: string) => !!v || "Name is required",
    (v: string) =>
      (v && v.length <= 255) || "Name must be less than 10 characters"
  ];

  private async onSave(): Promise<void> {
    const school = await this.createSchool({
      name: this.name
    });

    await this.afterCreate(school);
    this.popDialogComponent();
  }

  private async onCancel() {
    this.popDialogComponent();
  }
}
</script>
