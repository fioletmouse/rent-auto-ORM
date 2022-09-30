import { Injectable } from "@nestjs/common";
import * as moment from "moment";

@Injectable()
export class UtilsService {
  moreThanDayLimit = (start: Date, end: Date) => {
    return this.daysCount(start, end) > 30;
  };

  private isWeekendDay = (date: Date) => {
    const weekDayNum = moment(date).day();
    return weekDayNum === 6 || weekDayNum === 0; // Sat || Sun;
  };

  isWeekendDates = (start: Date, end: Date) => {
    return this.isWeekendDay(start) || this.isWeekendDay(end);
  };

  daysCount = (start: Date, end: Date) => {
    const mEnd = moment(end);
    const mStart = moment(start);
    const daysCount = mEnd.diff(mStart, "days") + 1;
    return daysCount;
  };

  datesRightOrder = (start: Date, end: Date): boolean => {
    const mEnd = moment(end);
    const mStart = moment(start);
    const isBefore = mStart.isSameOrBefore(mEnd);
    return isBefore;
  };
}
