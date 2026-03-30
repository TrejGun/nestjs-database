import { EntityRepositoryType } from "@mikro-orm/core";
import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/decorators/legacy";

import { UserEntity } from "../user/user.entity";
import { ns } from "../common/constants";
import { IAuth } from "./interfaces";

@Entity({ collection: `${ns}.auth` })
export class AuthEntity {
  [EntityRepositoryType]?: IAuth;

  @PrimaryKey()
  public id: number;

  @Property({ columnType: "varchar" })
  public refreshToken: string;

  @Property({ columnType: "bigint" })
  public refreshTokenExpiresAt: number;

  @ManyToOne()
  public user: UserEntity;

  @Property()
  public createdAt? = new Date();

  @Property({ onUpdate: () => new Date() })
  public updatedAt? = new Date();
}
