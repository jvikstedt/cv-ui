<template>
  <v-dialog
    v-model="dialog"
    max-width="500"
    v-if="user"
    v-on:click:outside="onCancel"
  >
    <v-card>
      <v-card-title class="headline">
        {{ user.firstName }} {{ user.lastName }}
      </v-card-title>

      <v-card-text>
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
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import User from "@/store/User";
import { PatchUser, PatchUserDto } from "@/api/user";

@Component
export default class EditUserNamesDialog extends Vue {
  @Prop({ required: true }) readonly user!: User | null;
  @Prop({ required: true }) readonly dialog!: boolean;
  @Prop({ required: true }) readonly setDialog!: (dialog: boolean) => void;

  private firstName = "";
  private lastName = "";

  @Watch("dialog")
  userChanged(dialog: boolean) {
    if (dialog && this.user) {
      this.firstName = this.user.firstName;
      this.lastName = this.user.lastName;
    }
  }

  private async onSave() {
    const patchUserDto: PatchUserDto = {
      firstName: this.firstName,
      lastName: this.lastName
    };

    if (this.user) {
      await PatchUser(this.user.id, patchUserDto);
    }

    this.setDialog(false);
  }

  private async onCancel() {
    this.setDialog(false);
  }
}
</script>
