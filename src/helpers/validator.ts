import { DateTime } from "luxon";
import { InputValidationRule } from "vuetify";

export const IsRequired = (msg = "is required"): InputValidationRule => (
  value: any // eslint-disable-line @typescript-eslint/no-explicit-any
) => !!value || msg;

export const DateAfter = (
  dateTime: DateTime,
  format = "yyyy-MM"
): InputValidationRule => (value: string | null | number) => {
  if (value) {
    const date = DateTime.fromFormat(`${value}`, format);
    if (!date.isValid) {
      return `invalid date, must be format ${format}`;
    }
    if (dateTime > date) {
      return `must be after ${dateTime.toFormat(format)}`;
    }
  }
  return true;
};

export const DateBefore = (
  dateTime: DateTime,
  format = "yyyy-MM"
): InputValidationRule => (value: string | null | number) => {
  if (value) {
    const date = DateTime.fromFormat(`${value}`, format);
    if (!date.isValid) {
      return `invalid date, must be format ${format}`;
    }
    if (dateTime < date) {
      return `must be before ${dateTime.toFormat(format)}`;
    }
  }
  return true;
};
