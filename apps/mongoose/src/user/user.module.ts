import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { UserEntity, UserSchema } from "./user.entity";
import { MongooseModule } from "@nestjs/mongoose";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: UserEntity.name,
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
