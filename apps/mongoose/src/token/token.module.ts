import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { TokenService } from "./token.service";
import { TokenModel, TokenSchema } from "./token.model";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: TokenModel.name,
        schema: TokenSchema,
      },
    ]),
  ],
  providers: [TokenService],
  exports: [TokenService],
})
export class TokenModule {}
