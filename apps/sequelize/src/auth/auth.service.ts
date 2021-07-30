import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/sequelize";
import { WhereOptions } from "sequelize";
import { v4 } from "uuid";

import { UserService } from "../user/user.service";
import {
  IEmailVerificationDto,
  IForgotPasswordDto,
  ILoginDto,
  IResendEmailVerificationDto,
  IRestorePasswordDto,
} from "./interfaces";
import { AuthModel } from "./auth.model";
import { IJwt } from "../common/jwt";
import { UserModel } from "../user/user.model";
import { EmailService } from "../email/email.service";
import { TokenService } from "../token/token.service";

import { IUserCreateDto, UserStatus } from "../user/interfaces";
import { TokenType } from "../token/interfaces";
import { EmailType } from "../email/interfaces";

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(AuthModel)
    private authModel: typeof AuthModel,
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    private readonly emailService: EmailService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  public async login(data: ILoginDto): Promise<IJwt> {
    const userModel = await this.userService.getByCredentials(data.email, data.password);

    if (!userModel) {
      throw new UnauthorizedException("userNotFound");
    }

    return this.loginUser(userModel);
  }

  public async logout(where: WhereOptions<AuthModel>): Promise<number> {
    return this.authModel.destroy({ where });
  }

  public async refresh(where: WhereOptions<AuthModel>): Promise<IJwt> {
    const authModel = await this.authModel.findOne({ where, include: [AuthModel.associations.user] });

    if (!authModel || authModel.refreshTokenExpiresAt < new Date().getTime()) {
      throw new UnauthorizedException("refreshTokenHasExpired");
    }

    return this.loginUser(authModel.user);
  }

  public async loginUser(userModel: UserModel): Promise<IJwt> {
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
      })
      .save();

    return {
      accessToken: this.jwtService.sign({ email: userModel.email }, { expiresIn: accessTokenExpiresIn }),
      refreshToken: refreshToken,
      accessTokenExpiresAt: date.getTime() + accessTokenExpiresIn * 1000,
      refreshTokenExpiresAt: date.getTime() + refreshTokenExpiresIn * 1000,
    };
  }

  public async signup(data: IUserCreateDto): Promise<UserModel> {
    const userEntity = await this.userService.create(data);

    const baseUrl = this.configService.get<string>("FE_URL", "http://localhost:3005");

    await this.emailService.sendEmail(EmailType.WELCOME, {
      user: userEntity,
      baseUrl,
    });

    const tokenEntity = await this.tokenService.getToken(TokenType.EMAIL, userEntity);

    await this.emailService.sendEmail(EmailType.EMAIL_VERIFICATION, {
      token: tokenEntity,
      user: userEntity,
      baseUrl,
    });

    return userEntity;
  }

  public async forgotPassword(data: IForgotPasswordDto): Promise<void> {
    const userEntity = await this.userService.findOne({ email: data.email });

    if (!userEntity) {
      // if user is not found - return positive status
      return;
    }

    if (userEntity.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException("userIsNotActive");
    }

    const tokenEntity = await this.tokenService.getToken(TokenType.PASSWORD, userEntity);

    const baseUrl = this.configService.get<string>("FE_URL", "http://localhost:3005");

    await this.emailService.sendEmail(EmailType.FORGOT_PASSWORD, {
      token: tokenEntity,
      user: userEntity,
      baseUrl,
    });
  }

  public async restorePassword(data: IRestorePasswordDto): Promise<void> {
    const tokenEntity = await this.tokenService.findOne({ code: data.token, type: TokenType.PASSWORD });

    if (!tokenEntity) {
      throw new NotFoundException("tokenNotFound");
    }

    await this.userService.updatePassword(tokenEntity.user, data);

    const baseUrl = this.configService.get<string>("FE_URL", "http://localhost:3005");

    await this.emailService.sendEmail(EmailType.RESTORE_PASSWORD, {
      user: tokenEntity.user,
      baseUrl,
    });

    // delete token from db
    await tokenEntity.destroy();
  }

  public async emailVerification(data: IEmailVerificationDto): Promise<void> {
    const tokenEntity = await this.tokenService.findOne({ code: data.token, type: TokenType.EMAIL });

    if (!tokenEntity) {
      throw new NotFoundException("tokenNotFound");
    }

    await this.userService.activate(tokenEntity.user);

    // delete token from db
    await tokenEntity.destroy();
  }

  public async resendEmailVerification(data: IResendEmailVerificationDto): Promise<void> {
    const userEntity = await this.userService.findOne({ email: data.email });

    if (!userEntity) {
      // if user is not found - return positive status
      return;
    }

    const tokenEntity = await this.tokenService.getToken(TokenType.EMAIL, userEntity);

    const baseUrl = this.configService.get<string>("FE_URL", "http://localhost:3005");

    await this.emailService.sendEmail(EmailType.EMAIL_VERIFICATION, {
      token: tokenEntity,
      user: userEntity,
      baseUrl,
    });
  }
}
