import { Inject, Injectable, BadRequestException, Logger } from "@nestjs/common";
import { UtilsService } from "../bl/utils.service";
import { CalcService } from "../bl/calc.service";
import Const from "../constants";
import { IRate, RentInput, IRentOutput, IMonthlyReport } from "./rent.dto";
import * as moment from "moment";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Auto } from "../entities/auto.entity";

@Injectable()
export class RentService {
  private readonly logger = new Logger(RentService.name);
  constructor(
    private readonly utils: UtilsService,
    private readonly calc: CalcService,
    @InjectRepository(Auto) private autoRepository: Repository<Auto>
  ) {}

  async isAvailable(rentInput: RentInput): Promise<IRentOutput<boolean>> {
    const { id, start, end } = rentInput;
    const output: IRentOutput<boolean> = { result: null, warnings: [] };

    // if (!this.utils.datesRightOrder(start, end)) throw new BadRequestException("End date has to be after start date");

    // // warnings
    // if (this.utils.moreThanDayLimit(start, end)) {
    //   const errorText = "You check period that is more than 30 days. Booking will be unavailable.";
    //   output.warnings.push(errorText);
    //   this.logger.warn(errorText);
    // }
    // if (this.utils.isWeekendDates(start, end)) {
    //   const errorText = "Start or end date is a weekend day. Booking will be unavailable.";
    //   output.warnings.push(errorText);
    //   this.logger.warn(errorText);
    // }

    // // there should be an interval between booking
    // const startWithInterval = moment(start).add(-Const.INTERVAL, "days").format("YYYY-MM-DD");
    // const endWithInterval = moment(end).add(Const.INTERVAL, "days").format("YYYY-MM-DD");

    // const res = await this.connection.query(
    //   // dates conditions: inside another range, intersect with start, intersect with end
    //   "SELECT * FROM book_session WHERE auto_id = $1 AND (\
    //     (start_date <= $2 AND end_date >= $3) OR \
    //     (start_date >= $2 AND end_date >= $3 AND $3 >= start_date) OR \
    //     (start_date <= $2 AND end_date <= $3 AND $2 <= end_date) \
    //   )",
    //   [id, startWithInterval, endWithInterval]
    // );
    const tt = await this.autoRepository.find();
    this.logger.error(tt);
    output.result = false;
    return output;
  }

  async prelimCalc(rentInput: RentInput): Promise<IRentOutput<number>> {
    const { start, end } = rentInput;

    // if (!this.utils.datesRightOrder(start, end)) throw new BadRequestException("End date has to be after start date");

    // const res = await this.connection.query('SELECT * FROM rate WHERE $1 BETWEEN start_date AND end_date ORDER BY "from" ASC', [start]);
    // const rates: IRate[] = res.rows.map((row) => ({
    //   from: row.from,
    //   to: row.to,
    //   rate: row.rate,
    //   percentage: row.percentage
    // }));

    // const daysCount = this.utils.daysCount(start, end);
    // const totalSum = this.calc.prelimitCalculation(rates, daysCount);
    return { result: 0, warnings: [] };
  }

  async book(rentInput: RentInput): Promise<IRentOutput<boolean>> {
    const { id, start, end } = rentInput;
    // const isAvailable = await this.isAvailable(rentInput);

    // // no way to book a car that is not met the conditions
    // if (isAvailable.warnings.length > 0) throw new BadRequestException(isAvailable.warnings.join(" "));
    // if (!isAvailable.result) throw new BadRequestException("Car is unavailable. Please, try other dates.");

    // const total = (await this.prelimCalc(rentInput)).result;
    // save
    try {
      // const queryText = "INSERT INTO book_session(auto_id, start_date, end_date, total) VALUES($1, $2, $3, $4)";
      // const res = await this.connection.singleCommand(queryText, [id, start, end, total]);
      return { result: false, warnings: [] };
    } catch (err) {
      throw err;
    }
  }

  async monthlyReport(): Promise<IRentOutput<IMonthlyReport[]>> {
    // const reportQuery =
    //   "WITH rental(auto_id, book_days, days_in_month) AS \
    // ( \
    //   SELECT auto_id, \
    //     SUM((LEAST(end_date, (date_trunc('MONTH', now())+interval '1 month - 1 day')::DATE) - \
    //          GREATEST(start_date, (date_trunc('MONTH', now()))::DATE))+1), \
    //     date_part('days',(date_trunc('month', NOW()) + interval '1 month - 1 day')) \
    //   FROM public.book_session \
    //   WHERE extract(month FROM NOW()) = extract(month from start_date) OR \
    //         extract(month FROM NOW()) = extract(month from end_date) \
    //   GROUP by auto_id \
    // ) \
    // SELECT auto_id, book_days, ROUND((book_days*100/days_in_month::int2), 0) AS \"book_percentage\", 'auto' AS \"key\" \
    // FROM  rental \
    // UNION ALL \
    // SELECT COUNT(auto_id), SUM(book_days), ROUND(SUM(book_days)*100/(COUNT(auto_id)*MAX(days_in_month::int2)), 0), 'total' \
    // FROM  rental";
    // const res = await this.connection.query(reportQuery, undefined);
    return { result: null as IMonthlyReport[], warnings: [] };
  }
}
