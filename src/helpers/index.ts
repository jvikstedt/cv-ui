import { DateTime } from "luxon";
import * as validator from "./validator";

const FormatDateTime = (date: string): string => {
  return DateTime.fromISO(date).toFormat("dd MMMM yyyy, h:mm a");
};

export { validator, FormatDateTime };
