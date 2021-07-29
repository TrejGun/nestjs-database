import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/sequelize";
import { WhereOptions } from "sequelize";
import { v4 } from "uuid";

import { UserService } from "../user/user.service";
import { ILoginDto } from "./interfaces";
import { AuthModel } from "./auth.model";
import { IJwt } from "../common/jwt";
import { UserModel } from "../user/user.model";

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(AuthModel)
    private authModel: typeof AuthModel,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  public async login(data: ILoginDto, ip: string): Promise<IJwt> {
    const userModel = await this.userService.getByCredentials(data.email, data.password);

    if (!userModel) {
      throw new UnauthorizedException("userNotFound");
    }

    return this.loginUser(userModel, ip);
  }

  public async logout(where: WhereOptions<AuthModel>): Promise<number> {
    return this.authModel.destroy({ where });
  }

  public async refresh(where: WhereOptions<AuthModel>, ip: string): Promise<IJwt> {
    const authModel = await this.authModel.findOne({ where, include: [AuthModel.associations.user] });

    if (!authModel || authModel.refreshTokenExpiresAt < new Date().getTime()) {
      throw new UnauthorizedException("refreshTokenHasExpired");
    }

    return this.loginUser(authModel.user, ip);
  }

  public async loginUser(userModel: UserModel, ip: string): Promise<IJwt> {
    const refreshToken = v4();
    const date = new Date();

    // it is actually a string
    const accessTokenExpiresIn = ~~this.configService.get<number>("JWT_ACCESS_TOKEN_EXPIRES_IN", 5 * 60);
    const refreshTokenExpiresIn = ~~this.configService.get<number>("JWT_REFRESH_TOKEN_EXPIRES_IN", 30 * 24 * 60 * 60);

    await this.authModel
      .build({
        user: userModel,
        refreshToken,
        refreshTokenExpiresAt: date.getTime() + refreshTokenExpiresIn * 1000,
        ip,
      })
      .save();

    return {
      accessToken: this.jwtService.sign({ email: userModel.email }, { expiresIn: accessTokenExpiresIn }),
      refreshToken: refreshToken,
      accessTokenExpiresAt: date.getTime() + accessTokenExpiresIn * 1000,
      refreshTokenExpiresAt: date.getTime() + refreshTokenExpiresIn * 1000,
    };
  }
}
