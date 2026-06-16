import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateEventDto } from "./dto/create-event.dto";
import { ClickEvent } from "./schemas/click-event.schema";

function normalizeIp(ip?: string): string | undefined {
  return ip?.replace(/^::ffff:/i, "");
}

@Injectable()
export class EventsService {
  constructor(@InjectModel(ClickEvent.name) private readonly eventModel: Model<ClickEvent>) {}

  async ingest(dto: CreateEventDto): Promise<void> {
    await this.eventModel.create({
      username: dto.username,
      linkId: dto.linkId,
      ip: normalizeIp(dto.ip),
      timestamp: dto.timestamp ? new Date(dto.timestamp) : new Date(),
    });
  }
}
