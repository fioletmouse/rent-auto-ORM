import { Controller, Get, Post, Query } from "@nestjs/common";
import { RentInput, IRentOutput, IMonthlyReport } from "./rent.dto";
import { RentService } from "./rent.service";
import { ApiTags, ApiBadRequestResponse } from "@nestjs/swagger";

@ApiTags("rent")
@Controller()
export class RentController {
  constructor(private readonly appService: RentService) {}

  @Get("isAvailable")
  @ApiBadRequestResponse({ description: "Dates issue" })
  async isAvailable(@Query() queryParams: RentInput): Promise<IRentOutput<boolean>> {
    return await this.appService.isAvailable(queryParams);
  }

  @Get("calculation")
  @ApiBadRequestResponse({ description: "Dates issue" })
  async prelimCalc(@Query() queryParams: RentInput): Promise<IRentOutput<number>> {
    return await this.appService.prelimCalc(queryParams);
  }

  @Post("book")
  @ApiBadRequestResponse({ description: "Issue with car availability" })
  async book(@Query() queryParams: RentInput): Promise<IRentOutput<boolean>> {
    return await this.appService.book(queryParams);
  }

  @Get("currentMonthReport")
  async currentMonthReport(): Promise<IRentOutput<IMonthlyReport[]>> {
    return await this.appService.monthlyReport();
  }
}
