<template>
  <v-row v-if="cv && user">
    <v-col cols="12" sm="4">
      <v-row no-gutters>
        <v-col cols="12">
          <p class="text-center">
            <v-avatar size="146.6" tile @click="editUserDetailsDialog = true">
              <v-img :src="avatarSrc"></v-img>
            </v-avatar>
          </p>
        </v-col>
        <v-col cols="12">
          <p class="text-center ma-0">
            {{ user.firstName }} {{ user.lastName }}
            <EditUserDetailsDialog
              :dialog="editUserDetailsDialog"
              :setDialog="setUserDetailsDialog"
              :user="user"
            />
            <v-btn icon small @click="editUserDetailsDialog = true">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
          </p>
          <p class="text-center ma-0">{{ user.workTitle }}</p>
        </v-col>
      </v-row>
    </v-col>
    <v-col cols="12" sm="8">
      <h3>Description</h3>
      <p>
        {{ cv.description }}
        <EditCVDetailsDialog
          :dialog="editCVDetailsDialog"
          :setDialog="setCVDetailsDialog"
          :cv="cv"
        />
        <v-btn icon small @click="editCVDetailsDialog = true">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
      </p>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import User from "@/store/User";
import CV from "@/store/CV";
import EditUserDetailsDialog from "./components/EditUserDetailsDialog.vue";
import EditCVDetailsDialog from "./components/EditCVDetailsDialog.vue";

@Component({
  components: {
    EditUserDetailsDialog,
    EditCVDetailsDialog
  }
})
export default class CVInfoBlock extends Vue {
  @Prop({ required: true }) readonly user!: User | null;
  @Prop({ required: true }) readonly cv!: CV | null;

  private editUserDetailsDialog = false;
  private editCVDetailsDialog = false;

  get avatarSrc(): string {
    if (this.user && this.user.avatarId) {
      return `/api/files/${this.user.avatarId}`;
    }
    return "";
  }

  private setUserDetailsDialog(dialog: boolean) {
    this.editUserDetailsDialog = dialog;
  }

  private setCVDetailsDialog(dialog: boolean) {
    this.editCVDetailsDialog = dialog;
  }
}
</script>
