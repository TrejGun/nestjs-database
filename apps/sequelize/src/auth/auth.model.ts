import { Column, DataType, Model, Table } from "sequelize-typescript";

import { ns } from "../common/constants";
import { UserModel } from "../user/user.model";
import { IAuth } from "./interfaces";

@Table({
  schema: ns,
  tableName: "auth",
  underscored: true,
})
export class AuthModel extends Model<IAuth> implements IAuth {
  @Column({
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
    type: DataType.UUID,
  })
  public refreshToken: string;

  @Column({
    type: DataType.BIGINT,
  })
  public refreshTokenExpiresAt: number;

  public readonly user: UserModel;
}

AuthModel.belongsTo(UserModel, { targetKey: "id" });
