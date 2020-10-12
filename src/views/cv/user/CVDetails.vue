<template>
  <v-card :loading="fetching">
    <v-row>
      <v-col cols="12" sm="4">
        <p class="text-center" v-if="!hideExport">
          <v-btn color="primary darken-1" text @click="onExport">
            Export
            <v-icon right>mdi-export</v-icon>
          </v-btn>
        </p>
        <template v-if="!fetching && cv">
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
          <p class="text-center ma-0">
            <v-btn
              id="edit-user-details-btn"
              icon
              small
              @click="openEditUserDetailsDialog"
            >
              <v-icon v-if="canEdit">mdi-pencil</v-icon>
              <v-icon v-else>mdi-information-outline</v-icon>
            </v-btn>
          </p>
        </template>
      </v-col>
      <v-col cols="12" sm="8">
        <template v-if="!fetching && cv">
          <v-card-text>
            <h3 :class="{ 'mt-sm-9': !hideExport }">
              Details
              <v-btn
                id="edit-user-details-btn"
                icon
                small
                @click="openEditUserDetailsDialog"
                v-if="canEdit"
              >
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </h3>
            <p class="pa-0 mb-1 mt-2" v-if="cv.user.phone">
              <v-icon>mdi-cellphone</v-icon> {{ cv.user.phone }}
            </p>

            <p class="pa-0 mb-1" v-if="cv.user.location">
              <v-icon>mdi-map-marker</v-icon> {{ cv.user.location }}
            </p>

            <p class="pa-0 mb-1" v-if="cv.user.email">
              <v-icon>mdi-email</v-icon> {{ cv.user.email }}
            </p>

            <h3 class="mt-4">
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
            <p style="white-space: pre-line">
              {{ cv.description }}
            </p>
          </v-card-text>
        </template>
      </v-col>
    </v-row>
  </v-card>
</template>

<script lang="ts">
import * as R from "ramda";
import { Component, Vue, Prop } from "vue-property-decorator";
import EditUserDetailsDialog from "./components/EditUserDetailsDialog.vue";
import EditCVDetailsDialog from "./components/EditCVDetailsDialog.vue";
import CVModule, { CV } from "@/store/modules/cv";
import DialogModule from "@/store/modules/dialog";
import { ServiceManager } from "@/services";

@Component({
  components: {
    EditUserDetailsDialog,
    EditCVDetailsDialog,
  },
})
export default class CVDetails extends Vue {
  @Prop({ required: true }) readonly cvId!: number;
  @Prop({ required: true }) readonly canEdit!: boolean;
  @Prop({ required: false }) readonly hideExport!: boolean;

  get fetching(): boolean {
    return CVModule.fetching;
  }

  async created(): Promise<void> {
    await ServiceManager.cv.fetchCV(this.cvId);
  }

  openEditCVDetailsDialog(): void {
    DialogModule.pushDialogComponent({
      component: EditCVDetailsDialog,
      props: { cv: this.cv },
    });
  }

  openEditUserDetailsDialog(): void {
    if (this.cv) {
      DialogModule.pushDialogComponent({
        component: EditUserDetailsDialog,
        props: { user: this.cv.user, canEdit: this.canEdit },
      });
    }
  }

  get cv(): CV | undefined {
    return CVModule.find(this.cvId);
  }

  get avatarSrc(): string | null {
    const cv = this.cv;
    if (cv && cv.user.avatarId) {
      return `/api/files/${cv.user.avatarId}`;
    }
    return null;
  }

  get initials(): string {
    const cv = this.cv;
    if (cv) {
      return R.toUpper(`${cv.user.firstName[0]}${cv.user.lastName[0]}`);
    }
    return "";
  }

  onExport(): void {
    this.$router.push(`/cv/${this.cvId}/export`);
  }
}
</script>
