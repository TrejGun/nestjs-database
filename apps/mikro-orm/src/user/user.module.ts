import {Module} from "@nestjs/common";
import {UserService} from "./user.service";
import {UserController} from "./user.controller";
import {UserEntity} from "./user.entity";
import {MikroOrmModule} from "@mikro-orm/nestjs";

@Module({
  imports: [MikroOrmModule.forFeature([UserEntity])],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
