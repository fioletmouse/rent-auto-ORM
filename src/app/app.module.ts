import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { environment } from "../environment";
import { TypeOrmModule } from "@nestjs/typeorm";
import entities from "../entities";
import { RentModule } from "src/rent/rent.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [() => environment]
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        ...configService.get("pgCredentials"),
        entities: entities
      }),
      inject: [ConfigService]
    }),
    RentModule
  ]
})
export class AppModule {}
