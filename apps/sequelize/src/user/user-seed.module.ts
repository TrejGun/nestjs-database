import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";

import { UserModel } from "./user.model";
import { AuthModel } from "../auth/auth.model";
import { TokenModel } from "../token/token.model";
import { UserSeedService } from "./user-seed.service";

@Module({
  imports: [SequelizeModule.forFeature([UserModel, AuthModel, TokenModel])],
  providers: [UserSeedService],
  exports: [UserSeedService],
})
export class UserSeedModule {}
