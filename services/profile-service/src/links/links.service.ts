import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateLinkDto } from "./dto/create-link.dto";
import { UpdateLinkDto } from "./dto/update-link.dto";

@Injectable()
export class LinksService {
  constructor(private readonly prisma: PrismaService) {}

  async create(profileId: string, dto: CreateLinkDto) {
    const order = dto.order ?? (await this.prisma.link.count({ where: { profileId } }));
    return this.prisma.link.create({
      data: { title: dto.title, url: dto.url, order, profileId },
    });
  }

  async update(profileId: string, id: string, dto: UpdateLinkDto) {
    await this.ensureOwned(profileId, id);
    return this.prisma.link.update({ where: { id }, data: dto });
  }

  async remove(profileId: string, id: string) {
    await this.ensureOwned(profileId, id);
    await this.prisma.link.delete({ where: { id } });
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
