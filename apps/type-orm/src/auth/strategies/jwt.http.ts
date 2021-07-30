import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { UserService } from "../../user/user.service";
import { UserEntity } from "../../user/user.entity";
import { UserStatus } from "../../user/interfaces";

@Injectable()
export class JwtHttpStrategy extends PassportStrategy(Strategy, "jwt-http") {
  constructor(private readonly userService: UserService, private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([ExtractJwt.fromAuthHeaderAsBearerToken()]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>("JWT_SECRET_KEY", "keyboard_cat"),
    });
  }

  public async validate(payload: { email: string }): Promise<UserEntity> {
    const userEntity = await this.userService.findOne({ email: payload.email });

    if (!userEntity) {
      throw new UnauthorizedException();
    }

    if (userEntity.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException("userNotActive");
    }

    return userEntity;
  }
}
