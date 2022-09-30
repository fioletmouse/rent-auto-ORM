import { Module } from "@nestjs/common";
import { RentController } from "./rent.controller";
import { RentService } from "./rent.service";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { environment } from "../environment";
import { BLModule } from "src/bl/bl.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import entities from "../entities";
import { Auto } from "../entities";

@Module({
  imports: [BLModule, TypeOrmModule.forFeature([Auto])],
  controllers: [RentController],
  providers: [RentService]
})
export class RentModule {}
