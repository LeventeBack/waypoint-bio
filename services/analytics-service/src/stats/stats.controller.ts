import { Controller, Get, UseGuards } from "@nestjs/common";
import { CurrentUser } from "../auth/current-user.decorator";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { AuthUser } from "../auth/jwt.strategy";
import { StatsService } from "./stats.service";

// All stats are scoped to the authenticated user's username taken from the
// validated JWT — never from a query param.
@UseGuards(JwtAuthGuard)
@Controller("stats")
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get("me")
  getMe(@CurrentUser() user: AuthUser) {
    return this.statsService.getMeStats(user.username);
  }

  @Get("me/timeseries")
  getMeTimeseries(@CurrentUser() user: AuthUser) {
    return this.statsService.getTimeseries(user.username);
  }

  @Get("me/geo")
  getMeGeo(@CurrentUser() user: AuthUser) {
    return this.statsService.getGeo(user.username);
  }
}
