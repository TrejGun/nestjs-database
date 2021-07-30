export enum TokenType {
  EMAIL = "EMAIL",
  PASSWORD = "PASSWORD",
}

export interface IToken {
  id: number;
  code: string;
  type: TokenType;
  createdAt: string;
  updatedAt: string;
}
