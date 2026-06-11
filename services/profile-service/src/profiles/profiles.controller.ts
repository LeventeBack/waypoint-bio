import {
  Body,
  Controller,
  Get,
  NotImplementedException,
  Param,
  Post,
  Put,
  UseGuards,
} from "@nestjs/common";
import { CurrentUser } from "../auth/current-user.decorator";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { AuthUser } from "../auth/jwt.strategy";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { ProfilesService } from "./profiles.service";

@Controller("profiles")
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @UseGuards(JwtAuthGuard)
  @Get("me")
  getMe(@CurrentUser() user: AuthUser) {
    return this.profilesService.getById(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Put("me")
  updateMe(@CurrentUser() user: AuthUser, @Body() dto: UpdateProfileDto) {
    return this.profilesService.update(user.id, dto);
  }

  // Placeholder: GCS avatar upload will be implemented in a later iteration.
  @UseGuards(JwtAuthGuard)
  @Post("me/avatar")
  uploadAvatar(): never {
    throw new NotImplementedException("Avatar upload is not implemented yet");
  }

  @Get(":username")
  getPublicProfile(@Param("username") username: string) {
    return this.profilesService.getPublicByUsername(username);
  }
}
