import { Injectable, NotFoundException } from "@nestjs/common";
import { Profile } from "../generated/prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { UpdateProfileDto } from "./dto/update-profile.dto";

@Injectable()
export class ProfilesService {
  constructor(private readonly prisma: PrismaService) {}

  async getById(id: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { id },
      include: { links: { orderBy: { order: "asc" } } },
    });
    if (!profile) {
      throw new NotFoundException("Profile not found");
    }
    return this.sanitize(profile);
  }

  async getPublicByUsername(username: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { username },
      include: { links: { orderBy: { order: "asc" } } },
    });
    if (!profile) {
      throw new NotFoundException("Profile not found");
    }
    return this.sanitize(profile);
  }

  async update(id: string, dto: UpdateProfileDto) {
    const profile = await this.prisma.profile.update({
      where: { id },
      data: dto,
      include: { links: { orderBy: { order: "asc" } } },
    });
    return this.sanitize(profile);
  }

  private sanitize<T extends Profile>(profile: T): Omit<T, "passwordHash"> {
    const { passwordHash: _, ...rest } = profile;
    return rest;
  }
}
