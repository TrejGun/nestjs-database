import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";

import { UserDocument } from "../user/user.model";
import { IToken, TokenType } from "./interfaces";

@Schema()
export class TokenModel implements IToken {
  @Prop()
  public code: string;

  @Prop()
  public type: TokenType;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "UserModel" })
  public user: UserDocument;

  @Prop()
  public createdAt: string;

  @Prop()
  public updatedAt: string;
}

export type TokenDocument = TokenModel & Document;

export const TokenSchema = SchemaFactory.createForClass(TokenModel);
