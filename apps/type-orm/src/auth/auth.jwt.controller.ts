import { Body, ClassSerializerInterceptor, Controller, HttpCode, Post, UseInterceptors } from "@nestjs/common";

import { Public } from "../common/decorators";
import { IJwt } from "../common/jwt";
import { AuthService } from "./auth.service";
import { UserService } from "../user/user.service";
import {
  LogoutDto,
  RefreshDto,
  LoginDto,
  VerifyEmailDto,
  ForgotPasswordDto,
  RestorePasswordDto,
  ResendEmailVerificationDto,
} from "./dto";
import { UserCreateDto } from "../user/dto";

@Public()
@Controller("/auth")
export class AuthJwtController {
  constructor(private readonly authService: AuthService, private readonly userService: UserService) {}

  @Post("login")
  public login(@Body() data: LoginDto): Promise<IJwt> {
    return this.authService.login(data);
  }

  @Post("refresh")
  async refreshToken(@Body() data: RefreshDto): Promise<IJwt> {
    return this.authService.refresh(data);
  }

  @Post("logout")
  public async logout(@Body() data: LogoutDto): Promise<boolean> {
    await this.authService.logout(data);
    return true;
  }

  @Post("/signup")
  @UseInterceptors(ClassSerializerInterceptor)
  public async signup(@Body() data: UserCreateDto): Promise<IJwt> {
    const userEntity = await this.authService.signup(data);
    return this.authService.loginUser(userEntity);
  }

  @Post("/forgot-password")
  @HttpCode(204)
  public forgotPassword(@Body() data: ForgotPasswordDto): Promise<void> {
    return this.authService.forgotPassword(data);
  }

  @Post("/restore-password")
  @HttpCode(204)
  public restorePassword(@Body() data: RestorePasswordDto): Promise<void> {
    return this.authService.restorePassword(data);
  }

  @Post("/email-verification")
  @HttpCode(204)
  public emailVerification(@Body() data: VerifyEmailDto): Promise<void> {
    return this.authService.emailVerification(data);
  }

  @Post("/resend-email-verification")
  @HttpCode(204)
  public resendEmailVerification(@Body() data: ResendEmailVerificationDto): Promise<void> {
    return this.authService.resendEmailVerification(data);
  }
}
