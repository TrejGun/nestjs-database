import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";

import { DatabaseModule } from "../database/database.module";
import { AuthService } from "./auth.service";
import { UserModule } from "../user/user.module";
import { AuthJwtController } from "./auth.jwt.controller";
import { JwtHttpStrategy } from "./strategies";
import { TokenModule } from "../token/token.module";
import { EmailModule } from "../email/email.module";

@Module({
  imports: [
    DatabaseModule,
    UserModule,
    PassportModule,
    TokenModule,
    EmailModule,
    ConfigModule,
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
