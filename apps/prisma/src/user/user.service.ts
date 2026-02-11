import { createHash } from "crypto";

import { ConflictException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Prisma, User, UserRole, UserStatus } from "@prisma/client";

import { PrismaService } from "../database/prisma.service";
import { IUserCreateDto } from "./interfaces";
import { IPasswordDto } from "../auth/interfaces";

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  public findOne(where: Prisma.UserWhereUniqueInput): Promise<User | null> {
    return this.prismaService.user.findUnique({ where });
  }

  public async findAndCount(): Promise<[Array<User>, number]> {
    return this.prismaService.$transaction([this.prismaService.user.findMany(), this.prismaService.user.count()]);
  }

  public async getByCredentials(email: string, password: string): Promise<User | null> {
    return this.prismaService.user.findFirst({
      where: {
        email,
        password: this.createPasswordHash(password),
      },
    });
  }

  public async create(data: IUserCreateDto): Promise<User> {
    const userEntity = await this.prismaService.user.findUnique({ where: { email: data.email } });

    if (userEntity) {
      throw new ConflictException();
    }

    return this.prismaService.user.create({
      data: {
        ...data,
        roles: [UserRole.USER],
        status: UserStatus.PENDING,
        password: this.createPasswordHash(data.password),
      },
    });
  }

  public createPasswordHash(password: string): string {
    const passwordSecret = this.configService.get<string>("PASSWORD_SECRET", "keyboard_cat");
    return createHash("sha256").update(password).update(passwordSecret).digest("hex");
  }

  public updatePassword(userEntity: User, dto: IPasswordDto): Promise<User> {
    return this.prismaService.user.update({
      where: { id: userEntity.id },
      data: { password: this.createPasswordHash(dto.password) },
    });
  }

  public activate(userEntity: User): Promise<User> {
    return this.prismaService.user.update({
      where: { id: userEntity.id },
      data: { status: UserStatus.ACTIVE },
    });
  }
}
