import { Module } from "@nestjs/common";
import { UtilsService } from "./utils.service";
import { CalcService } from "./calc.service";

@Module({
  providers: [UtilsService, CalcService],
  exports: [UtilsService, CalcService]
})
export class BLModule {}
