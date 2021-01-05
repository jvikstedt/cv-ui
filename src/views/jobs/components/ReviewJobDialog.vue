<template>
  <v-card>
    <v-card-title class="headline">Review job</v-card-title>
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
        @click="approve"
        :disabled="!isAdmin || !isPending"
      >
        Approve
      </v-btn>
    </v-card-actions>
    <v-card-text>
      <h3>General:</h3>

      <br />
      <div><b>Runner:</b> {{ job.runner }}</div>
      <div>
        <b>State:</b> {{ job.state
        }}<b v-if="job.state === 'pending'"> (Pending for approval) </b>
      </div>
      <div><b>Creator:</b> {{ job.user.username }}</div>
      <div><b>Description:</b> {{ job.description }}</div>
      <div><b>Created:</b> {{ formatDateTime(job.createdAt) }}</div>
      <div><b>Updated:</b> {{ formatDateTime(job.updatedAt) }}</div>
      <br />

      <h3>Metadata:</h3>

      <br />
      <div v-for="key in Object.keys(job.data)" :key="key">
        <b>{{ key }}:</b> {{ job.data[key] }}
      </div>
      <br />

      <h3 v-if="job.log">Log:</h3>
      <div v-if="job.log" style="white-space: pre-wrap">
        {{ job.log }}
      </div>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import * as R from "ramda";
import { Component, Mixins, Prop } from "vue-property-decorator";
import { DialogFormMixin } from "@/mixins";
import AuthModule from "@/store/modules/auth";
import { ROLES } from "@/constants";
import { Job } from "@/store/modules/job";
import { ServiceManager } from "@/services";
import { FormatDateTime } from "@/helpers";

@Component
export default class ReviewJobDialog extends Mixins(DialogFormMixin) {
  @Prop({ required: true }) readonly job!: Job;
  @Prop({ required: true }) readonly afterUpdate!: (job: Job) => Promise<void>;

  formatDateTime = FormatDateTime;
  isAdmin = AuthModule.hasRole(ROLES.ADMIN);

  get isPending(): boolean {
    return R.equals(this.job.state, "pending");
  }

  async approve(): Promise<void> {
    if (confirm("Are you sure you want to approve?")) {
      const newJob = await ServiceManager.job.approveJob(this.job.id);

      await this.afterUpdate(newJob);

      this.popDialogComponent();
    }
  }

  async reject(): Promise<void> {
    if (confirm("Are you sure you want to reject?")) {
      const newJob = await ServiceManager.job.rejectJob(this.job.id);

      await this.afterUpdate(newJob);

      this.popDialogComponent();
    }
  }
}
</script>
