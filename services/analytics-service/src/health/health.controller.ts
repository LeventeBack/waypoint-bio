import { Controller, Get, ServiceUnavailableException } from "@nestjs/common";
import { InjectConnection } from "@nestjs/mongoose";
import { Connection } from "mongoose";

@Controller("health")
export class HealthController {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  @Get()
  check() {
    if (this.connection.readyState !== 1) {
      throw new ServiceUnavailableException({ status: "error", db: "down" });
    }
    return { status: "ok", db: "up" };
  }
}
