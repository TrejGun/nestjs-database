import { randomBytes } from "crypto";

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@mikro-orm/nestjs";
import { FilterQuery } from "@mikro-orm/core";
import { EntityRepository } from "@mikro-orm/postgresql";

import { TokenEntity } from "./token.entity";
import { UserEntity } from "../user/user.entity";
import { TokenType } from "./interfaces";

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(TokenEntity)
    private readonly tokenEntityRepository: EntityRepository<TokenEntity>,
  ) {}

  public findOne(where: FilterQuery<TokenEntity>): Promise<TokenEntity | null> {
    return this.tokenEntityRepository.findOne(where, {
      populate: ["user"],
    });
  }

  public async getToken(type: TokenType, userEntity: UserEntity): Promise<TokenEntity> {
    let tokenEntity = await this.tokenEntityRepository.findOne({
      type,
      user: userEntity,
    });

    if (tokenEntity) {
      // update timestamps
      await this.tokenEntityRepository.getEntityManager().flush();
      return tokenEntity;
    } else {
      tokenEntity = this.tokenEntityRepository.create({
        code: randomBytes(3).toString("hex").toUpperCase(),
        type,
        user: userEntity,
      });

      await this.tokenEntityRepository.getEntityManager().persistAndFlush(tokenEntity);

      return tokenEntity;
    }
  }

  public remove(tokenEntity: TokenEntity): Promise<void> {
    return this.tokenEntityRepository.getEntityManager().remove(tokenEntity).flush();
  }
}
