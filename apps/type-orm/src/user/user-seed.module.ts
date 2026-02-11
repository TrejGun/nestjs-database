import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { UserEntity } from "./user.entity";
import { AuthEntity } from "../auth/auth.entity";
import { TokenEntity } from "../token/token.entity";
import { UserSeedService } from "./user-seed.service";

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, AuthEntity, TokenEntity])],
  providers: [UserSeedService],
  exports: [UserSeedService],
})
export class UserSeedModule {}
