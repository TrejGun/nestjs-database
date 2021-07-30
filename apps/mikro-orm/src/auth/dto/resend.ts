import { ApiProperty } from "@nestjs/swagger";
import { IsEmail } from "class-validator";

import { IResendEmailVerificationDto } from "../interfaces";

export class ResendEmailVerificationDto implements IResendEmailVerificationDto {
  @ApiProperty()
  @IsEmail()
  public email: string;
}
