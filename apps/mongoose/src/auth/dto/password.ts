import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

import { IPasswordDto } from "../interfaces";

export class ValidatePasswordDto implements IPasswordDto {
  @ApiProperty()
  @IsString()
  public password: string;

  @ApiProperty()
  @IsString()
  public confirm: string;
}
