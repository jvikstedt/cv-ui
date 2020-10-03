import { Component, Vue } from "vue-property-decorator";
import DialogModule from "@/store/modules/dialog";

@Component
export default class DialogMixin extends Vue {
  popDialogComponent = DialogModule.popDialogComponent;

  pushDialogComponent = DialogModule.pushDialogComponent;
}
