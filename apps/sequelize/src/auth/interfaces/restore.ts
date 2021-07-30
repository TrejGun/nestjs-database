import { IPasswordDto } from "./password";

export interface IRestorePasswordDto extends IPasswordDto {
  token: string;
}
