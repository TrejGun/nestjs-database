import { Enum, Entity, EntityRepositoryType, PrimaryKey, Property } from "@mikro-orm/core";

import { ns } from "../common/constants";
import { IUser, UserRole, UserStatus } from "./interfaces";

@Entity({ collection: `${ns}.user` })
export class UserEntity {
  [EntityRepositoryType]?: IUser;

  @PrimaryKey()
  public id: number;

  @Property({ columnType: "varchar" })
  public firstName: string;

  @Property({ columnType: "varchar" })
  public lastName: string;

  @Property({ columnType: "varchar" })
  public email: string;

  @Property({ columnType: "varchar", hidden: true })
  public password?: string;

  @Enum({ items: () => UserRole, array: true, default: [UserRole.USER] })
  public roles: Array<UserRole>;

  @Enum({
    items: () => UserStatus,
    default: UserStatus.PENDING,
  })
  public status: UserStatus;
}
