import { Controller, Get } from "@nestjs/common";

import { Roles, User } from "../common/decorators";
import { Tables } from "../database/supabase.types";
import { UserRole } from "./interfaces";
import { UserService } from "./user.service";

@Controller("/users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get("/profile")
  public profile(@User() user: Tables<"user">): Tables<"user"> {
    return user;
  }

  @Get("/")
  @Roles(UserRole.ADMIN)
  public findAll(): Promise<{ rows: Array<Tables<"user">>; count: number }> {
    return this.userService.findAndCount().then(([rows, count]) => ({ rows, count }));
  }
}
