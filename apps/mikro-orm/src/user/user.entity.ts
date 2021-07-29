import { Enum, Entity, EntityRepositoryType, PrimaryKey, Property } from "@mikro-orm/core";

import { ns } from "../common/constants";
import { IUser, UserRole } from "./interfaces";

@Entity({ tableName: `${ns}.user` })
export class UserEntity {
  [EntityRepositoryType]?: IUser;

  @PrimaryKey()
  id: number;

  @Property({ columnType: "varchar" })
  email: string;

  @Property({ columnType: "varchar", hidden: true })
  password?: string;

  @Enum({ items: () => UserRole, array: true, default: [UserRole.User] })
  roles: Array<UserRole>;
}
