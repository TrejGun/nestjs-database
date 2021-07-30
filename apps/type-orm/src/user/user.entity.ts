import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

import { IUser, UserRole, UserStatus } from "./interfaces";
import { ns } from "../common/constants";

@Entity({ schema: ns, name: "user" })
export class UserEntity extends BaseEntity implements IUser {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: "varchar" })
  public firstName: string;

  @Column({ type: "varchar" })
  public lastName: string;

  @Column({ type: "varchar" })
  public email: string;

  @Column({ type: "varchar", select: false })
  public password: string;

  @Column({
    type: "enum",
    enum: UserRole,
    array: true,
  })
  public roles: Array<UserRole>;

  @Column({
    type: "enum",
    enum: UserStatus,
  })
  public status: UserStatus;
}
