import {IUser, UserRole} from "./interfaces";
import {Enum, Entity, EntityRepositoryType, PrimaryKey, Property} from "@mikro-orm/core";
@Entity({tableName: "test1.user"})
export class UserEntity {
  [EntityRepositoryType]?: IUser;

  @PrimaryKey()
  id: number;

  @Property({columnType: "varchar"})
  email: string;

  @Property({columnType: "varchar", hidden: true})
  password?: string;

  @Enum({items: () => UserRole, array: true, default: [UserRole.User]})
  roles: UserRole[] = [UserRole.User];
}
