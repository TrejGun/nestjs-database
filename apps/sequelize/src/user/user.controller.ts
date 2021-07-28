import { Body, Controller, Get, Post } from "@nestjs/common";

import { UserService } from "./user.service";
import { UserModel } from "./user.model";
import { IUserCreateDto } from "./interfaces";

@Controller("/user")
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Get("/")
  public search(): Promise<Array<UserModel>> {
    return this.userService.findAll({});
  }

  @Post("/")
  public create(@Body() body: IUserCreateDto): Promise<UserModel> {
    return this.userService.create(body);
  }
}
