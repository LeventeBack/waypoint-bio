import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { CreateEventDto } from "./dto/create-event.dto";
import { EventsService } from "./events.service";

@Controller("events")
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @HttpCode(HttpStatus.ACCEPTED)
  async ingest(@Body() dto: CreateEventDto): Promise<void> {
    await this.eventsService.ingest(dto);
  }
}
