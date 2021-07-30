import { Column, Model, Table } from "sequelize-typescript";
import { DataTypes, Sequelize } from "sequelize";

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

  @Column({
    type: DataTypes.ARRAY(DataTypes.ENUM(...Object.values(UserRole))),
  })
  public roles: Array<UserRole>;

  @Column({
    type: DataTypes.ENUM(...Object.values(UserStatus)),
  })
  public status: UserStatus;

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
