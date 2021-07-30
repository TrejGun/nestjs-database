import { Module } from "@nestjs/common";

import { TokenService } from "./token.service";
import { TokenModel } from "./token.model";
import { SequelizeModule } from "@nestjs/sequelize";

@Module({
  imports: [SequelizeModule.forFeature([TokenModel])],
  providers: [TokenService],
  exports: [TokenService],
})
export class TokenModule {}
