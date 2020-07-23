import moment from "moment";

export const FormatDateTime = (date: Date): string => {
  return moment(date).format("MMMM Do YYYY, h:mm a");
};
