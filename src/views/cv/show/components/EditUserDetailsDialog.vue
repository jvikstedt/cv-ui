<template>
  <v-dialog v-model="dialog" max-width="600">
    <template v-slot:activator="{ on, attrs }">
      <v-btn icon small v-bind="attrs" v-on="on">
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title class="headline">
        {{ user.firstName }} {{ user.lastName }}
      </v-card-title>

      <v-card-text>
        <p class="text-center">
          <v-avatar size="146.6" tile>
            <v-img :src="avatarSrc"></v-img>
          </v-avatar>
        </p>
        <v-file-input label="File input" @change="onFileChange" />

        <v-text-field v-model="firstName" label="First name"></v-text-field>

        <v-text-field v-model="lastName" label="Last name"></v-text-field>
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
  </v-dialog>
</template>

<script lang="ts">
import * as R from "ramda";
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { User, PatchUserDto } from "@/model";
import { CreateFile } from "@/api/file";

@Component
export default class EditUserNamesDialog extends Vue {
  @Prop({ required: true }) readonly user!: User;
  @Prop({ required: true }) readonly patchUser!: (
    patchUserDto: PatchUserDto
  ) => Promise<void>;

  private dialog = false;

  private firstName = "";
  private lastName = "";
  private avatarId = "";

  @Watch("dialog")
  dialogChanged(dialog: boolean) {
    if (dialog) {
      this.firstName = this.user.firstName;
      this.lastName = this.user.lastName;
      this.avatarId = this.user.avatarId;
    }
  }

  get avatarSrc(): string {
    if (!R.isEmpty(this.avatarId)) {
      return `/api/files/${this.avatarId}`;
    }
    return "";
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

    this.dialog = false;
  }

  private async onCancel() {
    this.dialog = false;
  }
}
</script>
