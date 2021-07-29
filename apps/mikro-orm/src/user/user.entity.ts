import { Enum, Entity, EntityRepositoryType, PrimaryKey, Property } from "@mikro-orm/core";

import { ns } from "../common/constants";
import { IUser, UserRole } from "./interfaces";

@Entity({ tableName: `${ns}.user` })
export class UserEntity {
  [EntityRepositoryType]?: IUser;

  @PrimaryKey()
  public id: number;

  @Property({ columnType: "varchar" })
  public email: string;

  @Property({ columnType: "varchar", hidden: true })
  public password?: string;

  @Enum({ items: () => UserRole, array: true, default: [UserRole.User] })
  public roles: Array<UserRole>;
}
