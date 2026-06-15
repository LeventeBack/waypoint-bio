import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ClickEvent, ClickEventSchema } from "../events/schemas/click-event.schema";
import { StatsController } from "./stats.controller";
import { StatsService } from "./stats.service";

@Module({
  imports: [MongooseModule.forFeature([{ name: ClickEvent.name, schema: ClickEventSchema }])],
  controllers: [StatsController],
  providers: [StatsService],
})
export class StatsModule {}
