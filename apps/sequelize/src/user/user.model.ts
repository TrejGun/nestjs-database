import { Column, Model, Table } from "sequelize-typescript";

import { IUser, IUserCreateDto, UserRole, UserStatus } from "./interfaces";
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
  })
  public id: number;

  @Column
  public firstName: string;

  @Column
  public lastName: string;

  @Column
  public email: string;

  @Column
  public password: string;

  @Column
  public roles: Array<UserRole>;

  @Column
  public status: UserStatus;

  @Column
  public createdAt: string;

  @Column
  public updatedAt: string;
}
