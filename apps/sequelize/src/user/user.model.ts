import { Column, Model, Table, DataType } from "sequelize-typescript";

import { IUserCreateDto } from "./interfaces";
import { ns } from "../common/constants";

export interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

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
