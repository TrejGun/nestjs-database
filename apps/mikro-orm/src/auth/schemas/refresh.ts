import {ApiProperty} from "@nestjs/swagger";

import {IsString} from "class-validator";

import {IRefreshFields} from "../interfaces";
import {PlainObject} from "@mikro-orm/core";

export class JwtRefreshTokenSchema extends PlainObject implements IRefreshFields {
  @ApiProperty()
  @IsString()
  public refreshToken: string;
}
