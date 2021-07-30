import { randomBytes } from "crypto";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";

import { WhereOptions } from "sequelize";
import { TokenModel } from "./token.model";
import { TokenType } from "./interfaces";
import { UserModel } from "../user/user.model";

@Injectable()
export class TokenService {
  constructor(
    @InjectModel(TokenModel)
    private tokenModel: typeof TokenModel,
  ) {}

  public findOne(where: WhereOptions<TokenModel>): Promise<TokenModel | null> {
    return this.tokenModel.findOne({
      where,
      // TODO fixme
      // relations: ["user"],
    });
  }

  public async getToken(type: TokenType, _userEntity: UserModel): Promise<TokenModel> {
    // working around https://github.com/typeorm/typeorm/issues/1090
    const tokenEntity = await this.tokenModel.findOne({
      type,
      // TODO fixme
      // user: userEntity,
    });

    if (tokenEntity) {
      // update timestamps
      return tokenEntity.save();
    } else {
      return this.tokenModel
        .build({
          code: randomBytes(3).toString("hex").toUpperCase(),
          type,
          // TODO fix me
          // user: userEntity,
        })
        .save();
    }
  }
}
