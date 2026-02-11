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
      include: [UserModel],
    });
  }

  public async getToken(type: TokenType, userEntity: UserModel): Promise<TokenModel> {
    const tokenEntity = await this.tokenModel.findOne({
      where: {
        type,
        userId: userEntity.id,
      } as any,
    });

    if (tokenEntity) {
      // update timestamps
      return tokenEntity.save();
    } else {
      return this.tokenModel
        .build({
          code: randomBytes(3).toString("hex").toUpperCase(),
          type,
          userId: userEntity.id,
        } as any)
        .save();
    }
  }
}
