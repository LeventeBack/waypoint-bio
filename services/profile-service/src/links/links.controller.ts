import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
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
import { CreateLinkDto } from "./dto/create-link.dto";
import { UpdateLinkDto } from "./dto/update-link.dto";
import { LinksService } from "./links.service";

@UseGuards(JwtAuthGuard)
@Controller("profiles/me/links")
export class LinksController {
  constructor(
    private readonly linksService: LinksService,
    private readonly storage: StorageService,
  ) {}

  @Post()
  create(@CurrentUser() user: AuthUser, @Body() dto: CreateLinkDto) {
    return this.linksService.create(user, dto);
  }

  @Patch(":id")
  update(@CurrentUser() user: AuthUser, @Param("id") id: string, @Body() dto: UpdateLinkDto) {
    return this.linksService.update(user, id, dto);
  }

  @Post(":id/icon")
  @UseInterceptors(FileInterceptor("file"))
  async uploadIcon(
    @CurrentUser() user: AuthUser,
    @Param("id") id: string,
    @UploadedFile(imageValidationPipe()) file: UploadedImage,
  ) {
    const iconUrl = await this.storage.uploadImage(file, "link-icons");
    return this.linksService.update(user, id, { iconUrl });
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(":id")
  async remove(@CurrentUser() user: AuthUser, @Param("id") id: string) {
    await this.linksService.remove(user, id);
  }
}
