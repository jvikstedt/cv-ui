<template>
  <v-row>
    <v-col cols="12" sm="4">
      <v-row no-gutters>
        <v-col cols="12">
          <p class="text-center">
            <v-avatar size="146.6" tile color="indigo">
              <v-img v-if="avatarSrc" :src="avatarSrc"></v-img>
              <span v-else class="white--text headline">{{ initials }}</span>
            </v-avatar>
          </p>
        </v-col>
        <v-col cols="12">
          <p class="text-center ma-0">
            {{ cv.user.firstName }} {{ cv.user.lastName }}
            <v-btn icon small @click="openEditUserDetailsDialog">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
          </p>
          <p class="text-center ma-0">{{ cv.user.workTitle }}</p>
        </v-col>
      </v-row>
    </v-col>
    <v-col cols="12" sm="8">
      <h3>Description</h3>
      <p>
        {{ cv.description }}
        <v-btn icon small @click="openEditCVDetailsDialog">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
      </p>
    </v-col>
  </v-row>
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

  @CVShowStore.Getter
  public getCV!: (id: number) => CV;

  @CVShowStore.Action
  public patchUser!: (patchUserDto: PatchUserDto) => Promise<void>;

  @CVShowStore.Action
  public patchCV!: (patchCVDto: PatchCVDto) => Promise<void>;

  @DialogStore.Mutation
  public pushDialogComponent!: (dialogComponent: DialogComponent) => void;

  public openEditCVDetailsDialog() {
    this.pushDialogComponent({
      component: EditCVDetailsDialog,
      props: { id: this.id }
    });
  }

  public openEditUserDetailsDialog() {
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
}
</script>
