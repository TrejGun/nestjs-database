import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { TokenService } from "./token.service";
import { TokenEntity, TokenSchema } from "./token.entity";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: TokenEntity.name,
        schema: TokenSchema,
      },
    ]),
  ],
  providers: [TokenService],
  exports: [TokenService],
})
export class TokenModule {}
