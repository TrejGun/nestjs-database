import { Logger, Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { ConfigModule } from "@nestjs/config";

import { UserService } from "./user.service";
import { UserModel } from "./user.model";
import { UsersController } from "./user.controller";

@Module({
  imports: [SequelizeModule.forFeature([UserModel]), ConfigModule],
  controllers: [UsersController],
  providers: [Logger, UserService],
  exports: [UserService],
})
export class UserModule {}
