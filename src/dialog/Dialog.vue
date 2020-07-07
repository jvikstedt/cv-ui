<template>
  <v-dialog v-model="dialog" max-width="600" v-if="showDialogDto">
    <component
      v-bind="showDialogDto.props"
      :is="showDialogDto.component"
    ></component>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { namespace } from "vuex-class";
import { ShowDialogDto } from "./store";

const DialogStore = namespace("DialogStore");

@Component
export default class Dialog extends Vue {
  @DialogStore.State
  public isOpen!: boolean;

  @DialogStore.State
  public showDialogDto!: ShowDialogDto | null;

  @DialogStore.Action
  public hideDialogAction!: () => void;

  get dialog(): boolean {
    return this.isOpen;
  }

  set dialog(dialog: boolean) {
    if (!dialog) {
      this.hideDialogAction();
    }
  }
}
</script>
