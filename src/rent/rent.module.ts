import { Module } from "@nestjs/common";
import { RentController } from "./rent.controller";
import { RentService } from "./rent.service";
import { BLModule } from "src/bl/bl.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Auto, Book_session, Rate } from "../entities";

@Module({
  imports: [BLModule, TypeOrmModule.forFeature([Auto, Rate, Book_session])],
  controllers: [RentController],
  providers: [RentService]
})
export class RentModule {}
