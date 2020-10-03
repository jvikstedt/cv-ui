import { Component } from "vue-property-decorator";
import DialogMixin from "./DialogMixin";
import { VForm } from "@/types";
import { IsRequired } from "@/helpers/validator";

@Component
export default class DialogFormMixin extends DialogMixin {
  valid = false;

  get form(): VForm {
    return this.$refs.form as VForm;
  }

  onCancel(): void {
    this.popDialogComponent();
  }

  isRequiredRule = [IsRequired()];
}
