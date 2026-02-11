import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { PrismaModule } from "../database/prisma.module";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";

@Module({
  imports: [PrismaModule, ConfigModule],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
