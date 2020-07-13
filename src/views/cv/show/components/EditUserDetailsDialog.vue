<template>
  <v-card>
    <v-card-title class="headline">
      {{ user.firstName }} {{ user.lastName }}
    </v-card-title>

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
      ></v-text-field>

      <v-text-field
        name="lastName"
        v-model="lastName"
        label="Last name"
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
  </v-card>
</template>

<script lang="ts">
import * as R from "ramda";
import { Component, Vue, Prop } from "vue-property-decorator";
import { namespace } from "vuex-class";
import { User, PatchUserDto } from "@/model/user";
import { CreateFile } from "@/api/file";
import { CV } from "@/model/cv";

const CVShowStore = namespace("CVShowStore");
const DialogStore = namespace("DialogStore");

@Component
export default class EditUserNamesDialog extends Vue {
  @Prop({ required: true }) readonly id!: number;

  @CVShowStore.Getter
  public getCV!: (id: number) => CV;

  @CVShowStore.Action
  public patchUser!: (patchUserDto: PatchUserDto) => Promise<void>;

  @DialogStore.Mutation
  public popDialogComponent!: () => void;

  private firstName = "";
  private lastName = "";
  private avatarId = "";

  get user(): User {
    return this.getCV(this.id).user;
  }

  private created() {
    this.firstName = this.user.firstName;
    this.lastName = this.user.lastName;
    this.avatarId = this.user.avatarId;
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

  private async onFileChange(file: File) {
    if (file) {
      const createdFile = await CreateFile({ file });
      this.avatarId = createdFile.id;
    }
  }

  private async onSave() {
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

  private async onCancel() {
    this.popDialogComponent();
  }
}
</script>
