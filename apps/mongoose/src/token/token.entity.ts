import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";

import { UserDocument } from "../user/user.entity";
import { IToken, TokenType } from "./interfaces";

@Schema()
export class TokenEntity implements IToken {
  @Prop()
  public code: string;

  @Prop()
  public type: TokenType;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User" })
  public user: UserDocument;

  @Prop()
  public createdAt: string;

  @Prop()
  public updatedAt: string;
}

export type TokenDocument = TokenEntity & Document;

export const TokenSchema = SchemaFactory.createForClass(TokenEntity);
