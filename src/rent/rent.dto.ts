import { IsNotEmpty, IsNumber, IsDate } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
export class RentInput {
  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  readonly id: number;

  @ApiProperty({ example: "2021-07-24" })
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  readonly start: Date;

  @ApiProperty({ example: "2021-07-26" })
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  readonly end: Date;
}

export interface IRentOutput<T> {
  result: T;
  warnings: string[];
}

export interface IRate {
  from: number;
  to: number;
  rate: number;
  percentage?: number;
}

export interface IMonthlyReport {
  auto_id: number;
  book_days: number;
  book_percentage: number;
  key: string;
}
