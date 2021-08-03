import { BelongsTo, Column, Model, Table } from "sequelize-typescript";

import { IToken, TokenType } from "./interfaces";
import { ns } from "../common/constants";
import { UserModel } from "../user/user.model";
import { DataTypes, Sequelize } from "sequelize";

@Table({
  schema: ns,
  tableName: "token",
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

  @BelongsTo(() => UserModel, {
    foreignKey: "user_id",
    targetKey: "id",
  })
  public readonly user: UserModel;

  @Column({
    allowNull: false,
    defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    type: DataTypes.DATE,
  })
  public createdAt: string;

  @Column({
    allowNull: false,
    defaultValue: Sequelize.fn("NOW"),
    type: DataTypes.DATE,
  })
  public updatedAt: string;
}
