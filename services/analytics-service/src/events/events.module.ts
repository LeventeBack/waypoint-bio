import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { EventsController } from "./events.controller";
import { EventsService } from "./events.service";
import { ClickEvent, ClickEventSchema } from "./schemas/click-event.schema";

@Module({
  imports: [MongooseModule.forFeature([{ name: ClickEvent.name, schema: ClickEventSchema }])],
  controllers: [EventsController],
  providers: [EventsService],
})
export class EventsModule {}
