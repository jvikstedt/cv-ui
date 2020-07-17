import { Component } from "vue-property-decorator";
import DialogMixin from "./DialogMixin";
import { VForm } from "@/types";

@Component
export default class DialogFormMixin extends DialogMixin {
  valid = false;

  get form(): VForm {
    return this.$refs.form as VForm;
  }

  onCancel() {
    this.popDialogComponent();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  isRequiredRule = [(v: any) => !!v || "Is required"];
}
