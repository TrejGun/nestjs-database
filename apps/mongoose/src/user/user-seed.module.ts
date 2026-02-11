import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { UserModel, UserSchema } from "./user.model";
import { AuthModel, AuthSchema } from "../auth/auth.model";
import { TokenModel, TokenSchema } from "../token/token.model";
import { UserSeedService } from "./user-seed.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserModel.name, schema: UserSchema },
      { name: AuthModel.name, schema: AuthSchema },
      { name: TokenModel.name, schema: TokenSchema },
    ]),
  ],
  providers: [UserSeedService],
  exports: [UserSeedService],
})
export class UserSeedModule {}
