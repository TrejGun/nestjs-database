import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

import { ns } from "../common/constants";
import { UserEntity } from "../user/user.entity";
import { IToken, TokenType } from "./interfaces";

@Entity({ schema: ns, name: "token" })
export class TokenEntity extends BaseEntity implements IToken {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: "varchar" })
  public code: string;

  @Column({
    type: "enum",
    enum: TokenType,
  })
  public type: TokenType;

  @JoinColumn()
  @OneToOne(_type => UserEntity)
  public user: UserEntity;

  @Column({ type: "int" })
  public userId: number;

  @Column({ type: "timestamptz" })
  public createdAt: string;

  @Column({ type: "timestamptz" })
  public updatedAt: string;

  @BeforeInsert()
  public beforeInsert(): void {
    const date = new Date();
    this.createdAt = date.toISOString();
    this.updatedAt = date.toISOString();
  }

  @BeforeUpdate()
  public beforeUpdate(): void {
    const date = new Date();
    this.updatedAt = date.toISOString();
  }
}
