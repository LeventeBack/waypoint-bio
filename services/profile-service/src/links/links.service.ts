import { Injectable, NotFoundException } from "@nestjs/common";
import { AuthUser } from "../auth/jwt.strategy";
import { CacheInvalidationService } from "../cache/cache-invalidation.service";
import { PrismaService } from "../prisma/prisma.service";
import { CreateLinkDto } from "./dto/create-link.dto";
import { UpdateLinkDto } from "./dto/update-link.dto";

@Injectable()
export class LinksService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cacheInvalidation: CacheInvalidationService,
  ) {}

  async create(user: AuthUser, dto: CreateLinkDto) {
    const order = dto.order ?? (await this.prisma.link.count({ where: { profileId: user.id } }));
    const link = await this.prisma.link.create({
      data: { title: dto.title, url: dto.url, order, profileId: user.id },
    });
    this.cacheInvalidation.invalidate(user.username);
    return link;
  }

  async update(user: AuthUser, id: string, dto: UpdateLinkDto) {
    await this.ensureOwned(user.id, id);
    const link = await this.prisma.link.update({ where: { id }, data: dto });
    this.cacheInvalidation.invalidate(user.username);
    return link;
  }

  async remove(user: AuthUser, id: string) {
    await this.ensureOwned(user.id, id);
    await this.prisma.link.delete({ where: { id } });
    this.cacheInvalidation.invalidate(user.username);
  }

  private async ensureOwned(profileId: string, id: string) {
    const link = await this.prisma.link.findFirst({
      where: { id, profileId },
      select: { id: true },
    });
    if (!link) {
      throw new NotFoundException("Link not found");
    }
  }
}
