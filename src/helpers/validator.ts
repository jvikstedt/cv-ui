import { InputValidationRule } from "vuetify";

export const IsRequired = (msg = "is required"): InputValidationRule => (
  value: any // eslint-disable-line @typescript-eslint/no-explicit-any
) => !!value || msg;
