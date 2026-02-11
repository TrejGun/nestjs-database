import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { DatabaseModule } from "../database/database.module";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";

@Module({
  imports: [DatabaseModule, ConfigModule],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
