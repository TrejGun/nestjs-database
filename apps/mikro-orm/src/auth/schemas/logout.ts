import {ApiProperty} from "@nestjs/swagger";

import {IsString} from "class-validator";

import {ILogoutFields} from "../interfaces";
import {PlainObject} from "@mikro-orm/core";

export class JwtLogoutSchema extends PlainObject implements ILogoutFields {
  @ApiProperty()
  @IsString()
  public refreshToken: string;
}
