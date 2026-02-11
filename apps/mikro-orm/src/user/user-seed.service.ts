import { Injectable } from "@nestjs/common";
import { MikroORM } from "@mikro-orm/core";

import { UserEntity } from "./user.entity";
import { AuthEntity } from "../auth/auth.entity";
import { TokenEntity } from "../token/token.entity";
import { UserRole, UserStatus } from "./interfaces";

@Injectable()
export class UserSeedService {
  constructor(private readonly orm: MikroORM) {}

  public async setup(): Promise<UserEntity> {
    const em = this.orm.em.fork();

    let userEntity = await em.findOne(UserEntity, { email: "trejgun@gmail.com" });

    if (!userEntity) {
      userEntity = em.create(UserEntity, {
        firstName: "Trej",
        lastName: "Gun",
        email: "trejgun@gmail.com",
        password: "92f357f4a898825de204b25fffec4a0a1ca486ad1e25643502e33b5ebeefc3ff", // My5up3r5tr0ngP@55w0rd
        roles: [UserRole.ADMIN],
        status: UserStatus.ACTIVE,
      });

      await em.persistAndFlush(userEntity);
    }

    return userEntity;
  }

  public async teardown(): Promise<void> {
    const em = this.orm.em.fork();

    await em.nativeDelete(TokenEntity, {});
    await em.nativeDelete(AuthEntity, {});
    await em.nativeDelete(UserEntity, {});
  }
}
