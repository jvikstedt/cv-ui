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
      {{ details }}
    </div>

    <template v-slot:action="{ attrs }">
      <v-btn dark text v-bind="attrs" @click="show = false">
        Close
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { namespace } from "vuex-class";
import { AlertInfo } from "@/alert/store";

const AlertStore = namespace("AlertStore");

@Component
export default class Alert extends Vue {
  private show = false;
  private showMore = false;
  private x = "";
  private y = "";
  private message = "";
  private color = "";
  private timeout = 5000;
  private mode = "";
  private details: string | null = null;

  @AlertStore.Getter
  public newAlert!: AlertInfo | null;

  @AlertStore.Mutation
  public resetAlert!: () => void;

  @Watch("newAlert")
  async alertChanged(alert: AlertInfo | null) {
    if (alert) {
      this.show = true;
      this.x = alert.x;
      this.y = alert.y;
      this.mode = alert.mode;
      this.timeout = alert.timeout;
      this.message = alert.message;
      this.color = alert.color;
      this.details = alert.details;

      this.resetAlert();
    }
  }

  public onShowMore() {
    this.showMore = !this.showMore;
    if (this.showMore) {
      this.timeout = -1;
    } else {
      this.timeout = 5000;
    }
  }
}
</script>
