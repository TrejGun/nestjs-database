import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { UserEntity } from "./user.entity";
import { AuthEntity } from "../auth/auth.entity";
import { TokenEntity } from "../token/token.entity";
import { UserRole, UserStatus } from "./interfaces";

@Injectable()
export class UserSeedService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userEntityRepository: Repository<UserEntity>,
    @InjectRepository(AuthEntity)
    private readonly authEntityRepository: Repository<AuthEntity>,
    @InjectRepository(TokenEntity)
    private readonly tokenEntityRepository: Repository<TokenEntity>,
  ) {}

  public async setup(): Promise<UserEntity> {
    let userEntity = await this.userEntityRepository.findOne({ where: { email: "trejgun@gmail.com" } });

    if (!userEntity) {
      userEntity = await this.userEntityRepository
        .create({
          firstName: "Trej",
          lastName: "Gun",
          email: "trejgun@gmail.com",
          password: "92f357f4a898825de204b25fffec4a0a1ca486ad1e25643502e33b5ebeefc3ff", // My5up3r5tr0ngP@55w0rd
          roles: [UserRole.ADMIN],
          status: UserStatus.ACTIVE,
        })
        .save();
    }

    return userEntity;
  }

  public async teardown(): Promise<void> {
    await this.tokenEntityRepository.createQueryBuilder().delete().execute();
    await this.authEntityRepository.createQueryBuilder().delete().execute();
    await this.userEntityRepository.createQueryBuilder().delete().execute();
  }
}
