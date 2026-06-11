import { ConflictException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { Profile } from "../generated/prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { JwtPayload } from "./jwt.strategy";

const SALT_ROUNDS = 12;

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.profile.findUnique({
      where: { username: dto.username },
      select: { id: true },
    });
    if (existing) {
      throw new ConflictException("Username is already taken");
    }

    const passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);
    const profile = await this.prisma.profile.create({
      data: { username: dto.username, passwordHash },
    });

    return this.buildAuthResponse(profile);
  }

  async login(dto: LoginDto) {
    const profile = await this.prisma.profile.findUnique({
      where: { username: dto.username },
    });
    if (!profile || !(await bcrypt.compare(dto.password, profile.passwordHash))) {
      throw new UnauthorizedException("Invalid username or password");
    }

    return this.buildAuthResponse(profile);
  }

  private async buildAuthResponse(profile: Profile) {
    const payload: JwtPayload = { sub: profile.id, username: profile.username };
    const { passwordHash: _, ...publicProfile } = profile;
    return {
      accessToken: await this.jwtService.signAsync(payload),
      profile: publicProfile,
    };
  }
}
