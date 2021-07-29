import { Body, Controller, HttpCode, Ip, Post } from "@nestjs/common";

import { AuthService } from "./auth.service";
import { LoginDto, LogoutDto, RefreshDto } from "./dto";
import { IJwt } from "../common/jwt";
import { Public } from "../common/decorators";

@Public()
@Controller("/auth")
export class AuthJwtController {
  constructor(private readonly authService: AuthService) {}

  @Post("/login")
  @HttpCode(200)
  public login(@Body() data: LoginDto, @Ip() ip: string): Promise<IJwt> {
    return this.authService.login(data, ip);
  }

  @Post("/refresh")
  @HttpCode(200)
  async refreshToken(@Body() data: RefreshDto, @Ip() ip: string): Promise<IJwt> {
    return this.authService.refresh(data, ip);
  }

  @Post("/logout")
  @HttpCode(204)
  public async logout(@Body() data: LogoutDto): Promise<void> {
    await this.authService.logout(data);
  }
}
