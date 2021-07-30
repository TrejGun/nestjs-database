export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
}

export declare enum UserStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  PENDING = "PENDING",
}

export interface IUser {
  id: number;
  email: string;
  password: string;
  roles: Array<UserRole>;
  status: UserStatus;
}
