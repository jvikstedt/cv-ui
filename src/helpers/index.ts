import * as R from "ramda";
import { DateTime } from "luxon";
import * as validator from "./validator";

const FormatDateTime = (date: string): string => {
  return DateTime.fromISO(date).toFormat("dd MMMM yyyy, h:mm a");
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SortArr = (arr: any[]): any[] => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return R.sort((a: any, b: any) => {
    return (
      DateTime.fromFormat(
        `${b.startYear}-${b.startMonth || 1}`,
        "yyyy-M"
      ).toMillis() -
      DateTime.fromFormat(
        `${a.startYear}-${a.startMonth || 1}`,
        "yyyy-M"
      ).toMillis()
    );
  }, arr);
};

const SortArrayOfNumbers = (arr: number[]): number[] => {
  return arr.slice().sort((a, b) => a - b);
};

export { validator, FormatDateTime, SortArr, SortArrayOfNumbers };
