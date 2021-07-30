import { Controller, Get } from "@nestjs/common";

import { UserService } from "./user.service";
import { UserModel } from "./user.model";
import { Roles, User } from "../common/decorators";
import { UserRole } from "./interfaces";

@Controller("/users")
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Get("/")
  @Roles(UserRole.ADMIN)
  public search(): Promise<Array<UserModel>> {
    return this.userService.findAll({});
  }

  @Get("/profile")
  public profile(@User() user: UserModel): UserModel {
    return user;
  }
}
