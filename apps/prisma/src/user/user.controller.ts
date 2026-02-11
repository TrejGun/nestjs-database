import { Controller, Get } from "@nestjs/common";
import { User as UserType } from "@prisma/client";

import { Roles, User } from "../common/decorators";
import { UserRole } from "./interfaces";
import { UserService } from "./user.service";

@Controller("/users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get("/profile")
  public profile(@User() user: UserType): UserType {
    return user;
  }

  @Get("/")
  @Roles(UserRole.ADMIN)
  public findAll(): Promise<{ rows: Array<UserType>; count: number }> {
    return this.userService.findAndCount().then(([rows, count]) => ({ rows, count }));
  }
}
