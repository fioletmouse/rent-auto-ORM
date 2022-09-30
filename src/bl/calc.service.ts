import { Injectable } from "@nestjs/common";
import * as moment from "moment";
import { IRate } from "src/rent/rent.dto";

@Injectable()
export class CalcService {
  constructor() {}

  prelimitCalculation = (rates: IRate[], daysCount: number) => {
    let daysLeft = daysCount;
    const totalSum = rates.reduce((sum, rate) => {
      if (daysLeft > 0) {
        const periodDays = rate.to - rate.from + 1;
        const percentage = rate.percentage ? rate.percentage / 100 : 0;
        const payment = rate.rate - rate.rate * percentage;
        if (daysLeft >= periodDays) {
          sum += periodDays * payment;
        } else {
          sum += daysLeft * payment;
        }
        daysLeft = daysLeft - periodDays;
      }
      return sum;
    }, 0);
    return totalSum;
  };
}
