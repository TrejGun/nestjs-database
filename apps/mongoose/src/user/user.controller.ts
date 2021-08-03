import { Controller, Get } from "@nestjs/common";

import { UserModel } from "./user.model";
import { Roles, User } from "../common/decorators";
import { UserRole } from "./interfaces";
import { UserService } from "./user.service";

@Controller("/users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get("/profile")
  getGloballyProtectedProfile(@User() user: UserModel): UserModel {
    return user;
  }

  @Get("/")
  @Roles(UserRole.ADMIN)
  public findAll(): Promise<{ rows: Array<UserModel>; count: number }> {
    return this.userService.findAndCount().then(([rows, count]) => ({ rows, count }));
  }
}
