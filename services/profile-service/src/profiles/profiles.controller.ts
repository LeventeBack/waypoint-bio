import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { CurrentUser } from "../auth/current-user.decorator";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { AuthUser } from "../auth/jwt.strategy";
import { imageValidationPipe } from "../storage/image-upload";
import { StorageService, UploadedImage } from "../storage/storage.service";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { ProfilesService } from "./profiles.service";

@Controller("profiles")
export class ProfilesController {
  constructor(
    private readonly profilesService: ProfilesService,
    private readonly storage: StorageService,
  ) {}

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

  @UseGuards(JwtAuthGuard)
  @Post("me/avatar")
  @UseInterceptors(FileInterceptor("file"))
  async uploadAvatar(
    @CurrentUser() user: AuthUser,
    @UploadedFile(imageValidationPipe()) file: UploadedImage,
  ) {
    const avatarUrl = await this.storage.uploadImage(file, "avatars");
    return this.profilesService.update(user.id, { avatarUrl });
  }

  @Get(":username")
  getPublicProfile(@Param("username") username: string) {
    return this.profilesService.getPublicByUsername(username);
  }
}
