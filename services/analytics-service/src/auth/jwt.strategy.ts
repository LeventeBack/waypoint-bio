import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

// Mirrors profile-service's JwtPayload/AuthUser so the same tokens validate here.
// analytics-service only validates tokens; it never issues them.
export interface JwtPayload {
  sub: string;
  username: string;
}

export interface AuthUser {
  id: string;
  username: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.getOrThrow<string>("JWT_SECRET"),
    });
  }

  validate(payload: JwtPayload): AuthUser {
    return { id: payload.sub, username: payload.username };
  }
}
