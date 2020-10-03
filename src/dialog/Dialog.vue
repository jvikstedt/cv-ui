<template>
  <div>
    <template v-for="dc in dialogComponents">
      <v-dialog
        :key="dc.component.name"
        v-model="dialog"
        :max-width="dc.maxWidth || 600"
      >
        <component v-bind="dc.props" :is="dc.component"></component>
      </v-dialog>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { DialogComponent } from "@/store/modules/dialog";
import DialogModule from "@/store/modules/dialog";

@Component
export default class Dialog extends Vue {
  // @DialogStore.State
  // isOpen!: boolean;

  // @DialogStore.State
  get dialogComponents(): DialogComponent[] {
    return DialogModule.dialogComponents;
  }

  // @DialogStore.Mutation
  // popDialogComponent!: () => void;

  get dialog(): boolean {
    return true;
  }

  set dialog(dialog: boolean) {
    if (!dialog) {
      DialogModule.popDialogComponent();
    }
  }
}
</script>
