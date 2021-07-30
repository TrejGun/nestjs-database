import { Module } from "@nestjs/common";
import { MikroOrmModule } from "@mikro-orm/nestjs";

import { TokenService } from "./token.service";
import { TokenEntity } from "./token.entity";

@Module({
  imports: [MikroOrmModule.forFeature([TokenEntity])],
  providers: [TokenService],
  exports: [TokenService],
})
export class TokenModule {}
