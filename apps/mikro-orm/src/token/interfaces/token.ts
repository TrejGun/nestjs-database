export enum TokenType {
  EMAIL = "EMAIL",
  PASSWORD = "PASSWORD",
}

export interface IToken {
  id: number;
  code: string;
  tokenType: TokenType;
  createdAt: string;
  updatedAt: string;
}
