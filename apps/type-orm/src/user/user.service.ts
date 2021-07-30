import { ConfigService } from "@nestjs/config";
import { Injectable, ConflictException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { createHash } from "crypto";
import { Repository, FindConditions } from "typeorm";

import { UserEntity } from "./user.entity";
import { IUserCreateDto, UserStatus } from "./interfaces";
import { IPasswordDto } from "../auth/interfaces";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userEntityRepository: Repository<UserEntity>,
    private readonly configService: ConfigService,
  ) {}

  public findOne(where: FindConditions<UserEntity>): Promise<UserEntity | undefined> {
    return this.userEntityRepository.findOne({ where });
  }

  public findAndCount(): Promise<[Array<UserEntity>, number]> {
    return this.userEntityRepository.findAndCount();
  }

  public async getByCredentials(email: string, password: string): Promise<UserEntity | undefined> {
    return this.userEntityRepository.findOne({
      where: {
        email,
        password: this.createPasswordHash(password),
      },
    });
  }

  public async create(data: IUserCreateDto): Promise<UserEntity> {
    let user = await this.findOne({ email: data.email });

    if (user) {
      throw new ConflictException();
    }

    user = await this.userEntityRepository
      .create({
        ...data,
        password: this.createPasswordHash(data.password),
      })
      .save();

    return user;
  }

  public createPasswordHash(password: string): string {
    const passwordSecret = this.configService.get<string>("PASSWORD_SECRET", "keyboard_cat");
    return createHash("sha256").update(password).update(passwordSecret).digest("hex");
  }

  public updatePassword(userEntity: UserEntity, dto: IPasswordDto): Promise<UserEntity> {
    userEntity.password = this.createPasswordHash(dto.password);
    return userEntity.save();
  }

  public activate(userEntity: UserEntity): Promise<UserEntity> {
    userEntity.status = UserStatus.ACTIVE;
    return userEntity.save();
  }
}
