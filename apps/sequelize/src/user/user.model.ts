import { Column, DataType, Model, Table } from "sequelize-typescript";

import { IUser, IUserCreateDto } from "./interfaces";
import { ns } from "../common/constants";

@Table({
  schema: ns,
  tableName: "user",
  underscored: true,
})
export class UserModel extends Model<IUser, IUserCreateDto> implements IUser {
  @Column({
    primaryKey: true,
    autoIncrement: true,
    type: DataType.BIGINT,
  })
  public id: string;

  @Column
  public firstName: string;

  @Column
  public lastName: string;

  @Column
  public email: string;

  @Column
  public password: string;

  @Column
  public createdAt: Date;

  @Column
  public updatedAt: Date;
}
