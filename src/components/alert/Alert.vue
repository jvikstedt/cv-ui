<template>
  <v-snackbar
    v-model="show"
    :bottom="y === 'bottom'"
    :color="color"
    :left="x === 'left'"
    :multi-line="mode === 'multi-line'"
    :right="x === 'right'"
    :timeout="timeout"
    :top="y === 'top'"
    :vertical="mode === 'vertical'"
  >
    {{ message }}

    <v-btn icon v-if="details" @click="onShowMore">
      <v-icon>{{ showMore ? "mdi-chevron-up" : "mdi-chevron-down" }}</v-icon>
    </v-btn>

    <div v-if="showMore">
      <pre style="white-space: pre-wrap">{{ details }}</pre>
    </div>

    <template v-slot:action="{ attrs }">
      <v-btn dark text v-bind="attrs" @click="show = false"> Close </v-btn>
    </template>
  </v-snackbar>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import AlertModule, { AlertInfo } from "@/store/modules/alert";

@Component
export default class Alert extends Vue {
  show = false;
  showMore = false;
  x = "";
  y = "";
  message = "";
  color = "";
  timeout = 5000;
  mode = "";
  details: string | null = null;

  get newAlert(): AlertInfo | null {
    return AlertModule.newAlert;
  }

  @Watch("newAlert")
  alertChanged(alert: AlertInfo | null): void {
    if (alert) {
      this.show = true;
      this.x = alert.x;
      this.y = alert.y;
      this.mode = alert.mode;
      this.timeout = alert.timeout;
      this.message = alert.message;
      this.color = alert.color;
      this.details = alert.details;

      AlertModule.resetAlert();
    }
  }

  onShowMore(): void {
    this.showMore = !this.showMore;
    if (this.showMore) {
      this.timeout = -1;
    } else {
      this.timeout = 5000;
    }
  }
}
</script>
