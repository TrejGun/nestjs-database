import { Column, Model, Table } from "sequelize-typescript";

import { IToken, TokenType } from "./interfaces";
import { ns } from "../common/constants";
import { UserModel } from "../user/user.model";

@Table({
  schema: ns,
  tableName: "user",
  underscored: true,
})
export class TokenModel extends Model<IToken> implements IToken {
  @Column({
    primaryKey: true,
    autoIncrement: true,
  })
  public id: number;

  @Column
  public code: string;

  @Column
  public type: TokenType;

  public readonly user: UserModel;

  @Column
  public createdAt: string;

  @Column
  public updatedAt: string;
}

TokenModel.belongsTo(UserModel, { targetKey: "id" });
