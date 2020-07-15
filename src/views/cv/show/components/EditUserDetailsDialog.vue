<template>
  <v-card>
    <v-card-title class="headline">
      {{ user.firstName }} {{ user.lastName }}
    </v-card-title>

    <v-form ref="form" v-model="valid" lazy-validation @submit.prevent="onSave">
      <v-card-text>
        <p class="text-center">
          <v-avatar size="146.6" tile color="indigo">
            <v-img v-if="avatarSrc" :src="avatarSrc"></v-img>
            <span v-else class="white--text headline">{{ initials }}</span>
          </v-avatar>
        </p>
        <v-file-input label="File input" @change="onFileChange" />

        <v-text-field
          name="firstName"
          v-model="firstName"
          label="First name"
          :rules="firstNameRules"
        ></v-text-field>

        <v-text-field
          name="lastName"
          v-model="lastName"
          label="Last name"
          :rules="lastNameRules"
        ></v-text-field>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn color="green darken-1" text @click="onCancel">
          Cancel
        </v-btn>

        <v-btn color="green darken-1" text type="submit">
          Save
        </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script lang="ts">
import * as R from "ramda";
import { Component, Vue, Prop } from "vue-property-decorator";
import { namespace } from "vuex-class";
import { User, PatchUserDto } from "@/model/user";
import { CreateFile } from "@/api/file";
import { CV } from "@/model/cv";
import { VForm } from "@/types";

const CVShowStore = namespace("CVShowStore");
const DialogStore = namespace("DialogStore");

@Component
export default class EditUserNamesDialog extends Vue {
  @Prop({ required: true }) readonly id!: number;

  @CVShowStore.Getter
  getCV!: (id: number) => CV;

  @CVShowStore.Action
  patchUser!: (patchUserDto: PatchUserDto) => Promise<void>;

  @DialogStore.Mutation
  popDialogComponent!: () => void;

  valid = false;
  firstName = "";
  firstNameRules = [(v: string) => !!v || "First name is required"];
  lastName = "";
  lastNameRules = [(v: string) => !!v || "Last name is required"];
  avatarId = "";

  get user(): User {
    return this.getCV(this.id).user;
  }

  created() {
    this.firstName = this.user.firstName;
    this.lastName = this.user.lastName;
    this.avatarId = this.user.avatarId;
  }

  get form(): VForm {
    return this.$refs.form as VForm;
  }

  get avatarSrc(): string | null {
    if (this.avatarId) {
      return `/api/files/${this.avatarId}`;
    }
    return null;
  }

  get initials(): string {
    return R.toUpper(`${this.user.firstName[0]}${this.user.lastName[0]}`);
  }

  async onFileChange(file: File) {
    if (file) {
      const createdFile = await CreateFile({ file });
      this.avatarId = createdFile.id;
    }
  }

  async onSave() {
    if (this.form.validate()) {
      const patchUserDto: PatchUserDto = {
        id: this.user.id,
        data: {
          firstName: this.firstName,
          lastName: this.lastName,
          avatarId: this.avatarId
        }
      };

      await this.patchUser(patchUserDto);

      this.popDialogComponent();
    }
  }

  async onCancel() {
    this.popDialogComponent();
  }
}
</script>
