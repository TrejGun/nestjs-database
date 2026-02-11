import { randomBytes } from "crypto";

import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { FilterQuery, Model } from "mongoose";

import { TokenDocument, TokenModel } from "./token.model";
import { UserDocument } from "../user/user.model";
import { TokenType } from "./interfaces";

@Injectable()
export class TokenService {
  constructor(
    @InjectModel(TokenModel.name)
    private tokenModel: Model<TokenDocument>,
  ) {}

  public findOne(where: FilterQuery<TokenDocument>): Promise<TokenDocument | null> {
    return this.tokenModel.findOne(where, {}, { populate: "user" }).exec();
  }

  public async getToken(type: TokenType, userEntity: UserDocument): Promise<TokenModel> {
    // working around https://github.com/typeorm/typeorm/issues/1090
    const tokenEntity = await this.tokenModel.findOne({
      type,
      user: userEntity,
    });

    if (tokenEntity) {
      // update timestamps
      return tokenEntity.save();
    } else {
      return new this.tokenModel({
        code: randomBytes(3).toString("hex").toUpperCase(),
        type,
        user: userEntity,
      }).save();
    }
  }

  public remove(tokenEntity: TokenDocument): Promise<any> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return tokenEntity.deleteOne();
  }
}
