import { randomBytes } from "crypto";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { FilterQuery, Model } from "mongoose";

import { TokenDocument, TokenEntity } from "./token.entity";
import { UserDocument } from "../user/user.entity";
import { TokenType } from "./interfaces";

@Injectable()
export class TokenService {
  constructor(
    @InjectModel(TokenEntity.name)
    private tokenModel: Model<TokenDocument>,
  ) {}

  public findOne(where: FilterQuery<TokenDocument>): Promise<TokenDocument | null> {
    return this.tokenModel.findOne(where, {}, { populate: "user" }).exec();
  }

  public async getToken(type: TokenType, userEntity: UserDocument): Promise<TokenEntity> {
    // working around https://github.com/typeorm/typeorm/issues/1090
    const tokenEntity = await this.tokenModel.findOne({
      type,
      user: userEntity,
    });

    if (tokenEntity) {
      // update timestamps
      return tokenEntity.save();
    } else {
      // eslint-disable-next-line new-cap
      return new this.tokenModel({
        code: randomBytes(3).toString("hex").toUpperCase(),
        type,
        user: userEntity,
      }).save();
    }
  }

  public remove(tokenEntity: TokenDocument): Promise<TokenDocument> {
    return tokenEntity.remove();
  }
}
