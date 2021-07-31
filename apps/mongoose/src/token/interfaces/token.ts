export enum TokenType {
  EMAIL = "EMAIL",
  PASSWORD = "PASSWORD",
}

export interface IToken {
  // TODO fix me
  // id: number;
  code: string;
  type: TokenType;
  createdAt: string;
  updatedAt: string;
}
