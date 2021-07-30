import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";

import { AuthService } from "./auth.service";
import { AuthEntity } from "./auth.entity";
import { UserModule } from "../user/user.module";
import { AuthJwtController } from "./auth.jwt.controller";
import { JwtHttpStrategy } from "./strategies";
import { EmailModule } from "../email/email.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([AuthEntity]),
    UserModule,
    PassportModule,
    ConfigModule,
    EmailModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
    }),
  ],
  controllers: [AuthJwtController],
  providers: [AuthService, JwtHttpStrategy],
  exports: [AuthService],
})
export class AuthModule {}
