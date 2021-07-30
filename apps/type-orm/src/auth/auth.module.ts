import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { AuthService } from "./auth.service";
import { AuthEntity } from "./auth.entity";
import { UserModule } from "../user/user.module";
import { AuthJwtController } from "./auth.jwt.controller";
import { JwtHttpStrategy } from "./strategies";
import { EmailModule } from "../email/email.module";
import { TokenModule } from "../token/token.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([AuthEntity]),
    UserModule,
    PassportModule,
    ConfigModule,
    EmailModule,
    TokenModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>("JWT_SECRET_KEY"),
      }),
    }),
  ],
  controllers: [AuthJwtController],
  providers: [AuthService, JwtHttpStrategy],
  exports: [AuthService],
})
export class AuthModule {}
