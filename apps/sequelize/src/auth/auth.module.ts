import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { SequelizeModule } from "@nestjs/sequelize";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { UserModule } from "../user/user.module";
import { AuthJwtController } from "./auth.jwt.controller";
import { AuthService } from "./auth.service";
import { UserModel } from "../user/user.model";
import { JwtHttpStrategy } from "./strategies";
import { EmailModule } from "../email/email.module";
import { TokenModule } from "../token/token.module";

@Module({
  imports: [
    SequelizeModule.forFeature([UserModel]),
    UserModule,
    PassportModule,
    TokenModule,
    EmailModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>("JWT_SECRET_KEY"),
      }),
    }),
    ConfigModule,
  ],
  controllers: [AuthJwtController],
  providers: [AuthService, JwtHttpStrategy],
  exports: [AuthService],
})
export class AuthModule {}
