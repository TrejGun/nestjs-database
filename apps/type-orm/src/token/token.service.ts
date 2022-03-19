import { randomBytes } from "crypto";
import { FindOptionsWhere, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { TokenEntity } from "./token.entity";
import { UserEntity } from "../user/user.entity";
import { TokenType } from "./interfaces";

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(TokenEntity)
    private readonly tokenEntityRepository: Repository<TokenEntity>,
  ) {}

  public findOne(where: FindOptionsWhere<TokenEntity>): Promise<TokenEntity | null> {
    return this.tokenEntityRepository.findOne({ where, relations: { user: true } });
  }

  public async getToken(type: TokenType, userEntity: UserEntity): Promise<TokenEntity> {
    // working around https://github.com/typeorm/typeorm/issues/1090
    const tokenEntity = await this.tokenEntityRepository.findOne({
      where: {
        type,
        userId: userEntity.id,
      },
    });

    if (tokenEntity) {
      // update timestamps
      return tokenEntity.save();
    } else {
      return this.tokenEntityRepository
        .create({
          type,
          code: randomBytes(3).toString("hex").toUpperCase(),
          user: userEntity,
        })
        .save();
    }
  }
}
