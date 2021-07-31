import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";

import { UserDocument } from "../user/user.entity";
import { IAuth } from "./interfaces";

@Schema()
export class AuthEntity implements IAuth {
  @Prop()
  public refreshToken: string;

  @Prop()
  public refreshTokenExpiresAt: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User" })
  public user: UserDocument;

  @Prop()
  public createdAt = new Date();

  @Prop()
  public updatedAt = new Date();
}

export type AuthDocument = AuthEntity & Document;

export const AuthSchema = SchemaFactory.createForClass(AuthEntity);
