import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";

import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { UserModel, UserSchema } from "./user.model";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: UserModel.name,
        schema: UserSchema,
      },
    ]),
    ConfigModule,
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
