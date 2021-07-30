import { Entity, PrimaryKey, Property, ManyToOne, EntityRepositoryType, Enum } from "@mikro-orm/core";

import { ns } from "../common/constants";
import { IToken, TokenType } from "./interfaces";
import { UserEntity } from "../user/user.entity";

@Entity({ collection: `${ns}.token` })
export class TokenEntity {
  [EntityRepositoryType]?: IToken;

  @PrimaryKey()
  public id: number;

  @Property({ type: "varchar" })
  public code: string;

  @Enum({ items: () => TokenType })
  public type: TokenType;

  @ManyToOne()
  public user: UserEntity;

  @Property({ type: "int" })
  public userId: number;

  @Property()
  public createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  public updatedAt = new Date();
}
