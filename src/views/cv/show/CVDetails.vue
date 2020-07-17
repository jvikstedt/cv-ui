<template>
  <v-card :loading="fetching">
    <v-row>
      <v-col cols="12" sm="4">
        <template v-if="!fetching">
          <p class="text-center">
            <v-btn color="primary darken-1" text @click="onExport">
              Export
            </v-btn>
          </p>
          <p class="text-center">
            <v-avatar size="146.6" tile color="indigo">
              <v-img v-if="avatarSrc" :src="avatarSrc"></v-img>
              <span v-else class="white--text headline">{{ initials }}</span>
            </v-avatar>
          </p>
          <p class="text-center ma-0">
            {{ cv.user.firstName }} {{ cv.user.lastName }}
          </p>
          <p class="text-center ma-0">{{ cv.user.jobTitle }}</p>
          <p class="text-center ma-0">{{ cv.user.location }}</p>
          <p v-if="canEdit" class="text-center ma-0">
            <v-btn
              id="edit-user-details-btn"
              icon
              small
              @click="openEditUserDetailsDialog"
            >
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
          </p>
        </template>
      </v-col>
      <v-col cols="12" sm="8">
        <template v-if="!fetching">
          <h3>
            Description
            <v-btn
              id="edit-cv-details-btn"
              icon
              small
              @click="openEditCVDetailsDialog"
              v-if="canEdit"
            >
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
          </h3>
          <p style="white-space: pre-line;">
            {{ cv.description }}
          </p>
        </template>
      </v-col>
    </v-row>
  </v-card>
</template>

<script lang="ts">
import * as R from "ramda";
import { Component, Vue, Prop } from "vue-property-decorator";
import { namespace } from "vuex-class";
import EditUserDetailsDialog from "./components/EditUserDetailsDialog.vue";
import EditCVDetailsDialog from "./components/EditCVDetailsDialog.vue";
import { CV, PatchCVDto } from "@/model/cv";
import { PatchUserDto } from "@/model/user";
import { DialogComponent } from "@/dialog";

const CVShowStore = namespace("CVShowStore");
const DialogStore = namespace("DialogStore");

@Component({
  components: {
    EditUserDetailsDialog,
    EditCVDetailsDialog
  }
})
export default class CVDetails extends Vue {
  @Prop({ required: true }) readonly id!: number;
  @Prop({ required: true }) readonly canEdit!: boolean;

  @CVShowStore.Getter
  getCV!: (id: number) => CV;

  @CVShowStore.State
  fetching!: boolean;

  @CVShowStore.Action
  patchUser!: (patchUserDto: PatchUserDto) => Promise<void>;

  @CVShowStore.Action
  patchCV!: (patchCVDto: PatchCVDto) => Promise<void>;

  @DialogStore.Mutation
  pushDialogComponent!: (dialogComponent: DialogComponent) => void;

  openEditCVDetailsDialog() {
    this.pushDialogComponent({
      component: EditCVDetailsDialog,
      props: { id: this.id }
    });
  }

  openEditUserDetailsDialog() {
    this.pushDialogComponent({
      component: EditUserDetailsDialog,
      props: { id: this.id }
    });
  }

  get cv(): CV {
    return this.getCV(this.id);
  }

  get avatarSrc(): string | null {
    if (this.getCV(this.id).user.avatarId) {
      return `/api/files/${this.getCV(this.id).user.avatarId}`;
    }
    return null;
  }

  get initials(): string {
    const user = this.cv.user;
    return R.toUpper(`${user.firstName[0]}${user.lastName[0]}`);
  }

  onExport() {
    this.$router.push(`/cv/${this.id}/pdf`);
  }
}
</script>
