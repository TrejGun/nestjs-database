import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

import { IUser, UserRole, UserStatus } from "./interfaces";

@Schema()
export class UserModel implements IUser {
  @Prop()
  public id: string;

  @Prop()
  public firstName: string;

  @Prop()
  public lastName: string;

  @Prop()
  public email: string;

  @Prop()
  public password: string;

  @Prop()
  public roles: Array<UserRole>;

  @Prop()
  public status: UserStatus;

  @Prop()
  public createdAt: string;

  @Prop()
  public updatedAt: string;
}

export type UserDocument = UserModel & Document;

export const UserSchema = SchemaFactory.createForClass(UserModel);
