<template>
  <v-card>
    <v-card-title class="headline">New user</v-card-title>

    <v-form ref="form" v-model="valid" lazy-validation @submit.prevent="onSave">
      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn color="red darken-1" text @click="onCancel"> Cancel </v-btn>

        <v-btn color="green darken-1" text type="submit"> Save </v-btn>
      </v-card-actions>
      <v-card-text>
        <v-text-field
          name="firstName"
          v-model="firstName"
          label="First name"
          :rules="isRequiredRule"
        ></v-text-field>

        <v-text-field
          name="lastName"
          v-model="lastName"
          label="Last name"
          :rules="isRequiredRule"
        ></v-text-field>

        <v-text-field
          name="jobTitle"
          v-model="jobTitle"
          label="Job title"
          :rules="isRequiredRule"
        ></v-text-field>

        <v-text-field
          v-model.number="workExperienceInYears"
          label="Work experience in years"
          :rules="isRequiredRule"
          type="number"
        ></v-text-field>

        <v-text-field
          name="phone"
          v-model="phone"
          label="Phone"
          :rules="isRequiredRule"
        ></v-text-field>

        <v-text-field
          name="location"
          v-model="location"
          label="Location"
          :rules="isRequiredRule"
        ></v-text-field>

        <v-text-field
          name="email"
          v-model="email"
          label="Email"
          :rules="isRequiredRule"
        ></v-text-field>
      </v-card-text>
    </v-form>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Mixins } from "vue-property-decorator";
import { DialogFormMixin } from "@/mixins";
import { User } from "@/store/modules/user";
import { ServiceManager } from "@/services";

@Component
export default class NewUserDialog extends Mixins(DialogFormMixin) {
  @Prop({ required: false }) readonly afterCreate!: (
    user: User
  ) => Promise<void>;

  firstName = "";
  lastName = "";
  jobTitle = "";
  phone = "";
  location = "";
  workExperienceInYears = 1;
  email = "";

  async onSave(): Promise<void> {
    if (this.form.validate()) {
      const user = await ServiceManager.user.createUser({
        firstName: this.firstName,
        lastName: this.lastName,
        jobTitle: this.jobTitle,
        phone: this.phone,
        location: this.location,
        workExperienceInYears: this.workExperienceInYears,
        email: this.email,
      });

      if (this.afterCreate) {
        await this.afterCreate(user);
      }
      this.popDialogComponent();
    }
  }
}
</script>
