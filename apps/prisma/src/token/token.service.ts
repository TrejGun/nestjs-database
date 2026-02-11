import { randomBytes } from "crypto";

import { Injectable } from "@nestjs/common";
import { Prisma, Token, TokenType, User } from "@prisma/client";

import { PrismaService } from "../database/prisma.service";

@Injectable()
export class TokenService {
  constructor(private readonly prismaService: PrismaService) {}

  public findOne(where: Prisma.TokenWhereInput): Promise<(Token & { user: User }) | null> {
    return this.prismaService.token.findFirst({
      where,
      include: { user: true },
    });
  }

  public async getToken(type: TokenType, userEntity: User): Promise<Token & { user: User }> {
    const tokenEntity = await this.prismaService.token.findFirst({
      where: {
        type,
        userId: userEntity.id,
      },
      include: { user: true },
    });

    if (tokenEntity) {
      // update timestamps
      return this.prismaService.token.update({
        where: { id: tokenEntity.id },
        data: { updatedAt: new Date() },
        include: { user: true },
      });
    } else {
      return this.prismaService.token.create({
        data: {
          code: randomBytes(3).toString("hex").toUpperCase(),
          type,
          userId: userEntity.id,
        },
        include: { user: true },
      });
    }
  }

  public async remove(tokenEntity: Token): Promise<void> {
    await this.prismaService.token.delete({ where: { id: tokenEntity.id } });
  }
}
