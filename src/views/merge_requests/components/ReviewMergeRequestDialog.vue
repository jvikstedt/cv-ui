<template>
  <v-card>
    <v-card-title class="headline">Review merge request</v-card-title>
    <v-card-actions>
      <v-spacer></v-spacer>

      <v-btn color="red darken-1" text @click="onCancel"> Cancel </v-btn>
      <v-btn
        color="red darken-1"
        text
        @click="reject"
        :disabled="!isAdmin || !isPending"
      >
        Reject
      </v-btn>

      <v-btn
        color="green darken-1"
        text
        @click="merge"
        :disabled="!isAdmin || !isPending"
      >
        Merge
      </v-btn>
    </v-card-actions>
    <v-card-text>
      <div>Entity: {{ mergeRequest.entity }}</div>
      <div>State: {{ mergeRequest.state }}</div>
      <div>Creator: {{ mergeRequest.user.username }}</div>
      <div>Description: {{ mergeRequest.description }}</div>
      <div v-if="mergeRequest.msg">Message: {{ mergeRequest.msg }}</div>
      <div>
        Source: {{ `${mergeRequest.sourceName} (${mergeRequest.sourceId})` }}
      </div>
      <div>
        Target: {{ `${mergeRequest.targetName} (${mergeRequest.targetId})` }}
      </div>
      <div>Description: {{ mergeRequest.description }}</div>

      <div>Created at: {{ formatDateTime(mergeRequest.createdAt) }}</div>
      <div>Updated at: {{ formatDateTime(mergeRequest.updatedAt) }}</div>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import * as R from "ramda";
import { Component, Mixins, Prop } from "vue-property-decorator";
import { DialogFormMixin } from "@/mixins";
import AuthModule from "@/store/modules/auth";
import { ROLES } from "@/constants";
import { MergeRequest } from "@/store/modules/merge_request";
import { ServiceManager } from "@/services";
import { FormatDateTime } from "@/helpers";

@Component
export default class ReviewMergeRequestDialog extends Mixins(DialogFormMixin) {
  @Prop({ required: true }) readonly mergeRequest!: MergeRequest;
  @Prop({ required: true }) readonly afterUpdate!: (
    mergeRequest: MergeRequest
  ) => Promise<void>;

  formatDateTime = FormatDateTime;
  isAdmin = AuthModule.hasRole(ROLES.ADMIN);

  get isPending(): boolean {
    return R.equals(this.mergeRequest.state, "pending");
  }

  async merge(): Promise<void> {
    if (confirm("Are you sure you want to merge?")) {
      const newMergeRequest = await ServiceManager.mergeRequest.executeMergeRequest(
        this.mergeRequest.id
      );

      await this.afterUpdate(newMergeRequest);

      this.popDialogComponent();
    }
  }

  async reject(): Promise<void> {
    if (confirm("Are you sure you want to reject?")) {
      const newMergeRequest = await ServiceManager.mergeRequest.rejectMergeRequest(
        this.mergeRequest.id
      );

      await this.afterUpdate(newMergeRequest);

      this.popDialogComponent();
    }
  }
}
</script>
