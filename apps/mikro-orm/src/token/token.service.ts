import { randomBytes } from "crypto";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@mikro-orm/nestjs";
import { FilterQuery } from "@mikro-orm/core";

import { TokenEntity } from "./token.entity";
import { UserEntity } from "../user/user.entity";
import { TokenType } from "./interfaces";
import { EntityRepository } from "@mikro-orm/postgresql";

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(TokenEntity)
    private readonly tokenEntityRepository: EntityRepository<TokenEntity>,
  ) {}

  public findOne(where: FilterQuery<TokenEntity>): Promise<TokenEntity | null> {
    return this.tokenEntityRepository.findOne(where, {
      // TODO fix me
      // relations: ["user"]
    });
  }

  public async getToken(tokenType: TokenType, userEntity: UserEntity): Promise<TokenEntity> {
    // working around https://github.com/typeorm/typeorm/issues/1090
    let tokenEntity = await this.tokenEntityRepository.findOne({
      tokenType,
      user: userEntity,
    });

    if (tokenEntity) {
      // update timestamps
      await this.tokenEntityRepository.flush();
      return tokenEntity;
    } else {
      tokenEntity = this.tokenEntityRepository.create({
        code: randomBytes(3).toString("hex").toUpperCase(),
        tokenType,
        user: userEntity,
      });

      tokenEntity.id = await this.tokenEntityRepository.nativeInsert(userEntity);

      return tokenEntity;
    }
  }
}
