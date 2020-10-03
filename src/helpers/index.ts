import moment from "moment";
import * as validator from "./validator";

const FormatDateTime = (date: Date): string => {
  return moment(date).format("MMMM Do YYYY, h:mm a");
};

export { validator, FormatDateTime };
