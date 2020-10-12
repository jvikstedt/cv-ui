<template>
  <v-card>
    <v-card-title class="headline">
      {{ user.firstName }} {{ user.lastName }}
    </v-card-title>

    <v-form ref="form" v-model="valid" lazy-validation @submit.prevent="onSave">
      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn color="red darken-1" text @click="onCancel"> Cancel </v-btn>

        <v-btn v-if="canEdit" color="green darken-1" text type="submit">
          Save
        </v-btn>
      </v-card-actions>
      <v-card-text>
        <p class="text-center">
          <v-avatar size="146.6" tile color="indigo">
            <v-img v-if="avatarSrc" :src="avatarSrc"></v-img>
            <span v-else class="white--text headline">{{ initials }}</span>
          </v-avatar>
        </p>
        <v-file-input
          v-if="canEdit"
          label="File input"
          @change="onFileChange"
        />

        <v-text-field
          name="firstName"
          v-model="firstName"
          label="First name"
          :rules="isRequiredRule"
          :readonly="!canEdit"
        ></v-text-field>

        <v-text-field
          name="lastName"
          v-model="lastName"
          label="Last name"
          :rules="isRequiredRule"
          :readonly="!canEdit"
        ></v-text-field>

        <v-text-field
          name="jobTitle"
          v-model="jobTitle"
          label="Job title"
          :rules="isRequiredRule"
          :readonly="!canEdit"
        ></v-text-field>

        <v-text-field
          v-model="workExperienceInYears"
          label="Work experience in years"
          :rules="isRequiredRule"
          type="number"
          :readonly="!canEdit"
        ></v-text-field>

        <v-text-field
          name="phone"
          v-model="phone"
          label="Phone"
          :rules="isRequiredRule"
          :readonly="!canEdit"
        ></v-text-field>

        <v-text-field
          name="location"
          v-model="location"
          label="Location"
          :rules="isRequiredRule"
          :readonly="!canEdit"
        ></v-text-field>

        <v-text-field
          name="email"
          v-model="email"
          label="Email"
          :rules="isRequiredRule"
          :readonly="!canEdit"
        ></v-text-field>
      </v-card-text>
    </v-form>
  </v-card>
</template>

<script lang="ts">
import * as R from "ramda";
import { Component, Prop, Mixins } from "vue-property-decorator";
import { User } from "@/store/modules/user";
import { CreateFile } from "@/api/file";
import { DialogFormMixin } from "@/mixins";
import { ServiceManager, UserService } from "@/services";

@Component
export default class EditUserNamesDialog extends Mixins(DialogFormMixin) {
  @Prop({ required: true }) readonly user!: User;
  @Prop({ required: false }) readonly canEdit!: boolean;

  firstName = "";
  lastName = "";
  jobTitle = "";
  phone = "";
  location = "";
  workExperienceInYears = 1;
  email = "";
  avatarId = "";

  created(): void {
    this.firstName = this.user.firstName;
    this.lastName = this.user.lastName;
    this.jobTitle = this.user.jobTitle;
    this.phone = this.user.phone;
    this.location = this.user.location;
    this.workExperienceInYears = this.user.workExperienceInYears;
    this.email = this.user.email;
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

  async onFileChange(file: File): Promise<void> {
    if (file) {
      const createdFile = await CreateFile({ file });
      this.avatarId = createdFile.id;
    }
  }

  async onSave(): Promise<void> {
    if (this.form.validate()) {
      const patchUserDto: UserService.PatchUserDto = {
        id: this.user.id,
        data: {
          firstName: this.firstName,
          lastName: this.lastName,
          jobTitle: this.jobTitle,
          phone: this.phone,
          location: this.location,
          workExperienceInYears: this.workExperienceInYears,
          email: this.email,
          avatarId: this.avatarId,
        },
      };

      await ServiceManager.user.patchUser(patchUserDto);

      this.popDialogComponent();
    }
  }
}
</script>
