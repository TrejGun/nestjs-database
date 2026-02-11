import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";

import { TokenService } from "./token.service";
import { TokenModel } from "./token.model";

@Module({
  imports: [SequelizeModule.forFeature([TokenModel])],
  providers: [TokenService],
  exports: [TokenService],
})
export class TokenModule {}
