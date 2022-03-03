import { EntityRepository } from "@mikro-orm/postgresql";
import { Injectable, ConflictException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@mikro-orm/nestjs";
import { FilterQuery } from "@mikro-orm/core";
import { createHash } from "crypto";

import { UserEntity } from "./user.entity";
import { IUserCreateDto, UserRole, UserStatus } from "./interfaces";
import { IPasswordDto } from "../auth/interfaces";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userEntityRepository: EntityRepository<UserEntity>,
    private readonly configService: ConfigService,
  ) {}

  public findOne(where: FilterQuery<UserEntity>): Promise<UserEntity | null> {
    return this.userEntityRepository.findOne(where);
  }

  public findAndCount(where: FilterQuery<UserEntity> = {}): Promise<[Array<UserEntity>, number]> {
    return this.userEntityRepository.findAndCount(where);
  }

  public async getByCredentials(email: string, password: string): Promise<UserEntity | null> {
    return this.userEntityRepository.findOne({
      email,
      password: this.createPasswordHash(password),
    });
  }

  public async create(data: IUserCreateDto): Promise<UserEntity> {
    let userEntity = await this.findOne({ email: data.email });

    if (userEntity) {
      throw new ConflictException();
    }

    userEntity = this.userEntityRepository.create({
      ...data,
      roles: [UserRole.USER],
      password: this.createPasswordHash(data.password),
    });

    await this.userEntityRepository.persistAndFlush(userEntity);

    return userEntity;
  }

  public createPasswordHash(password: string): string {
    const passwordSecret = this.configService.get<string>("PASSWORD_SECRET", "keyboard_cat");
    return createHash("sha256").update(password).update(passwordSecret).digest("hex");
  }

  public async updatePassword(userEntity: UserEntity, dto: IPasswordDto): Promise<UserEntity> {
    userEntity.password = this.createPasswordHash(dto.password);
    await this.userEntityRepository.flush();
    return userEntity;
  }

  public async activate(userEntity: UserEntity): Promise<UserEntity> {
    userEntity.status = UserStatus.ACTIVE;
    await this.userEntityRepository.flush();
    return userEntity;
  }
}
