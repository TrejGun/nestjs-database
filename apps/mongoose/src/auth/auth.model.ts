import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";

import { UserDocument } from "../user/user.model";
import { IAuth } from "./interfaces";

@Schema()
export class AuthModel implements IAuth {
  @Prop()
  public refreshToken: string;

  @Prop()
  public refreshTokenExpiresAt: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "UserModel" })
  public user: UserDocument;

  @Prop()
  public createdAt: string;

  @Prop()
  public updatedAt: string;
}

export type AuthDocument = AuthModel & Document;

export const AuthSchema = SchemaFactory.createForClass(AuthModel);
