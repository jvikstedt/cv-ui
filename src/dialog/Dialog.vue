<template>
  <div>
    <template v-for="dc in dialogComponents">
      <v-dialog :key="dc.component.name" v-model="dialog" max-width="600">
        <component v-bind="dc.props" :is="dc.component"></component>
      </v-dialog>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { namespace } from "vuex-class";
import { DialogComponent } from "./store";

const DialogStore = namespace("DialogStore");

@Component
export default class Dialog extends Vue {
  @DialogStore.State
  public isOpen!: boolean;

  @DialogStore.State
  public dialogComponents!: DialogComponent[];

  @DialogStore.Mutation
  public popDialogComponent!: () => void;

  get dialog(): boolean {
    return true;
  }

  set dialog(dialog: boolean) {
    if (!dialog) {
      this.popDialogComponent();
    }
  }
}
</script>
