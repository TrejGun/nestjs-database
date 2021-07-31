import { ApiProperty } from "@nestjs/swagger";
import { IsEmail } from "class-validator";

import { IForgotPasswordDto } from "../interfaces";

export class ForgotPasswordDto implements IForgotPasswordDto {
  @ApiProperty()
  @IsEmail()
  public email: string;
}
